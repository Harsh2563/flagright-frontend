'use client';

import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { Card, CardBody, CardHeader, Divider, Spinner } from '@heroui/react';
import {
  IUserRelationshipGraphProps,
  IUserRelationshipGraphResponse,
} from '@/types/relationship';
import { GraphIcon } from '../ui/icons';

export function UserRelationshipGraph({
  relationships,
  isLoading = false,
  centerUserId,
}: IUserRelationshipGraphProps) {
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [graphEmpty, setGraphEmpty] = useState<boolean>(false);

  useEffect(() => {
    // Clean up function to destroy cytoscape instance when component unmounts
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading || !relationships || !graphContainerRef.current) {
      return;
    }

    const relationshipsArray = Array.isArray(relationships)
      ? relationships
      : [relationships];

    if (relationshipsArray.length === 0 || !relationshipsArray[0]?.data) {
      setGraphEmpty(true);
      return;
    }

    // Process graph data
    const elements = processRelationshipsForGraph(
      relationshipsArray,
      centerUserId
    );

    console.log('Graph elements generated:', elements);

    if (elements.nodes.length === 0) {
      console.log('No nodes found in the processed data');
      setGraphEmpty(true);
      return;
    }

    setGraphEmpty(false);

    // Destroy existing instance if it exists to prevent memory leaks
    if (cyRef.current) {
      cyRef.current.destroy();
      cyRef.current = null;
    }

    try {
      // Create new cytoscape instance with improved styling
      cyRef.current = cytoscape({
        container: graphContainerRef.current,
        elements: elements,
        style: [
          // Node basic styling
          {
            selector: 'node',
            style: {
              'background-color': '#6366F1',
              label: 'data(label)',
              color: '#FFFFFF',
              'text-valign': 'center',
              'text-halign': 'center',
              'text-outline-width': 1,
              'text-outline-color': '#312E81',
              width: 'label',
              height: 'label',
              padding: '18px',
              shape: 'round-rectangle',
              'border-width': 2,
              'border-color': '#4F46E5',
              'font-size': '14px',
              'font-weight': 'bold',
              'text-max-width': '120px',
              'text-wrap': 'wrap',
            },
          },
          // Center node (primary user) styling
          {
            selector: 'node[type="center"]',
            style: {
              'background-color': '#3730A3',
              'border-color': '#818CF8',
              'border-width': 4,
              'font-size': '16px',
              padding: '22px',
              'text-outline-color': '#1E1B4B',
              'text-outline-width': 2,
            },
          },
          // Edge basic styling
          {
            selector: 'edge',
            style: {
              width: 3,
              'line-color': '#94A3B8',
              'target-arrow-color': '#94A3B8',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              label: 'data(label)',
              'font-size': '12px',
              'text-background-color': '#000000',
              'text-background-opacity': 0.7,
              'text-background-padding': '5px',
              'text-background-shape': 'roundrectangle',
              color: '#FFFFFF',
              'font-weight': 'bold',
              'text-margin-y': -10,
            },
          },
          // Direct relationship edge styling
          {
            selector: 'edge[type="direct"]',
            style: {
              'line-color': '#10B981', // Green
              'target-arrow-color': '#10B981',
              width: 3.5,
            },
          },
          // Transaction relationship edge styling
          {
            selector: 'edge[type="transaction"]',
            style: {
              'line-color': '#F59E0B', // Yellow/Orange
              'target-arrow-color': '#F59E0B',
              width: 3.5,
            },
          },
          // Sent transaction edge styling
          {
            selector: 'edge[type="sent"]',
            style: {
              'line-color': '#EF4444', // Red
              'target-arrow-color': '#EF4444',
              width: 3.5,
            },
          },
          // Received transaction edge styling
          {
            selector: 'edge[type="received"]',
            style: {
              'line-color': '#3B82F6', // Blue
              'target-arrow-color': '#3B82F6',
              width: 3.5,
            },
          },
        ],
        // Use a more flexible and visually appealing layout
        layout: {
          name: 'cose',
          idealEdgeLength: 150,
          nodeOverlap: 20,
          refresh: 20,
          fit: true,
          padding: 40,
          randomize: true,
          componentSpacing: 150,
          nodeRepulsion: 8000,
          edgeElasticity: 150,
          nestingFactor: 1.2,
          gravity: 80,
          numIter: 1000,
          initialTemp: 250,
          coolingFactor: 0.99,
          minTemp: 1.0,
        },
      });

      // Add zoom controls
      cyRef.current.on('tap', 'node', function (evt) {
        const node = evt.target;
        cyRef.current?.animate({
          fit: {
            eles: node,
            padding: 50,
          },
          duration: 500,
        });
      });

      // Double tap on background to reset zoom
      cyRef.current.on('dblclick', function (evt) {
        if (evt.target === cyRef.current) {
          cyRef.current?.animate({
            fit: {
              eles: cyRef.current.elements(),
              padding: 40,
            },
            duration: 500,
          });
        }
      });

      // Make it responsive
      const resizeObserver = new ResizeObserver(() => {
        if (cyRef.current) {
          cyRef.current.resize();
          cyRef.current.fit();
        }
      });

      if (graphContainerRef.current) {
        resizeObserver.observe(graphContainerRef.current);
      }

      return () => {
        if (graphContainerRef.current) {
          resizeObserver.unobserve(graphContainerRef.current);
        }
      };
    } catch (error) {
      console.error('Error initializing Cytoscape graph:', error);
      setGraphEmpty(true);
    }
  }, [relationships, isLoading, centerUserId]);

  if (isLoading) {
    return (
      <div className="mt-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-default-50/10">
          <CardHeader className="bg-gradient-to-r from-primary-50/50 to-secondary-100/50 dark:from-primary-600/20 dark:to-secondary-700/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <GraphIcon />
              <h2 className="text-xl font-semibold dark:text-white">
                User Relationship Graph
              </h2>
            </div>
          </CardHeader>
          <Divider />
          <CardBody
            className="flex justify-center items-center"
            style={{ minHeight: '300px' }}
          >
            <Spinner size="lg" color="primary" />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (graphEmpty) {
    return (
      <div className="mt-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-default-50/10">
          <CardHeader className="bg-gradient-to-r from-primary-50/50 to-secondary-100/50 dark:from-primary-600/20 dark:to-secondary-700/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <GraphIcon />
              <h2 className="text-xl font-semibold dark:text-white">
                User Relationship Graph
              </h2>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="flex justify-center items-center py-12">
            <p>No relationship data available to display in graph.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-default-50/10">
        <CardHeader className="bg-gradient-to-r from-primary-50/50 to-secondary-100/50 dark:from-primary-600/20 dark:to-secondary-700/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraphIcon />
            <h2 className="text-xl font-semibold dark:text-white">
              User Relationship Graph
            </h2>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div
            ref={graphContainerRef}
            className="graph-container rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
            style={{ height: '550px', width: '100%' }}
          ></div>
          <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
            <div className="flex items-center justify-center gap-1">
              <span className="block w-3 h-3 rounded-full bg-[#10B981]"></span>
              <span>Direct Relationship</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="block w-3 h-3 rounded-full bg-[#F59E0B]"></span>
              <span>Transaction Relationship</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="block w-3 h-3 rounded-full bg-[#EF4444]"></span>
              <span>Sent Transaction</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="block w-3 h-3 rounded-full bg-[#3B82F6]"></span>
              <span>Received Transaction</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Function to process relationship data into cytoscape-compatible format
function processRelationshipsForGraph(
  relationshipsArray: IUserRelationshipGraphResponse[],
  centerUserId?: string
): { nodes: any[]; edges: any[] } {
  const nodes: any[] = [];
  const edges: any[] = [];
  const nodeIds = new Set<string>();
  const sharedAttributes: Record<string, Set<string>> = {};

  relationshipsArray.forEach((relationship, relationshipIndex) => {
    const data = relationship?.data;
    if (!data) return;

    // Skip if no data is available
    if (
      !data.directRelationships?.length &&
      !data.transactionRelationships?.length &&
      !data.sentTransactions?.length &&
      !data.receivedTransactions?.length
    ) {
      return;
    }

    let centerUser: any = null;

    // Determine the center user
    if (centerUserId) {
      // Add the center user as the first node
      centerUser = {
        data: {
          id: centerUserId,
          label: 'Center User',
          type: 'center',
          concentric: 0,
        },
      };
      nodeIds.add(centerUserId);
      nodes.push(centerUser);
    } else {
      // Determine center user from data (first relationship's "from" user)
      if (data.directRelationships?.[0]?.user) {
        // Just using a placeholder ID for the center user as it's not provided in the data
        const placeholderId = `center-${relationshipIndex}`;
        centerUser = {
          data: {
            id: placeholderId,
            label: 'Center User',
            type: 'center',
            concentric: 0,
          },
        };
        nodeIds.add(placeholderId);
        nodes.push(centerUser);
      }
    }

    if (!centerUser) return;

    // Process direct relationships
    if (data.directRelationships?.length) {
      data.directRelationships.forEach((rel, index) => {
        // Add the related user
        const userId = rel.user.id || `direct-user-${index}`;
        if (!nodeIds.has(userId)) {
          // Get the user's display name from available properties
          const userDisplayName =
            rel.user.firstName ||
            rel.user.email ||
            `User ${userId.substring(0, 8)}`;

          nodes.push({
            data: {
              id: userId,
              label: userDisplayName,
              type: 'user',
              concentric: 1,
            },
          });
          nodeIds.add(userId);
        }

        // Track shared attributes
        const relationshipType = rel.relationshipType || 'Direct';
        if (!sharedAttributes[userId]) {
          sharedAttributes[userId] = new Set<string>();
        }
        sharedAttributes[userId].add(relationshipType);

        // Add the relationship edge with appropriate label
        edges.push({
          data: {
            id: `direct-${centerUser.data.id}-${userId}-${relationshipType}`,
            source: centerUser.data.id,
            target: userId,
            label: relationshipType,
            type: 'direct',
          },
        });
      });
    }

    // Process transaction relationships
    if (data.transactionRelationships?.length) {
      data.transactionRelationships.forEach((rel, index) => {
        // Add the related user
        const userId = rel.user.id || `trans-user-${index}`;
        if (!nodeIds.has(userId)) {
          // Get the user's display name from available properties
          const userDisplayName =
            rel.user.firstName ||
            rel.user.email ||
            `User ${userId.substring(0, 8)}`;

          nodes.push({
            data: {
              id: userId,
              label: userDisplayName,
              type: 'user',
              concentric: 1,
            },
          });
          nodeIds.add(userId);
        }

        // Track shared attributes
        const relationshipType = rel.relationshipType || 'Transaction';
        if (!sharedAttributes[userId]) {
          sharedAttributes[userId] = new Set<string>();
        }
        sharedAttributes[userId].add(relationshipType);

        // Add the relationship edge
        edges.push({
          data: {
            id: `trans-${centerUser.data.id}-${userId}-${relationshipType}`,
            source: centerUser.data.id,
            target: userId,
            label: relationshipType,
            type: 'transaction',
          },
        });
      });
    }

    // Process sent transactions
    if (data.sentTransactions?.length) {
      data.sentTransactions.forEach((tranData, index) => {
        // Add the related user
        const userId = tranData.relatedUser.id || `sent-user-${index}`;
        if (!nodeIds.has(userId)) {
          // Get the user's display name from available properties
          const userDisplayName =
            tranData.relatedUser.firstName ||
            tranData.relatedUser.email ||
            `User ${userId.substring(0, 8)}`;

          nodes.push({
            data: {
              id: userId,
              label: userDisplayName,
              type: 'user',
              concentric: 2,
            },
          });
          nodeIds.add(userId);
        }

        // Format the transaction amount with currency
        const amount = tranData.transaction.amount;
        const currency = tranData.transaction.currency || '';
        const amountFormatted =
          typeof amount === 'number' ? amount.toFixed(2) : String(amount);

        // Add the transaction edge
        edges.push({
          data: {
            id: `sent-${centerUser.data.id}-${userId}-${index}`,
            source: centerUser.data.id,
            target: userId,
            label: `Sent ${amountFormatted} ${currency}`,
            type: 'sent',
            amount: tranData.transaction.amount,
            currency: tranData.transaction.currency,
          },
        });
      });
    }

    // Process received transactions
    if (data.receivedTransactions?.length) {
      data.receivedTransactions.forEach((tranData, index) => {
        // Add the related user
        const userId = tranData.relatedUser.id || `recv-user-${index}`;
        if (!nodeIds.has(userId)) {
          // Get the user's display name from available properties
          const userDisplayName =
            tranData.relatedUser.firstName ||
            tranData.relatedUser.email ||
            `User ${userId.substring(0, 8)}`;

          nodes.push({
            data: {
              id: userId,
              label: userDisplayName,
              type: 'user',
              concentric: 2,
            },
          });
          nodeIds.add(userId);
        }

        // Format the transaction amount with currency
        const amount = tranData.transaction.amount;
        const currency = tranData.transaction.currency || '';
        const amountFormatted =
          typeof amount === 'number' ? amount.toFixed(2) : String(amount);

        // Add the transaction edge
        edges.push({
          data: {
            id: `recv-${userId}-${centerUser.data.id}-${index}`,
            source: userId,
            target: centerUser.data.id,
            label: `Received ${amountFormatted} ${currency}`,
            type: 'received',
            amount: tranData.transaction.amount,
            currency: tranData.transaction.currency,
          },
        });
      });
    }

    // Process shared attributes to create more specific relationships
    Object.keys(sharedAttributes).forEach((userId) => {
      const attributes = Array.from(sharedAttributes[userId]);

      // For users with shared email and phone
      if (
        attributes.includes('SHARED_EMAIL') &&
        attributes.includes('SHARED_PHONE')
      ) {
        // Remove the individual edges
        edges.forEach((edge, index) => {
          if (
            (edge.data.source === centerUser.data.id &&
              edge.data.target === userId) ||
            (edge.data.source === userId &&
              edge.data.target === centerUser.data.id)
          ) {
            if (
              edge.data.label === 'SHARED_EMAIL' ||
              edge.data.label === 'SHARED_PHONE'
            ) {
              edges.splice(index, 1);
            }
          }
        });

        // Add a combined edge
        edges.push({
          data: {
            id: `combined-${centerUser.data.id}-${userId}`,
            source: centerUser.data.id,
            target: userId,
            label: 'SHARED_EMAIL & PHONE',
            type: 'direct',
          },
        });
      }

      // For users with shared device (show number of transactions)
      if (attributes.some((attr) => attr.startsWith('SHARED_DEVICE'))) {
        const deviceAttrs = attributes.filter((attr) =>
          attr.startsWith('SHARED_DEVICE')
        );
        if (deviceAttrs.length > 0) {
          const match = deviceAttrs[0].match(/\((\d+) transactions\)/);
          const transCount = match ? match[1] : '';

          // Add emphasized edge for device sharing
          edges.push({
            data: {
              id: `device-${centerUser.data.id}-${userId}`,
              source: centerUser.data.id,
              target: userId,
              label: `SHARED_DEVICE (${transCount} transactions)`,
              type: 'transaction',
              weight: 3,
            },
          });
        }
      }
    });
  });

  return { nodes, edges };
}
