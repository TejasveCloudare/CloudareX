import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, getAppliedCandidates } from "../../Api/services";
import styles from "./JobsById.module.css";

const JobsById = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [error, setError] = useState(false);
  const [candidatesCount, setCandidatesCount] = useState(0);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(jobId);
        setJob(data);
        setError(false);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError(true);
      }
    };

    const fetchCandidatesCount = async () => {
      try {
        const candidates = await getAppliedCandidates(jobId);
        if (candidates) {
          setCandidatesCount(candidates.length);
        }
      } catch (err) {
        console.error("Error fetching applied candidates count:", err);
      }
    };

    fetchJob();
    fetchCandidatesCount();
  }, [jobId]);

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <p className={styles.errorText}>Failed to load job details.</p>
        <button
          className={styles.retryBtn}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!job) return <div className={styles.errorText}>Job not found</div>;

  const tabs = [
    { id: "about", label: "About Company", content: job.additional_info },
    {
      id: "skills",
      label: "Skills Required",
      content:
        job.non_negotiable_skills?.map((skill) => skill.name).join(", ") ||
        "N/A",
    },
    {
      id: "responsibilities",
      label: "Responsibilities",
      content: Array.isArray(job.roles_responsibilities)
        ? job.roles_responsibilities
        : job.roles_responsibilities?.split("\n") || [],
    },
    {
      id: "qualifications",
      label: "Qualifications",
      content: job.qualifications,
    },
    { id: "hiring", label: "Hiring Process", content: job.interview_process },
    { id: "plan", label: "30-60-90 Day Plan", content: job.plan_30_60_90 },
    { id: "overview", label: "Job Overview", content: job.function },
    {
      id: "career",
      label: "Career Roadmap",
      content: "To be discussed during hiring process",
    },
  ];

  const extractDomain = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return null;
    }
  };

  const domain = extractDomain(job?.company_website);
  const logoUrl = domain
    ? `https://logo.clearbit.com/${domain}`
    : "/default-logo.png";

  // const logoUrl = `https://logo.clearbit.com/${job?.company_website}`;

  const handleApplyNow = () => {
    navigate(`/dashboard/apply-now/${jobId}`);
  };

  const handleShowCandidates = () => {
    navigate(`/dashboard/applied-candidates/${jobId}`);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <header className={styles.header}>
        <div className={styles.logoWrapper}>
          <img
            src={logoUrl}
            alt="Company Logo"
            className={styles.logo}
            onError={(e) => (e.target.src = "/default-logo.png")}
          />
        </div>

        <div className={styles.topContainer}>
          <div className={styles.headerDetails}>
            <h1 className={styles.title}>{job.job_title}</h1>
            <p className={styles.location}>{job.mode_of_work}</p>

            <div className={styles.meta}>
              <div>
                <p className={styles.metaLabel}>CTC</p>
                <p className={styles.metaValue}>
                  {job.compensation_lpa} LPA -{" "}
                  {job.compensation_lpa + job.variable_lpa} LPA
                </p>
              </div>
              <div>
                <p className={styles.metaLabel}>Experience</p>
                <p className={styles.metaValue}>
                  {job.experience_min}-{job.experience_max} years
                </p>
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button className={styles.applyBtn} onClick={handleApplyNow}>
              Apply Now
            </button>
            <button className={styles.applyBtn} onClick={handleShowCandidates}>
              Show Applied {candidatesCount} Candidates
            </button>
          </div>
        </div>
      </header>

      <nav className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${
              activeTab === tab.id ? styles.active : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className={styles.tabContent}>
        {Array.isArray(tabs.find((t) => t.id === activeTab)?.content) ? (
          <ul>
            {tabs
              .find((t) => t.id === activeTab)
              ?.content.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
          </ul>
        ) : (
          <p>
            {tabs.find((t) => t.id === activeTab)?.content ||
              "No details available."}
          </p>
        )}
      </section>
    </div>
  );
};

export default JobsById;
