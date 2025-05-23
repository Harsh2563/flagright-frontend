'use client';

import { Button } from '@heroui/react';
import { subtitle } from '../../components/ui/primitives';
import { RelationsIcon } from '../../components/ui/icons';

interface GraphGeneratorProps {
  onGenerateGraph: () => void;
}

export function GraphGenerator({ onGenerateGraph }: GraphGeneratorProps) {
  return (
    <div className="mt-10 relative">
      <div
        className="w-full rounded-xl overflow-hidden shadow-lg h-64 p-8 mb-6 bg-cover bg-center border border-secondary-200/20 dark:border-secondary-600/30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: 'rgba(var(--secondary-500), 0.05)',
          background:
            'linear-gradient(to right, rgba(var(--secondary-500), 0.05), rgba(var(--primary-500), 0.05))',
        }}
      >
        {/* Overlay for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/80 z-0"></div>

        {/* Decorative network nodes */}
        <div className="absolute top-6 left-12 w-3 h-3 rounded-full bg-primary/50 animate-pulse"></div>
        <div className="absolute top-12 left-32 w-2 h-2 rounded-full bg-secondary/50 animate-pulse"></div>
        <div className="absolute bottom-12 right-24 w-4 h-4 rounded-full bg-success/50 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-warning/50 animate-pulse"></div>

        {/* Decorative lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <line
            x1="20%"
            y1="20%"
            x2="40%"
            y2="50%"
            stroke="var(--secondary-500)"
            strokeWidth="1"
          />
          <line
            x1="40%"
            y1="50%"
            x2="60%"
            y2="30%"
            stroke="var(--primary-500)"
            strokeWidth="1"
          />
          <line
            x1="60%"
            y1="30%"
            x2="80%"
            y2="70%"
            stroke="var(--success-500)"
            strokeWidth="1"
          />
        </svg>

        {/* Button container with z-index to stay above the overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <h3 className={subtitle({ class: 'mb-4 text-center max-w-lg' })}>
            Visualize how this user connects with others through shared
            attributes and transactions
          </h3>
          <Button
            color="secondary"
            size="lg"
            className="px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 hover:opacity-90"
            onClick={onGenerateGraph}
            startContent={<RelationsIcon size={28} />}
          >
            Generate Relationship Graph
          </Button>
        </div>
      </div>
    </div>
  );
}
