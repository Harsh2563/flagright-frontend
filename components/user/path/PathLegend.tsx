'use client';

import React from 'react';

import { ArrowRightIcon } from '../../ui/icons';

export function PathLegend() {
  return (
    <div className="mt-4 pt-4 border-t dark:border-gray-700 grid grid-cols-2 md:grid-cols-3 gap-2 text-center text-xs">
      <div className="flex items-center justify-center gap-1">
        <span className="block w-3 h-3 rounded-full bg-primary-100 dark:bg-blue-800/50 border border-primary-200 dark:border-blue-700" />
        <span className="dark:text-gray-300">User</span>
      </div>
      <div className="flex items-center justify-center gap-1">
        <span className="block w-3 h-3 rounded-full bg-secondary-100 dark:bg-purple-800/50 border border-secondary-200 dark:border-purple-700" />
        <span className="dark:text-gray-300">Transaction</span>
      </div>
      <div className="flex items-center justify-center gap-1">
        <ArrowRightIcon className="text-primary dark:text-gray-400" size={14} />
        <span className="dark:text-gray-300">Path Direction</span>
      </div>
    </div>
  );
}
