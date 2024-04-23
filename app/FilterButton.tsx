import React, { useState } from "react";

const filterOptions = [
  { name: "Overview", path: "/" },
  { name: "Ethereum", path: "/client/ethereum" },
  // ... other options
];

export default function FilterButton(props) {
  const [selected, setSelected] = useState("Overview");
  return (
    <div className="links">
      <div className="filterButton black buttonDropdown">
        <div className="filterContainer">
          Overview<div className="down"></div>
        </div>
        <div className="filterMenu">
          {filterOptions.map((option) => (
            <a
              href={option.path}
              key={option.name}
              className={`filterText ${selected === option.name ? "selected" : ""}`}
              onClick={() => setSelected(option.name)}
            >
              <span className="filterName">{option.name}</span>
              {selected === option.name && <span className="checkmark"></span>}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
