import React from 'react';
import { Card } from '@heroui/card';
import { button as buttonStyles } from '@heroui/theme';
import { Link } from '@heroui/link';
import { IFeatureCardProps } from '@/types/home';

export const FeatureCard: React.FC<IFeatureCardProps> = ({
  title,
  description,
  icon,
  linkText,
  linkHref,
  color = 'primary',
}) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`p-3 bg-${color}/10 rounded-full`}>{icon}</div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-default-500">{description}</p>
        <Link
          href={linkHref}
          className={buttonStyles({
            color,
            variant: 'flat',
            radius: 'full',
            class: 'mt-2',
          })}
        >
          {linkText}
        </Link>
      </div>
    </Card>
  );
};
