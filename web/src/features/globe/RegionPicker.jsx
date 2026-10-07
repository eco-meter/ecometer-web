export function RegionPicker({ regions, activeSlug, onSelect }) {
  if (regions.length === 0) return null;

  return (
    <nav className='region-picker' aria-label='Choose a region'>
      <button
        type='button'
        className='region-picker__option'
        aria-pressed={activeSlug === null}
        onClick={() => onSelect(null)}
      >
        All regions
      </button>

      {regions.map((region) => (
        <button
          key={region.id}
          type='button'
          className='region-picker__option'
          aria-pressed={activeSlug === region.slug}
          onClick={() => onSelect(region.slug)}
        >
          {region.name}
        </button>
      ))}
    </nav>
  );
}
