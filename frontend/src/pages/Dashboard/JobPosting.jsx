import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom"; // ✅ add useNavigate
import JobPostingStyles from "./JobPosting.module.css";
import emptyFolderImage from "../../assets/empty-jobs.webp";
import JobPostingForm from "../dbJobsComponents/JobPostingForm";
import { getJobPostingsByEmail } from "../../Api/services"; // import service

const JobPosting = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const [showSidebar, setShowSidebar] = useState(false);
  const [jobs, setJobs] = useState([]);
  const { workspace, user } = useOutletContext();
  const navigate = useNavigate(); // ✅ hook for navigation

  useEffect(() => {
    const fetchJobs = async () => {
      if (user?.email) {
        try {
          const data = await getJobPostingsByEmail(user.email);
          setJobs(data || []);
        } catch (err) {
          console.error("Error fetching jobs:", err);
        }
      }
    };
    fetchJobs();
  }, [user?.email]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handlePostJobClick = () => {
    setShowSidebar(true);
  };

  const extractDomain = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return null;
    }
  };

  const domain = extractDomain(workspace?.companyWebsite);
  const logoUrl = domain
    ? `https://logo.clearbit.com/${domain}`
    : "/default-logo.png";
  // var website = workspace?.companyWebsite;
  // const logoUrl = `https://logo.clearbit.com/${website}`;

  // Filter jobs by tab
  const filteredJobs = jobs.filter((job) => {
    if (activeTab === "Active") return job.is_active === true;
    if (activeTab === "Inactive") return job.is_active === false;
    if (activeTab === "Draft") return job.is_draft === true;
    return false;
  });

  return (
    <div className={JobPostingStyles.pageWrapper}>
      {!showSidebar && (
        <>
          <div className={JobPostingStyles.header}>
            <img
              src={logoUrl}
              alt="Company Logo"
              className={JobPostingStyles.logo}
              onError={(e) => (e.target.src = "/default-logo.png")}
            />
            <h2 className={JobPostingStyles.heading}>
              Jobs posted at {workspace?.name || "Company"}
            </h2>
          </div>

          <div className={JobPostingStyles.tabs}>
            {["Active", "Inactive", "Draft"].map((tab) => (
              <button
                key={tab}
                className={`${JobPostingStyles.tab} ${
                  activeTab === tab ? JobPostingStyles.activeTab : ""
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            className={JobPostingStyles.postBtn}
            onClick={handlePostJobClick}
          >
            + Post new job
          </button>

          {filteredJobs.length > 0 ? (
            <div className={JobPostingStyles.jobsTable}>
              <table>
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Status</th>
                    <th>Verification Status</th>
                    <th>Experience</th>
                    <th>Mode Of Work</th>
                    <th>Owner</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <div>
                          <p>{job.job_title}</p>
                          <small>{job.work_location}</small>
                        </div>
                      </td>
                      <td>
                        {job.is_active ? (
                          <span className={JobPostingStyles.statusActive}>
                            Active
                          </span>
                        ) : (
                          <span className={JobPostingStyles.statusInactive}>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td>
                        {job.is_verified ? (
                          <span className={JobPostingStyles.verifiedBadge}>
                            Verified
                          </span>
                        ) : (
                          <span className={JobPostingStyles.notVerifiedBadge}>
                            Under Verification
                          </span>
                        )}
                      </td>
                      <td>{job?.experience_min || "N/A"}</td>
                      <td>{job?.mode_of_work || "N/A"}</td>
                      <td>{workspace?.fullName || "N/A"}</td>
                      <td>
                        <button
                          className={JobPostingStyles.viewBtn}
                          onClick={() => navigate(`/dashboard/job/${job.id}`)} // ✅ navigate on click
                        >
                          View job post
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={JobPostingStyles.emptyStateCard}>
              <img
                src={emptyFolderImage}
                alt="empty"
                className={JobPostingStyles.emptyIcon}
              />
              <p className={JobPostingStyles.emptyText}>
                You have no {activeTab.toLowerCase()} jobs yet. Please click on{" "}
                <strong>‘+ Post new job’</strong> to start hiring.
              </p>
              <button
                className={JobPostingStyles.postBtn}
                onClick={handlePostJobClick}
              >
                + Post new job
              </button>
              <p className={JobPostingStyles.learnLink}>
                ⓘ Learn how job posting works
              </p>
            </div>
          )}
        </>
      )}

      {showSidebar && (
        <div className={JobPostingStyles.sidebarView}>
          <div className={JobPostingStyles.formArea}>
            <h2 className={JobPostingStyles.getStarted}>Let's get started</h2>
            <JobPostingForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPosting;
