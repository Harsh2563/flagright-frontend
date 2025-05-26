'use client';

import React from 'react';
import { ArrowRightIcon } from '../../ui/icons';
import {
  IPathNode,
  IShortestPath,
  IPathRelationship,
  IUser,
} from '@/types/user';
import { PathNode } from './PathNode';

// Helper function to get node ID based on type
function getNodeId(node: IPathNode): string {
  return node.type === 'User'
    ? (node.properties as IUser).id
    : (node.properties as any).id;
}

// Function to organize nodes in the correct sequence based on relationships
function organizePathSequence(
  nodes: IPathNode[],
  relationships: IPathRelationship[]
) {
  if (!nodes.length) return [];

  const nodeMap = new Map<string, IPathNode>();
  nodes.forEach((node) => {
    const id =
      node.type === 'User'
        ? (node.properties as IUser).id
        : (node.properties as any).id;
    nodeMap.set(id, node);
  });

  const startNodeIds = new Set(relationships.map((rel) => rel.startNodeId));
  const endNodeIds = new Set(relationships.map((rel) => rel.endNodeId));

  let currentId: string | null = null;
  Array.from(startNodeIds).forEach((id) => {
    if (!endNodeIds.has(id)) {
      currentId = id;
    }
  });

  if (!currentId && relationships.length > 0) {
    currentId = relationships[0].startNodeId;
  }

  const orderedNodes: IPathNode[] = [];
  const visitedRelationships = new Set<string>();

  while (currentId && nodeMap.has(currentId)) {
    const currentNode = nodeMap.get(currentId)!;
    orderedNodes.push(currentNode);

    let nextRel = relationships.find(
      (rel) =>
        rel.startNodeId === currentId &&
        !visitedRelationships.has(`${rel.startNodeId}-${rel.endNodeId}`)
    );

    if (nextRel) {
      visitedRelationships.add(`${nextRel.startNodeId}-${nextRel.endNodeId}`);
      currentId = nextRel.endNodeId;
    } else {
      break;
    }
  }

  return orderedNodes;
}

export function ShortestPathGraph({ path }: { path: IShortestPath }) {
  const { nodes, relationships } = path;

  if (!nodes.length || !relationships.length) {
    return (
      <div className="text-center py-4 text-default-500 dark:text-gray-400">
        No path data available
      </div>
    );
  }

  const orderedNodes = organizePathSequence(nodes, relationships);

  return (
    <div className="overflow-x-auto py-4">
      <div className="flex items-center flex-nowrap min-w-max">
        {orderedNodes.map((node, index) => (
          <React.Fragment key={index}>
            <PathNode node={node} />
            {index < orderedNodes.length - 1 && (
              <div className="flex flex-col items-center mx-3 relative">
                <div className="w-16 h-2 bg-gradient-to-r from-blue-500 to-purple-500 dark:bg-gray-600/50 rounded-full shadow-sm"></div>
                <ArrowRightIcon
                  size={28}
                  className="text-primary-600 dark:text-gray-300 absolute -top-3 drop-shadow-md"
                  strokeWidth={3}
                />
                <div className="text-xs font-medium text-default-700 dark:text-gray-300 mt-3 px-2 py-1 bg-default-100 dark:bg-gray-800 rounded-md border border-default-200 dark:border-gray-700 shadow-sm">
                  {relationships.find(
                    (r) =>
                      r.startNodeId === getNodeId(orderedNodes[index]) &&
                      r.endNodeId === getNodeId(orderedNodes[index + 1])
                  )?.type || 'CONNECTED'}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
