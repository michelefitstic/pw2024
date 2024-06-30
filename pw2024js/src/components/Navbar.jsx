import React, { useState } from "react";
import NavbarTab from "./NavbarTab";

export default function Navbar(props) {
  const endpointNames = [
    "Endpoint 1",
    "Endpoint 2",
    "Endpoint 3",
    "Endpoint 4",
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { getSelectedIndex } = props;

  return (
    <div className="navbar">
      {endpointNames.map((e, i) => {
        return (
          <NavbarTab
            key={i}
            index={i}
            isSelected={i === selectedIndex}
            label={e}
            onClick={(index) => {
              getSelectedIndex(index);
              setSelectedIndex(index);
            }}
          />
        );
      })}
    </div>
  );
}
