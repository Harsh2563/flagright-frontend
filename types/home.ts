export interface HeroSectionProps {
  title: string;
  highlightedTitle: string;
  description: string;
}



export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkText: string;
  linkHref: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}


export interface CtaCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}