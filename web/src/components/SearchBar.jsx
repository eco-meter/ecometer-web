import { useState } from "react";
import { Icon } from "@iconify/react";
import "./SearchBar.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // cosmetic only for Phase 1 – no backend yet
  };

  return (
    <form className='search-bar' onSubmit={handleSubmit}>
      <Icon icon='basil:search-solid' className='search-bar__icon' />
      <input
        type='text'
        placeholder='Discover eco-friendly restaurants...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
