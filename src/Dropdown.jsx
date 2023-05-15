import React from "react";
import { useState } from "react";
import "./Dropdown.css";

export default function Dropdown({ open, trigger, menu }) {
  return (
    <div className="dropdown">
      {trigger}
      {open ? (
        <ul className="menu">
          {menu.map((menuItem, index) => (
            <li key={index} className="menu-item">
              {menuItem}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
