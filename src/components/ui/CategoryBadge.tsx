import React from 'react';
import type { Category } from '../../types';
import CategoryIcon from './CategoryIcon';

interface Props {
  category: Category;
  size?: 'sm' | 'md';
}

function label(category: Category): string {
  if (category === 'yemek') return 'Yemek';
  if (category === 'kafe') return 'Kafe';
  if (category === 'tatlı') return 'Tatlı';
  return 'Bar';
}

function cssKey(category: Category): string {
  if (category === 'yemek') return 'food';
  if (category === 'kafe') return 'cafe';
  if (category === 'tatlı') return 'sweet';
  return 'bar';
}

export default function CategoryBadge({ category, size = 'md' }: Props) {
  const key = cssKey(category);
  const gap = size === 'sm' ? 4 : 5;
  const padding = size === 'sm' ? '2px 6px' : '3px 9px';
  const fontSize = size === 'sm' ? 9 : 11;
  const iconSize = size === 'sm' ? 10 : 12;

  return (
    <span
      className="inline-flex items-center font-bold uppercase"
      style={{
        gap,
        padding,
        borderRadius: 'var(--r-sm)',
        background: `var(--cat-${key}-bg)`,
        border: `0.5px solid var(--cat-${key}-border)`,
        color: `var(--cat-${key}-color)`,
        fontSize,
        letterSpacing: '0.05em',
        lineHeight: 1.1,
      }}
    >
      <CategoryIcon category={category} size={iconSize} />
      {label(category)}
    </span>
  );
}

