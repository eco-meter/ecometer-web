// House-shaped pin in the cuisine colour. Used by both maps.
export default function MapPin({ color, active = false }) {
  const size = active ? 46 : 34;

  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox='0 0 32 40'
      aria-hidden='true'
      className='map-pin'
    >
      <path
        d='M16 38C16 38 2 23 2 14a14 14 0 0 1 28 0c0 9-14 24-14 24z'
        fill={color}
        stroke={active ? "#08572a" : "#ffffff"}
        strokeWidth='2.5'
      />
      <path d='M10 15l6-6 6 6v6H10z' fill='#ffffff' />
    </svg>
  );
}
