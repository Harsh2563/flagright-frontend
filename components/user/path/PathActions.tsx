'use client';

import React from 'react';
import { Button } from '@heroui/react';

import { RelationsIcon, ResetIcon } from '../../ui/icons';

interface PathActionsProps {
  resetSelection: () => void;
  handleFindPath: () => void;
  isLoading: boolean;
  loading: boolean;
  startUser: string;
  targetUser: string;
}

export function PathActions({
  resetSelection,
  handleFindPath,
  isLoading,
  loading,
  startUser,
  targetUser,
}: PathActionsProps) {
  return (
    <div className="flex justify-end gap-2 mb-4">
      <Button
        color="danger"
        isDisabled={isLoading || loading || (!startUser && !targetUser)}
        startContent={<ResetIcon className="text-danger" size={16} />}
        variant="flat"
        onClick={resetSelection}
      >
        Reset
      </Button>
      <Button
        className="px-4"
        color="primary"
        isDisabled={
          isLoading ||
          loading ||
          !startUser ||
          !targetUser ||
          startUser === targetUser
        }
        isLoading={loading}
        startContent={!loading && <RelationsIcon size={16} />}
        onClick={handleFindPath}
      >
        Find Shortest Path
      </Button>
    </div>
  );
}
