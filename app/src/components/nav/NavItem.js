"use client";

import React from "react";
import Link from "next/link";

const NavItem = ({ href, label, icon: Icon, active, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li key={label} onClick={handleClick}>
      <Link
        href={href}
        className={`group flex rounded-md text-xl font-semibold text-white hover:text-blue-300 hover:underline transition mr-10
        `}
      >
        {/* <Icon className="h-6 w-6 shrink-0" aria-hidden="true" /> */}
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default NavItem;
