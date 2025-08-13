import React from "react";
import profileStyle from "./Profile.module.css";
import { useOutletContext } from "react-router-dom";
import ProfileInfo from "../DbProfileComponents/ProfileInfo";

const Profile = () => {
  const { user, workspace } = useOutletContext();

  // Extract domain from company website
  // const extractDomain = (url) => {
  //   if (!url) return "";
  //   try {
  //     const { hostname } = new URL(
  //       url.startsWith("http") ? url : `https://${url}`
  //     );
  //     return hostname.replace(/^www\./, "");
  //   } catch {
  //     return url.replace(/^https?:\/\/(www\.)?/, "");
  //   }
  // };

  // const companyDomain = extractDomain(workspace?.companyWebsite);
  // const logoUrl = `https://logo.clearbit.com/${companyDomain}`;

  return (
    <div className={profileStyle.container}>
      <ProfileInfo />
      {/* <h2>Profile</h2>
      <p>Email: {workspace?.email || user?.email}</p>
      <p>Company Website: {workspace?.companyWebsite}</p>

      {companyDomain && (
        <div className={profileStyle.logoSection}>
          <p>Company Logo:</p>
          <img
            src={logoUrl}
            alt="Company Logo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-logo.png"; // fallback image
            }}
            className={profileStyle.logoImage}
          />
        </div>
      )} */}
    </div>
  );
};

export default Profile;
