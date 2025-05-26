import React from 'react';
import { Card } from '@heroui/card';
import { button as buttonStyles } from '@heroui/theme';
import { Link } from '@heroui/link';

import { ICtaCardProps } from '@/types/home';

export const CtaCard: React.FC<ICtaCardProps> = ({
  title,
  description,
  buttonText,
  buttonHref,
}) => {
  return (
    <Card className="p-6 mt-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-default-500 mt-2">{description}</p>
        </div>
        <Link
          className={buttonStyles({
            color: 'primary',
            variant: 'shadow',
            radius: 'full',
          })}
          href={buttonHref}
        >
          {buttonText}
        </Link>
      </div>
    </Card>
  );
};
