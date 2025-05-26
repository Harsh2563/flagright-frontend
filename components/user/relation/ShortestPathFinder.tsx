'use client';

import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Spinner,
  Chip,
  Tooltip,
  Progress,
  Button,
} from '@heroui/react';

import {
  GraphIcon,
  InfoIcon,
  AnalyticsIcon,
  ExclamationIcon,
} from '../../ui/icons';
import {
  PathActions,
  PathGraph,
  PathLegend,
  UserSelector,
} from '../../user/path';

import { IUser, IShortestPathUser, IShortestPath } from '@/types/user';
import { findShortestPath } from '@/services/userService';
import { useUsers } from '@/contexts/UserContext';
import { useToastMessage } from '@/utils/toast';

interface ShortestPathFinderProps {
  users: IUser[];
  isLoading: boolean;
}

export function ShortestPathFinder({
  users,
  isLoading,
}: ShortestPathFinderProps) {
  const [startUser, setStartUser] = useState<string>('');
  const [targetUser, setTargetUser] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pathResult, setPathResult] = useState<IShortestPath | null>(null);
  const [pathLength, setPathLength] = useState<number | null>(null);
  const { getUserById } = useUsers();
  const toast = useToastMessage();

  const handleFindPath = async () => {
    if (!startUser || !targetUser) {
      toast.error('Please select both start and target users');
      setError('Please select both start and target users');

      return;
    }

    if (startUser === targetUser) {
      toast.error('Start and target users must be different');
      setError('Start and target users must be different');

      return;
    }

    setLoading(true);
    setError(null);
    setPathResult(null);
    setPathLength(null);

    try {
      const shortestPathData: IShortestPathUser = {
        startUserId: startUser,
        targetUserId: targetUser,
      };

      const response = await findShortestPath(shortestPathData);

      if (response.status === 'success' && response.data) {
        setPathResult(response.data.path);
        setPathLength(response.data.length);
      } else {
        console.error('Failed to find shortest path');
        setError('Failed to find a path between the selected users');
      }
    } catch (error) {
      console.error('Error finding shortest path:', error);
      toast.error(
        'An error occurred while finding the shortest path. Please try again later.'
      );
      setError('Failed to find a path between the selected users');
    } finally {
      setLoading(false);
    }
  };

  const resetSelection = () => {
    setStartUser('');
    setTargetUser('');
    setPathResult(null);
    setPathLength(null);
    setError(null);
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-gray-900/80 mb-6">
      <CardHeader className="bg-gradient-to-r from-primary-50/50 to-secondary-100/50 dark:from-gray-800/80 dark:to-gray-900/80 flex items-center justify-between dark:border-b dark:border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10 dark:bg-gray-700/50">
            <AnalyticsIcon
              className="text-primary dark:text-gray-300"
              size={24}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold dark:text-gray-200">
              Find Shortest Path Between Users
            </h2>
            <p className="text-sm text-default-500 mt-1">
              Discover the shortest connection path between any two users in the
              network
            </p>
          </div>
        </div>
        <Tooltip content="The shortest path shows how users are connected through transactions. This helps identify indirect relationships between accounts.">
          <Button
            isIconOnly
            className="text-default-500"
            size="sm"
            variant="light"
          >
            <InfoIcon size={18} />
          </Button>
        </Tooltip>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <UserSelector
            borderColor="primary"
            errorMessage={startUser ? '' : 'Start user is required'}
            getUserById={getUserById}
            iconColor="primary"
            label="Start User"
            setUserId={setStartUser}
            userId={startUser}
            users={users}
          />
          <UserSelector
            borderColor="secondary"
            errorMessage={targetUser ? '' : 'Target user is required'}
            getUserById={getUserById}
            iconColor="secondary"
            label="Target User"
            setUserId={setTargetUser}
            userId={targetUser}
            users={users}
          />
        </div>

        <PathActions
          handleFindPath={handleFindPath}
          isLoading={isLoading}
          loading={loading}
          resetSelection={resetSelection}
          startUser={startUser}
          targetUser={targetUser}
        />

        {error && (
          <div className="p-4 mb-4 text-danger bg-danger-50 dark:bg-danger-900/20 rounded-md flex items-center gap-2">
            <ExclamationIcon
              className="text-primary dark:text-danger"
              size={20}
            />
            {error}
          </div>
        )}

        {loading && (
          <div className="py-8 space-y-4">
            <div className="flex justify-center">
              <Spinner color="primary" size="lg" />
            </div>
            <p className="text-center text-default-500">
              Finding the shortest path between users...
            </p>
            <Progress
              isIndeterminate
              aria-label="Loading..."
              className="max-w-md mx-auto"
              color="primary"
              size="sm"
            />
          </div>
        )}

        {pathResult && !loading && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <GraphIcon
                className="text-primary dark:text-gray-400"
                size={20}
              />
              <h3 className="text-lg font-semibold dark:text-gray-200">
                Shortest Path Found
              </h3>
              <Chip className="ml-2" color="success" size="sm" variant="flat">
                Length: {pathLength}
              </Chip>
            </div>
            <div className="p-6 bg-default-50 dark:bg-gray-800/80 rounded-md border border-default-200 dark:border-gray-700">
              <PathGraph path={pathResult} />
            </div>
            <PathLegend />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
