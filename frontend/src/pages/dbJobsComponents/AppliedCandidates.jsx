import React, { useEffect, useState } from "react";
import { getAppliedCandidates } from "../../Api/services";
import { useParams, useNavigate } from "react-router-dom";
import ApStyles from "../dbJobsComponents/AppliedCandidates.module.css";
import { baseURL } from "../../Api/config";

const AppliedCandidates = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getAppliedCandidates(jobId);
        setCandidates(data);
        setError(false);
      } catch (err) {
        console.error("Error fetching applied candidates:", err);
        setError(true);
      }
    };
    fetchCandidates();
  }, [jobId]);

  if (error) {
    return (
      <div className={ApStyles.errorWrapper}>
        <p>Failed to load candidates details.</p>
        <button
          className={ApStyles.retryBtn}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={ApStyles.container}>
      <button className={ApStyles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className={ApStyles.card}>
        <h1 className={ApStyles.title}>Applied Candidates</h1>
        {candidates.length > 0 ? (
          <div className={ApStyles.tableWrapper}>
            <table className={ApStyles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Expected CTC</th>
                  <th>Notice Period</th>
                  <th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>{candidate.name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phone}</td>
                    <td>{candidate.expected_ctc} LPA</td>
                    <td>{candidate.notice_period} Days</td>
                    <td>
                      {candidate.resume ? (
                        <a
                          href={`${baseURL}${candidate.resume}`}
                          download={`Resume_${candidate.name}.pdf`}
                          className={ApStyles.downloadLink}
                        >
                          View and Download Resume
                        </a>
                      ) : (
                        <span className={ApStyles.noResume}>
                          No Resume Uploaded
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={ApStyles.noData}>
            No candidates have applied for this job yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AppliedCandidates;
