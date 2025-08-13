import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./WorkspaceInfo.module.css";
import { createWorkspace } from "../../Api/services";

const WorkspaceInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    companyWebsite: "", // just the raw domain
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullWebsite = formData.companyWebsite.trim().startsWith("http")
      ? formData.companyWebsite.trim()
      : `https://${formData.companyWebsite.trim()}`;

    try {
      const response = await createWorkspace({
        fullName: formData.fullName,
        companyName: formData.companyName,
        companyWebsite: fullWebsite,
        email,
      });

      if (response) {
        navigate("/role", {
          state: {
            email,
            companyWebsite: fullWebsite,
            companyName: formData.companyName,
            fullName: formData.fullName,
          },
        });
      }
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h2>Creating your workspace</h2>
        <p>Your gateway to the best product and growth talent</p>

        <form onSubmit={handleSubmit}>
          <label>Your full name*</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <label>Company name*</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <label>Company website*</label>
          <input
            type="text"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleChange}
            placeholder="www.example.com"
            required
          />

          <button type="submit">Continue</button>
        </form>
      </div>

      <div className={styles.right}>
        <p>
          <strong>Congrats!</strong> Your hiring funnel just got an upgrade
        </p>

        <div className={styles.previewCard}>
          <h3>{formData.companyName || "Company Name"}</h3>

          <div className={styles.detailsBox}>
            <p>
              <strong>Name:</strong> {formData.fullName || "Your Name"}
            </p>
            <p>
              <strong>Company Email:</strong> {email || "your@email.com"}
            </p>
            <p>
              <strong>Company name:</strong> {formData.companyName || "-"}
            </p>
            <p>
              <strong>Company website:</strong>{" "}
              {formData.companyWebsite
                ? `https://${formData.companyWebsite}`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceInfo;
