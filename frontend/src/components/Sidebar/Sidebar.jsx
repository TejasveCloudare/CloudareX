import React, { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../../context/Context";
import SBstyles from "./Sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { getWorkspacesByWebsite } from "../../Api/services";
import { FaBars } from "react-icons/fa";

const Sidebar = ({ onToggle }) => {
  const { user, workspace } = useContext(GlobalContext);
  const [isExpanded, setIsExpanded] = useState(true);
  const [associatedNames, setAssociatedNames] = useState([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle for desktop expand/collapse
  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onToggle) onToggle(newState); // inform parent (Dashboard)
  };

  // Toggle for mobile open/close
  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  // Fetch associated names
  useEffect(() => {
    if (!workspace?.companyWebsite) return;

    const normalizeWebsite = (url) => {
      try {
        let domain = url.toLowerCase().replace(/^https?:\/\//, "");
        if (domain.startsWith("www.")) domain = domain.slice(4);
        return domain;
      } catch {
        return url;
      }
    };

    const fetchAssociatedNames = async () => {
      const normalizedWebsite = normalizeWebsite(workspace.companyWebsite);
      const data = await getWorkspacesByWebsite(normalizedWebsite);

      if (Array.isArray(data)) {
        const names = data.filter(
          (name) => name?.toLowerCase() !== user?.full_name?.toLowerCase()
        );
        setAssociatedNames(names);
      }
    };

    fetchAssociatedNames();
  }, [workspace?.companyWebsite, user?.full_name]);

  if (!user?.email) return null;

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileOpen(false); // close on mobile after navigation
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
        {/* Optional Desktop Toggle Button */}
        <button className={SBstyles.toggleBtn} onClick={toggleSidebar}>
          {isExpanded ? "<" : ">"}
        </button>

        {/* Associated People */}
        <div className={SBstyles.associatedNames}>
          <h4>Associated People</h4>
          {associatedNames.length > 0 ? (
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
