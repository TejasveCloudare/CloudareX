import React from "react";
import { useNavigate } from "react-router-dom";
import DashHomestyles from "./DashHome.module.css";
import HiringPartners from "../HomeComponents/HiringPartners";

const DashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className={DashHomestyles.dashboardWrapper}>
      <h1 className={DashHomestyles.heading}>Dashboard</h1>
      <div className={DashHomestyles.cardWrapper}>
        {/* Left Section */}
        <div className={DashHomestyles.leftCard}>
          <div className={DashHomestyles.leftContent}>
            <h2>Let's post your job</h2>
            <p>It only takes 5 mins</p>
            <button
              className={DashHomestyles.jobPostBtn}
              onClick={() => navigate("/dashboard/create-job")}
            >
              Create Job Post
            </button>
            <a className={DashHomestyles.termsLink} href="#!">
              View Terms & conditions
            </a>
          </div>
          <div className={DashHomestyles.mockupBox}></div>
        </div>

        {/* Right Section */}
        <div className={DashHomestyles.rightCard}>
          <div className={DashHomestyles.lockHeader}>
            <h3>Find the right talent</h3>
            <span className={DashHomestyles.lockedBadge}>
              <span className={DashHomestyles.lockIcon}>🔒</span> Locked
            </span>
          </div>
          <p className={DashHomestyles.rightDesc}>
            Discover the top talent from the member directory of GX members
            actively looking for jobs.
          </p>
          <button className={DashHomestyles.viewBtn} disabled>
            View talent directory
          </button>
        </div>
      </div>
      <HiringPartners />
    </div>
  );
};

export default DashboardHome;
