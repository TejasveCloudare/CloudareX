import React, { useEffect, useState } from "react";
import { getAllJobs } from "../../Api/services";
import styles from "./ViewJobs.module.css";
import { useNavigate } from "react-router-dom";

const ViewJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await getAllJobs();
      setJobs(data);
    };
    fetchJobs();
  }, []);

  const truncateText = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Job Listings</h2>

      {jobs.length === 0 ? (
        <p className={styles.emptyText}>No jobs available at the moment</p>
      ) : (
        <div className={styles.grid}>
          {jobs.map((job) => (
            <div key={job.id} className={styles.card}>
              <h3 className={styles.jobTitle}>{job.job_title}</h3>
              <p>
                <strong>Experience:</strong> {job.experience_min} -{" "}
                {job.experience_max} years
              </p>
              <p>
                <strong>Mode:</strong> {job.mode_of_work}
              </p>
              <p>
                <strong>Location:</strong> {job.work_location}
              </p>
              <p>
                <strong>Compensation:</strong> ₹{job.compensation_lpa} LPA
              </p>
              <p className={styles.desc}>
                {truncateText(job.roles_responsibilities, 4)}
              </p>
              <button
                className={styles.viewMoreBtn}
                onClick={() => navigate(`/dashboard/job/${job.id}`)}
              >
                View More
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewJobs;
