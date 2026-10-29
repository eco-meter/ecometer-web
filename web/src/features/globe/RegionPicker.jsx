import { useId } from "react";
import { Icon } from "@iconify/react";

// Dropdown for choosing which region the globe zooms to.
// Shows the current region and lists every option when opened.
export function RegionPicker({ regions, activeSlug, onSelect }) {
  const selectId = useId();

  if (regions.length === 0) return null;

  return (
    <div className='region-picker'>
      <label htmlFor={selectId} className='region-picker__label'>
        Choose a region
      </label>

      <div className='region-picker__field'>
        <Icon
          icon='akar-icons:location'
          className='region-picker__pin'
          aria-hidden='true'
        />
        <select
          id={selectId}
          className='region-picker__select'
          value={activeSlug ?? ""}
          onChange={(event) => onSelect(event.target.value || null)}
        >
          <option value=''>All regions</option>
          {regions.map((region) => (
            <option key={region.id} value={region.slug}>
              {region.name}
            </option>
          ))}
        </select>
        <Icon
          icon='akar-icons:chevron-down'
          className='region-picker__chevron'
          aria-hidden='true'
        />
      </div>
    </div>
  );
}
