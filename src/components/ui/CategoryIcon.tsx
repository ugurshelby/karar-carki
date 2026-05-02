import React from 'react';
import { Beer, Coffee, IceCreamCone, UtensilsCrossed } from 'lucide-react';
import type { Category } from '../../types';

interface Props {
  category: Category;
  size?: number;
  className?: string;
}

export default function CategoryIcon({ category, size = 12, className }: Props) {
  const common = { size, strokeWidth: 1.6, className };

  if (category === 'yemek') return <UtensilsCrossed {...common} style={{ color: 'var(--cat-food-color)' }} />;
  if (category === 'kafe') return <Coffee {...common} style={{ color: 'var(--cat-cafe-color)' }} />;
  if (category === 'tatlı') return <IceCreamCone {...common} style={{ color: 'var(--cat-sweet-color)' }} />;
  return <Beer {...common} style={{ color: 'var(--cat-bar-color)' }} />;
}

