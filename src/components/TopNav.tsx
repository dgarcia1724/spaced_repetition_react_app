import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFolder } from "@fortawesome/free-solid-svg-icons";

interface NavButtonProps {
  to: string;
  icon: typeof faHome | typeof faFolder;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex flex-col items-center ${
        isActive ? "text-blue-700" : "text-blue-500"
      }`}
    >
      <FontAwesomeIcon
        icon={icon}
        className={`text-xl ${isActive ? "text-blue-700" : "text-blue-500"}`}
      />
      <span className={`text-xs mt-1 ${isActive ? "font-bold" : ""}`}>
        {label}
      </span>
      {isActive && <div className="w-full h-1 bg-blue-700 mt-1"></div>}
    </Link>
  );
};

const TopNav: React.FC = () => (
  <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-[100]">
    <div className="flex justify-around py-2">
      <NavButton to="/" icon={faHome} label="Home" />
      <NavButton to="/folders" icon={faFolder} label="Folders" />
    </div>
  </div>
);

export default TopNav;
