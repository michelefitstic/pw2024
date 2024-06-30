import Navbar from "./Navbar";
import "chart.js/auto";
import { useState } from "react";
import PrimoEndpoint from "./PrimoEndpoint";
import SecondoEndpoint from "./SecondoEndpoint";
import TerzoEndpoint from "./TerzoEndpoint";
import QuartoEndpoint from "./QuartoEndpoint";
import NavbarCombobox from "./NavbarCombobox";

export default function Container() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    //<div className="container">
    <div className="body-content">
      <Navbar
        getSelectedIndex={(navbarIndex) => {
          console.log(selectedIndex);
          setSelectedIndex(navbarIndex);
        }}
      />
      <hr />
      {selectedIndex === 0 && <PrimoEndpoint />}
      {selectedIndex === 1 && <SecondoEndpoint />}
      {selectedIndex === 2 && <TerzoEndpoint />}
      {selectedIndex === 3 && <QuartoEndpoint />}
    </div>
    //</div>
  );
}
