"use client";

import React from "react";
import useRoutes from "../../hooks/useRoutes";
import NavItem from "./NavItem";

const Navbar = ({ currentUser }) => {
  const routes = useRoutes(currentUser);

  return (
    <div className="w-full h-20 gap-3 bg-neutral-400">
      {/* <div className="w-full gap-3 fixed z-40 top-0 bg-neutral-400"> */}
      <div></div>
      <nav className="flex flex-row h-full items-center justify-center">
        <ul
          role="list"
          className="flex flex-row items-center justify-center space-x-4"
        >
          {routes.map((item) => (
            <NavItem
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={item.active}
              onClick={item.onClick}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
