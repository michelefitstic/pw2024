import React from "react";

export default function NavbarTab(props) {
  const { index, isSelected, label, onClick } = props;

  return (
    <button
      className={isSelected ? "navbar--tab--selected" : "navbar--tab"}
      onClick={() => {
        onClick(index);
      }}
    >
      {label}
    </button>
  );
}
