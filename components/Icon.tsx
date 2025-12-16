import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof LucideIcons;
  size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, ...props }) => {
  const LucideIcon = LucideIcons[name] as React.ElementType;
  if (!LucideIcon) return null;
  return <LucideIcon size={size} {...props} />;
};
