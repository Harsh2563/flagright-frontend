export interface IHeroSectionProps {
  title: string;
  highlightedTitle: string;
  description: string;
}



export interface IFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkText: string;
  linkHref: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}


export interface ICtaCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}