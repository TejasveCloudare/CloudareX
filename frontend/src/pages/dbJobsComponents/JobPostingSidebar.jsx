import React, { useContext } from "react";
import JpSidebarStyles from "./JobPostingSidebar.module.css";
import {
  FaSuitcase,
  FaMoneyBillWave,
  FaTasks,
  FaMapMarkerAlt,
  FaLightbulb,
} from "react-icons/fa";
import { GlobalContext } from "../../context/Context";

const JobPostingSidebar = () => {
  // console.log("Sidebar loaded with:", { currentStep, setStep });
  const { currentStep, setStep } = useContext(GlobalContext);
  const steps = [
    { icon: <FaSuitcase />, label: "Job Details", active: true },
    { icon: <FaMoneyBillWave />, label: "Compensation" },
    { icon: <FaTasks />, label: "Roles & responsibilities" },
    { icon: <FaMapMarkerAlt />, label: "Job location" },
    { icon: <FaLightbulb />, label: "Additional details" },
  ];

  return (
    <div className={JpSidebarStyles.sidebarWrapper}>
      <h3 className={JpSidebarStyles.title}>
        New Job Post{" "}
        <span className={JpSidebarStyles.subtitle}>/ Untitled</span>
      </h3>

      <div className={JpSidebarStyles.steps}>
        {steps.map((step, index) => (
          <div
            key={index}
            onClick={() => setStep(index)} // THIS is the key usage
            className={`${JpSidebarStyles.stepItem} ${
              index === currentStep ? JpSidebarStyles.active : ""
            }`}
          >
            <span className={JpSidebarStyles.icon}>{step.icon}</span>
            <span>{step.label}</span>
          </div>
        ))}
      </div>

      <div className={JpSidebarStyles.unlockSection}>
        <p className={JpSidebarStyles.unlockTitle}>🔓 Post a Job & Unlock</p>
        <p className={JpSidebarStyles.unlockDesc}>
          Your job will be live on our job board for our exclusive community of{" "}
          <strong>4,000+ members</strong>.
        </p>
      </div>

      <div className={JpSidebarStyles.memberSection}>
        <p>
          Member Directory with <strong>500+ member profiles</strong> actively
          looking for job working at
        </p>
        <p className={JpSidebarStyles.companies}>
          💼 Paytm & 100+ top companies
        </p>
      </div>
    </div>
  );
};

export default JobPostingSidebar;
