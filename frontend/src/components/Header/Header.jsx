import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import headerStyle from "./header.module.css";
import config from "../../Api/config";
import { GlobalContext } from "../../context/Context";
import { RiLogoutBoxRLine } from "react-icons/ri";
import logo from "../../assets/logo.png";

const Header = () => {
  // const [logo, setLogo] = useState("");
  const { user, setUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser({});
    navigate("/login");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getHeaderLogo();
  }, []);

  const getHeaderLogo = async () => {
    // Placeholder for logo API if needed
  };

  return (
    <div className={`${headerStyle.mainHeaderContainer}`}>
      {/* Left Section: Logo */}
      <div className={`${headerStyle.section1}`}>
        <div className={`${headerStyle.headerItem}`}>
          {logo?.length > 0 ? (
            <img
              src={logo}
              alt="Logo"
              className={`${headerStyle.logo}`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (user?.email) {
                  navigate("/dashboard");
                } else {
                  navigate("/");
                }
              }}
            />
          ) : (
            <div
              className={`${headerStyle.logo}`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (user?.email) {
                  navigate("/dashboard");
                } else {
                  navigate("/");
                }
              }}
            >
              ----LOGO----
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Only Login/Logout */}
      <div className={`${headerStyle.sectionRight}`}>
        {user && user.email ? (
          <NavLink
            onClick={handleLogout}
            to="/login"
            className={({ isActive }) =>
              `${headerStyle.headerItem} ${headerStyle.link} ${
                headerStyle.headerFont
              } ${isActive ? headerStyle.active : ""}`
            }
          >
            LogOut <RiLogoutBoxRLine />
          </NavLink>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${headerStyle.headerItem} ${headerStyle.link} ${
                headerStyle.headerFont
              } ${isActive ? headerStyle.active : ""}`
            }
          >
            Post a Job
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Header;
