'use client';

import { CATEGORY_FILTERS } from '@/lib/achyutha-locations';
import type { CategoryFilter as CategoryFilterType } from '@/lib/achyutha-locations';

interface CategoryFilterProps {
  active: CategoryFilterType['id'] | null;
  disabled: boolean;
  onSelect: (id: CategoryFilterType['id']) => void;
}

export function CategoryFilter({ active, disabled, onSelect }: CategoryFilterProps) {
  return (
    <div className={`loc3d-controls${disabled ? ' is-disabled' : ''}`} role="tablist" aria-label="Filter nearby locations">
      {CATEGORY_FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          role="tab"
          aria-selected={active === filter.id}
          disabled={disabled}
          className={`loc3d-control${active === filter.id ? ' is-active' : ''}`}
          onClick={() => onSelect(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
