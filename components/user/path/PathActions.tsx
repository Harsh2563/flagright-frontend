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
        variant="flat"
        color="danger"
        onClick={resetSelection}
        isDisabled={isLoading || loading || (!startUser && !targetUser)}
        startContent={
          <ResetIcon size={16} className="text-danger" />
        }
      >
        Reset
      </Button>
      <Button
        color="primary"
        onClick={handleFindPath}
        isDisabled={
          isLoading ||
          loading ||
          !startUser ||
          !targetUser ||
          startUser === targetUser
        }
        isLoading={loading}
        startContent={!loading && <RelationsIcon size={16} />}
        className="px-4"
      >
        Find Shortest Path
      </Button>
    </div>
  );
}
