import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "@remix-run/react";

const filterOptions = [
  { name: "overview", path: "/" },
  { name: "ethereum", path: "/client/ethereum" },
  // TODO: make this dynamic based on response
];

export default function FilterButton() {
  const location = useLocation(); // Get the current location object

  // Function to determine the initial selection based on the current pathname
  const determineInitialSelection = () => {
    // Extract the client type from the URL, assuming the format is "/client/[clientType]"
    const match = location.pathname.match(/\/client\/([^\/]+)/);

    // If there's a match and the client type exists, capitalize the first letter of each word for display
    if (match && match[1]) {
      return match[1]
        .split("-")
        .map((word) => word.charAt(0) + word.slice(1))
        .join(" ");
    }

    return "overview"; // Default selection if no specific client type is found
  };

  const [selected, setSelected] = useState(determineInitialSelection());
  const [isMenuVisible, setMenuVisible] = useState(false);
  const buttonRef = useRef(null);

  const handleClickOutside = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    // Attach the listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove the listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update selection when pathname changes
  useEffect(() => {
    setSelected(determineInitialSelection());
  }, [location.pathname]);

  return (
    <div className="links">
      <div
        className="filterButton black buttonDropdown"
        ref={buttonRef}
        onClick={() => setMenuVisible(!isMenuVisible)}
      >
        <div className="filterContainer">
          {selected}
          <div className="down"></div>
        </div>
        {isMenuVisible && (
          <div className="filterMenu">
            {filterOptions.map((option) => (
              <Link
                to={option.path}
                key={option.name}
                className={`filterText ${selected === option.name ? "selected" : ""}`}
                onClick={(e) => {
                  if (selected === option.name) {
                    e.preventDefault(); // Prevent navigating to the same page
                  }
                  setSelected(option.name);
                  setMenuVisible(false); // Close the menu on selection
                }}
              >
                <span className="filterName">{option.name}</span>
                {selected === option.name && (
                  <span className="checkmark"></span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
