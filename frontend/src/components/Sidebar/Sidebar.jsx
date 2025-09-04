import React, { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../../context/Context";
import SBstyles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const Sidebar = ({ onToggle }) => {
  const { user, workspace, associatedNames } = useContext(GlobalContext);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onToggle) onToggle(newState);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  if (!user?.email) return null;

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className={SBstyles.mobileToggle} onClick={toggleMobileSidebar}>
        <FaBars />
      </button>

      <div
        className={`${SBstyles.sidebar} ${
          isExpanded ? SBstyles.expanded : SBstyles.collapsed
        } ${isMobileOpen ? SBstyles.showMobile : SBstyles.hideMobile}`}
      >
        {/* Desktop Toggle */}
        <button className={SBstyles.toggleBtn} onClick={toggleSidebar}>
          {isExpanded ? "<" : ">"}
        </button>

        {/* Associated People */}
        <div className={SBstyles.associatedNames}>
          <h4>Associated People</h4>
          {associatedNames === null ? (
            <p>Loading...</p>
          ) : associatedNames.length > 0 ? (
            <ul>
              {associatedNames.map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          ) : (
            <p>No other people found for this website</p>
          )}
        </div>

        {/* Menu */}
        <nav className={SBstyles.menu}>
          <ul>
            <li onClick={() => handleNavigate("/dashboard")}>Home</li>
            <li onClick={() => handleNavigate("/dashboard/profile")}>
              Profile
            </li>
            <li onClick={() => handleNavigate("/dashboard/jobs")}>Jobs</li>
            <li onClick={() => handleNavigate("/dashboard/pricing")}>
              Pricing
            </li>
            <li onClick={() => handleNavigate("/dashboard/view-jobs")}>
              View Jobs
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
