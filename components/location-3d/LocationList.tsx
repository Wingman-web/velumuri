'use client';

import { nearbyLocations, type LocationCategory } from '@/lib/achyutha-locations';

interface LocationListProps {
  activeFilter: LocationCategory | null;
  activeId: number | null;
  disabled: boolean;
  onSelect: (id: number) => void;
}

export function LocationList({ activeFilter, activeId, disabled, onSelect }: LocationListProps) {
  if (!activeFilter) return null;
  const items = nearbyLocations.filter((location) => location.category === activeFilter);

  return (
    <div className="loc3d-list">
      <ul className="loc3d-list-items">
        {items.map((location) => (
          <li key={location.id}>
            <button
              type="button"
              disabled={disabled}
              className={`loc3d-list-item${activeId === location.id ? ' is-active' : ''}`}
              onClick={() => onSelect(location.id)}
            >
              <span className="loc3d-list-item-number">{location.id}</span>
              <span className="loc3d-list-item-body">
                <span className="loc3d-list-item-name">{location.name}</span>
                <span className="loc3d-list-item-meta">
                  {location.distance} · {location.time}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
