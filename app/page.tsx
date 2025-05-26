import { HeroSection } from '../components/home/HeroSection';
import { FeatureCard } from '../components/home/FeatureCard';
import { CtaCard } from '../components/home/CtaCard';
import {
  UsersIcon,
  TransactionsIcon,
  RelationsIcon,
  AnalyticsIcon,
} from '../components/ui/icons';

export default function Home() {
  return (
    <section className="flex flex-col gap-8 py-8 md:py-10">
      <HeroSection
        description="A powerful visualization system to detect and analyze relationships between user accounts using transaction data and shared attributes in a graph database environment. Identify patterns, connections, and suspicious activities with ease."
        highlightedTitle="Relationship Visualization"
        title="User and Transactions"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <FeatureCard
          color="primary"
          description="View and manage user accounts, profiles, and detect relationships between users based on shared attributes."
          icon={<UsersIcon className="text-primary" size={32} />}
          linkHref="/users"
          linkText="View Users"
          title="User Management"
        />

        <FeatureCard
          color="success"
          description="Track and analyze financial transactions between users, detect patterns and identify suspicious activities."
          icon={<TransactionsIcon className="text-success" size={32} />}
          linkHref="/transactions"
          linkText="View Transactions"
          title="Transaction Tracking"
        />

        <FeatureCard
          color="secondary"
          description="Select any user or transaction to view their connections and relationships in an interactive graph."
          icon={<RelationsIcon className="text-secondary" size={32} />}
          linkHref="/users"
          linkText="Start Exploring"
          title="Relationship Visualization"
        />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex gap-4 p-4 rounded-lg bg-default-50 dark:bg-default-100/10">
            <div className="p-2 bg-primary/10 rounded-full h-fit">
              <UsersIcon className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Shared Attribute Detection
              </h3>
              <p className="text-default-500">
                Automatically identify users connected through shared emails,
                phone numbers, addresses, or payment methods.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-default-50 dark:bg-default-100/10">
            <div className="p-2 bg-success/10 rounded-full h-fit">
              <TransactionsIcon className="text-success" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Direct Transaction Links
              </h3>
              <p className="text-default-500">
                Track credit and debit relationships between users and visualize
                the flow of money throughout the network.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-default-50 dark:bg-default-100/10">
            <div className="p-2 bg-secondary/10 rounded-full h-fit">
              <RelationsIcon className="text-secondary" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Graph Database Integration
              </h3>
              <p className="text-default-500">
                Powered by a robust graph database for efficient relationship
                visualization when exploring individual users and transactions.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-lg bg-default-50 dark:bg-default-100/10">
            <div className="p-2 bg-warning/10 rounded-full h-fit">
              <AnalyticsIcon className="text-warning" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-default-500">
                Perform graph analytics like finding the shortest path between
                users or clustering transactions with similar patterns.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CtaCard
        buttonHref="/users"
        buttonText="View Users"
        description="Browse users and transactions to visualize their connections and identify patterns."
        title="Ready to explore relationships?"
      />
    </section>
  );
}
