import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById, applyForJob } from "../../Api/services"; // Import API functions
import ApplyStyles from "./ApplyNowById.module.css";

const ApplyNowById = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    job_id: jobId,
    name: "",
    email: "",
    phone: "",
    expectedCtc: "",
    noticePeriod: "",
    resume: null,
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      resume: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.resume) {
      // alert("Please upload your resume before submitting.");
      return;
    }

    // Prepare FormData for API
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("expected_ctc", formData.expectedCtc);
    formDataObj.append("notice_period", formData.noticePeriod);
    formDataObj.append("resume", formData.resume);

    setSubmitting(true);

    const result = await applyForJob(jobId, formDataObj);

    setSubmitting(false);

    if (result) {
      // alert("Application submitted successfully!");
      navigate(-1); // Go back after success
    } else {
      // alert("Failed to submit application. Please try again.");
    }
  };

  if (loading) return <div className={ApplyStyles.loading}>Loading...</div>;
  if (!job) return <div className={ApplyStyles.error}>Job not found</div>;

  const extractDomain = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return null;
    }
  };

  // const logoUrl = `https://logo.clearbit.com/${job?.company_website}`;
  const domain = extractDomain(job?.company_website);
  const logoUrl = domain
    ? `https://logo.clearbit.com/${domain}`
    : "/default-logo.png";

  return (
    <div className={ApplyStyles.container}>
      {/* Back Button */}
      <button className={ApplyStyles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Job Details Header */}
      <div className={ApplyStyles.header}>
        <div className={ApplyStyles.logoWrapper}>
          <img
            src={logoUrl}
            alt="Company Logo"
            className={ApplyStyles.logo}
            onError={(e) => (e.target.src = "/default-logo.png")}
          />
        </div>
        <div className={ApplyStyles.jobInfo}>
          <h1 className={ApplyStyles.title}>{job.job_title}</h1>
          <p className={ApplyStyles.company}>{job.company_name}</p>
          <p className={ApplyStyles.location}>{job.mode_of_work}</p>
        </div>
      </div>

      {/* Application Form */}
      <form className={ApplyStyles.form} onSubmit={handleSubmit}>
        <h2 className={ApplyStyles.formTitle}>Apply for this Job</h2>

        <div className={ApplyStyles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className={ApplyStyles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className={ApplyStyles.formGroup}>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className={ApplyStyles.formGroup}>
          <label>Expected CTC (in LPA)</label>
          <input
            type="number"
            name="expectedCtc"
            value={formData.expectedCtc}
            onChange={handleChange}
            placeholder="Expected CTC"
            required
          />
        </div>

        <div className={ApplyStyles.formGroup}>
          <label>Notice Period (in days)</label>
          <input
            type="number"
            name="noticePeriod"
            value={formData.noticePeriod}
            onChange={handleChange}
            placeholder="Notice Period"
            required
          />
        </div>

        <div className={ApplyStyles.formGroup}>
          <label>Upload Resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
          {formData.resume && (
            <p className={ApplyStyles.fileName}>
              Selected: {formData.resume.name}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={ApplyStyles.submitBtn}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyNowById;
