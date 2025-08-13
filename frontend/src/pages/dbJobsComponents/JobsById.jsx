import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById } from "../../Api/services";
import styles from "./JobsById.module.css";

const JobsById = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(jobId);
        setJob(data);
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  if (loading)
    return <div className={styles.loading}>Loading job details...</div>;
  if (!job) return <div className={styles.error}>Job not found</div>;

  const tabs = [
    { id: "about", label: "About company", content: job.additional_info },
    {
      id: "skills",
      label: "Skills required",
      content:
        job.non_negotiable_skills
          ?.map((skill) => skill.name) // ✅ Extract names
          .join(", ") || "N/A",
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
    { id: "hiring", label: "Hiring process", content: job.interview_process },
    { id: "plan", label: "30-60-90 day plan", content: job.plan_30_60_90 },
    { id: "overview", label: "Job overview", content: job.function },
    {
      id: "career",
      label: "Career roadmap",
      content: "To be discussed during hiring process",
    },
  ];
  var website = job?.company_website;
  const logoUrl = `https://logo.clearbit.com/${website}`;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          <img
            src={logoUrl}
            alt="Company Logo"
            className={styles.logo}
            onError={(e) => (e.target.src = "/default-logo.png")}
          />
        </div>

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
      </div>

      <div className={styles.tabs}>
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
      </div>

      <div className={styles.tabContent}>
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
      </div>
    </div>
  );
};

export default JobsById;
