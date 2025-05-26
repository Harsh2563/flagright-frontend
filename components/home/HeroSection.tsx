import React from 'react';

import { title, subtitle } from '../ui/primitives';

import { IHeroSectionProps } from '@/types/home';

export const HeroSection: React.FC<IHeroSectionProps> = ({
  title: titleText,
  highlightedTitle,
  description,
}) => {
  return (
    <div className="flex flex-col justify-center text-center max-w-4xl mx-auto">
      <h1 className={title({ size: 'lg' })}>
        {titleText}{' '}
        <span className={title({ color: 'violet', size: 'lg' })}>
          {highlightedTitle}
        </span>
      </h1>
      <p className={subtitle({ fullWidth: true, class: 'mt-6' })}>
        {description}
      </p>
    </div>
  );
};
