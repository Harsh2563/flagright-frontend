'use client';

import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Spinner,
  Button,
} from '@heroui/react';
import {
  ITransactionRelationshipGraphProps,
  ITransactionRelationshipGraphResponse,
} from '@/types/relationship';
import { GraphIcon, DownloadIcon } from '../ui/icons';
import { downloadFile } from '@/helper/helper';

export function TransactionRelationshipGraph({
  relationships,
  isLoading = false,
  centerTransactionId,
}: ITransactionRelationshipGraphProps) {
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [graphEmpty, setGraphEmpty] = useState<boolean>(false);

  // Function to export graph data in CSV format
  const exportToCSV = () => {
    if (!relationships?.data) {
      alert('No relationship data available to export.');
      return;
    }

    try {
      const centerTxId = centerTransactionId || 'center-transaction';
      const fileName = `transaction-relationships-${centerTxId.substring(0, 8)}-${new Date().toISOString()}.csv`;
      const graphData = relationships.data;

      // Prepare CSV data
      const headers = [
        'NodeID',
        'NodeType',
        'NodeLabel',
        'ConnectedTo',
        'RelationshipType',
        'Details',
      ];

      // Create a mapping of node IDs to their labels
      const nodeLabels: { [key: string]: string } = {};

      // Center transaction label
      const centerTxLabel = `Transaction ${centerTxId.substring(0, 8)}...`;
      nodeLabels[centerTxId] = centerTxLabel;

      // Sender label
      if (graphData.sender) {
        const senderId = graphData.sender.id || 'sender';
        const senderName =
          `${graphData.sender.firstName || ''} ${graphData.sender.lastName || ''}`.trim() ||
          'Sender';
        nodeLabels[senderId] = senderName;
      }

      // Receiver label
      if (graphData.receiver) {
        const receiverId = graphData.receiver.id || 'receiver';
        const receiverName =
          `${graphData.receiver.firstName || ''} ${graphData.receiver.lastName || ''}`.trim() ||
          'Receiver';
        nodeLabels[receiverId] = receiverName;
      }

      // Shared device transaction labels
      if (graphData.sharedDeviceTransactions?.length) {
        graphData.sharedDeviceTransactions.forEach(
          (relationshipData, index) => {
            const transaction = relationshipData.transaction;
            const txId = transaction.id || `device-tx-${index}`;
            const txLabel = `${transaction.amount} ${transaction.currency}`;
            nodeLabels[txId] = txLabel;
          }
        );
      }

      // Shared IP transaction labels
      if (graphData.sharedIPTransactions?.length) {
        graphData.sharedIPTransactions.forEach((relationshipData, index) => {
          const transaction = relationshipData.transaction;
          const txId = transaction.id || `ip-tx-${index}`;
          const txLabel = `${transaction.amount} ${transaction.currency}`;
          nodeLabels[txId] = txLabel;
        });
      }

      const rows: string[][] = [];

      // Add sender relationship
      if (graphData.sender) {
        const senderId = graphData.sender.id || 'sender';
        const senderName = nodeLabels[senderId];

        rows.push([
          senderId,
          'user',
          senderName,
          centerTxLabel,
          'flow',
          'Sends money to center transaction',
        ]);
      }

      // Add receiver relationship
      if (graphData.receiver) {
        const receiverId = graphData.receiver.id || 'receiver';
        const receiverName = nodeLabels[receiverId];

        // Add the relationship from center to receiver
        rows.push([
          centerTxId,
          'center',
          centerTxLabel,
          receiverName,
          'flow',
          'Sends money to receiver',
        ]);

        // Add receiver as a standalone node
        rows.push([
          receiverId,
          'user',
          receiverName,
          '',
          '',
          'Transaction receiver',
        ]);
      }

      // Add shared device transactions
      if (graphData.sharedDeviceTransactions?.length) {
        graphData.sharedDeviceTransactions.forEach(
          (relationshipData, index) => {
            const transaction = relationshipData.transaction;
            const txId = transaction.id || `device-tx-${index}`;
            const txLabel = nodeLabels[txId];

            // Add the relationship from center to shared device transaction
            rows.push([
              centerTxId,
              'center',
              centerTxLabel,
              txLabel,
              'shared-device',
              `Shared device: ${transaction.deviceId || 'Unknown'}`,
            ]);

            // Add the shared device transaction as a standalone node
            rows.push([
              txId,
              'transaction',
              txLabel,
              '',
              '',
              `Transaction with shared device, timestamp: ${transaction.timestamp}`,
            ]);
          }
        );
      }

      // Add shared IP transactions
      if (graphData.sharedIPTransactions?.length) {
        graphData.sharedIPTransactions.forEach((relationshipData, index) => {
          const transaction = relationshipData.transaction;
          const txId = transaction.id || `ip-tx-${index}`;
          const txLabel = nodeLabels[txId];

          // Add the relationship from center to shared IP transaction
          rows.push([
            centerTxId,
            'center',
            centerTxLabel,
            txLabel,
            'shared-ip',
            'Shared IP address',
          ]);

          // Add the shared IP transaction as a standalone node
          rows.push([
            txId,
            'transaction',
            txLabel,
            '',
            '',
            `Transaction with shared IP, timestamp: ${transaction.timestamp}`,
          ]);
        });
      }

      // If there are no rows (i.e., no relationships), add a message or skip export
      if (rows.length === 0) {
        alert('No relationships to export.');
        return;
      }

      // Convert to CSV
      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      downloadFile(blob, fileName);
    } catch (error) {
      console.error('Error exporting transaction graph data to CSV:', error);
      alert('Failed to export data as CSV. Please try again.');
    }
  };

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

    if (!relationships.data) {
      setGraphEmpty(true);
      return;
    }

    // Process graph data
    const elements = processTransactionRelationshipsForGraph(
      relationships,
      centerTransactionId
    );

    console.log('Transaction graph elements generated:', elements);

    if (elements.nodes.length === 0) {
      console.log('No nodes found in the processed transaction data');
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
      // Create new cytoscape instance with improved styling for transactions
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
          // Center transaction node styling
          {
            selector: 'node[type="center"]',
            style: {
              'background-color': '#059669', // Green for center transaction
              'border-color': '#10B981',
              'border-width': 4,
              'font-size': '16px',
              padding: '22px',
              'text-outline-color': '#064E3B',
              'text-outline-width': 2,
            },
          },
          // Sender/Receiver nodes
          {
            selector: 'node[type="user"]',
            style: {
              'background-color': '#3B82F6', // Blue for users
              'border-color': '#60A5FA',
              'border-width': 3,
              'font-size': '14px',
              padding: '16px',
            },
          },
          // Related transaction nodes
          {
            selector: 'node[type="transaction"]',
            style: {
              'background-color': '#F59E0B', // Orange for related transactions
              'border-color': '#FBBF24',
              'border-width': 2,
              'font-size': '12px',
              padding: '14px',
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
          // Transaction flow edges (sender/receiver)
          {
            selector: 'edge[type="flow"]',
            style: {
              'line-color': '#10B981', // Green for transaction flow
              'target-arrow-color': '#10B981',
              width: 4,
            },
          },
          // Shared device relationship edges
          {
            selector: 'edge[type="shared-device"]',
            style: {
              'line-color': '#DC2626', // Red for shared device
              'target-arrow-color': '#DC2626',
              width: 3.5,
              'line-style': 'dashed',
            },
          },
          // Shared IP relationship edges
          {
            selector: 'edge[type="shared-ip"]',
            style: {
              'line-color': '#7C3AED', // Purple for shared IP
              'target-arrow-color': '#7C3AED',
              width: 3.5,
              'line-style': 'dotted',
            },
          },
        ], // Use a more flexible and visually appealing layout
        layout: {
          name: 'cose',
          idealEdgeLength: () => 150,
          nodeOverlap: 20,
          refresh: 20,
          fit: true,
          padding: 40,
          randomize: true,
          componentSpacing: 150,
          nodeRepulsion: () => 8000,
          edgeElasticity: () => 150,
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
      console.error('Error initializing Cytoscape transaction graph:', error);
      setGraphEmpty(true);
    }
  }, [relationships, isLoading, centerTransactionId]);

  if (isLoading) {
    return (
      <div className="mt-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-default-50/10">
          <CardHeader className="bg-gradient-to-r from-primary-50/50 to-secondary-100/50 dark:from-primary-600/20 dark:to-secondary-700/10 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <GraphIcon />
              <h2 className="text-xl font-semibold dark:text-white">
                Transaction Relationship Graph
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
                Transaction Relationship Graph
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
              Transaction Relationship Graph
            </h2>
          </div>{' '}
          <Button
            variant="light"
            color="primary"
            size="sm"
            startContent={<DownloadIcon size={16} />}
            className="whitespace-nowrap"
            onPress={() => {
              exportToCSV();
            }}
          >
            Export CSV
          </Button>
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
              <span>Transaction Flow</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="block w-3 h-1 bg-[#DC2626]"></span>
              <span>Shared Device</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="block w-3 h-1 bg-[#7C3AED] border-dotted border-2"></span>
              <span>Shared IP</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <span className="block w-3 h-3 rounded-full bg-[#059669]"></span>
              <span>Center Transaction</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Function to process transaction relationship data into cytoscape-compatible format
function processTransactionRelationshipsForGraph(
  relationship: ITransactionRelationshipGraphResponse,
  centerTransactionId?: string
): { nodes: any[]; edges: any[] } {
  const nodes: any[] = [];
  const edges: any[] = [];
  const nodeIds = new Set<string>();

  const data = relationship.data;
  if (!data) return { nodes, edges };

  // Create center transaction node
  const centerNode = {
    data: {
      id: centerTransactionId || 'center-transaction',
      label: `Transaction\n${centerTransactionId?.substring(0, 8) || 'Center'}...`,
      type: 'center',
    },
  };
  nodes.push(centerNode);
  nodeIds.add(centerNode.data.id);
  // Add sender node
  if (data.sender) {
    const senderId = data.sender.id || 'sender';
    if (!nodeIds.has(senderId)) {
      const senderName =
        `${data.sender.firstName || ''} ${data.sender.lastName || ''}`.trim() ||
        'Sender';
      nodes.push({
        data: {
          id: senderId,
          label: `${senderName}\n${senderId.substring(0, 8)}...`,
          type: 'user',
        },
      });
      nodeIds.add(senderId);
    }

    // Add edge from sender to center transaction
    edges.push({
      data: {
        id: `sender-${senderId}-${centerNode.data.id}`,
        source: senderId,
        target: centerNode.data.id,
        label: 'Sends To',
        type: 'flow',
      },
    });
  }

  // Add receiver node
  if (data.receiver) {
    const receiverId = data.receiver.id || 'receiver';
    if (!nodeIds.has(receiverId)) {
      const receiverName =
        `${data.receiver.firstName || ''} ${data.receiver.lastName || ''}`.trim() ||
        'Receiver';
      nodes.push({
        data: {
          id: receiverId,
          label: `${receiverName}\n${receiverId.substring(0, 8)}...`,
          type: 'user',
        },
      });
      nodeIds.add(receiverId);
    }

    // Add edge from center transaction to receiver
    edges.push({
      data: {
        id: `${centerNode.data.id}-receiver-${receiverId}`,
        source: centerNode.data.id,
        target: receiverId,
        label: 'Receives From',
        type: 'flow',
      },
    });
  } // Process shared device transactions
  if (data.sharedDeviceTransactions?.length) {
    data.sharedDeviceTransactions?.forEach((relationshipData, relIndex) => {
      const transaction = relationshipData.transaction;
      const txId = transaction.id || `device-tx-${relIndex}`;

      if (!nodeIds.has(txId)) {
        nodes.push({
          data: {
            id: txId,
            label: `Device Tx\n${transaction.amount} ${transaction.currency}\n${txId.substring(0, 8)}...`,
            type: 'transaction',
          },
        });
        nodeIds.add(txId);
      }

      // Connect to center transaction with shared device edge
      edges.push({
        data: {
          id: `device-${centerNode.data.id}-${txId}`,
          source: centerNode.data.id,
          target: txId,
          label: `Shared Device\n${transaction.deviceId ? `Device: ${transaction.deviceId.substring(0, 8)}...` : ''}`,
          type: 'shared-device',
        },
      });
    });
  }

  // Process shared IP transactions
  if (data.sharedIPTransactions?.length) {
    data.sharedIPTransactions?.forEach((relationshipData, relIndex) => {
      const transaction = relationshipData.transaction;
      const txId = transaction.id || `ip-tx-${relIndex}`;

      if (!nodeIds.has(txId)) {
        nodes.push({
          data: {
            id: txId,
            label: `IP Tx\n${transaction.amount} ${transaction.currency}\n${txId.substring(0, 8)}...`,
            type: 'transaction',
          },
        });
        nodeIds.add(txId);
      }

      // Connect to center transaction with shared IP edge
      edges.push({
        data: {
          id: `ip-${centerNode.data.id}-${txId}`,
          source: centerNode.data.id,
          target: txId,
          label: 'Shared IP',
          type: 'shared-ip',
        },
      });
    });
  }

  return { nodes, edges };
}
