import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./LoginRole.module.css";
import { updateWorkspaceRole } from "../../Api/services";

const Role = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { email, companyWebsite, companyName, fullName } = location.state || {};

  const [formData, setFormData] = useState({
    role: "",
    mobile: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        email,
        role: formData.role,
        mobile: formData.mobile.replace(/\s/g, ""), // clean number
      };

      await updateWorkspaceRole(payload);

      // Send email and any other data to dashboard using `state`
      navigate("/dashboard", {
        state: {
          email,
          role: formData.role,
          fullName,
          companyName,
          companyWebsite,
        },
      });
    } catch (error) {
      console.error("Failed to update role", error);
    }
  };

  return (
    <div className={styles.container}>
      {/* LEFT SECTION */}
      <div className={styles.left}>
        <h3>Hi! {fullName} 👋</h3>
        <h2>What’s your role in the org?</h2>
        <p>Your gateway to the best product and growth talent</p>

        <form onSubmit={handleSubmit}>
          <label>Please select your role</label>
          <input
            type="text"
            name="role"
            placeholder="Developer"
            value={formData.role}
            onChange={handleChange}
            required
          />

          <label>Enter mobile number*</label>
          <input
            type="tel"
            name="mobile"
            placeholder="+91 99999 99999"
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          <button type="submit">Submit and Go to dashboard</button>
        </form>
      </div>

      {/* RIGHT SECTION */}
      <div className={styles.right}>
        <p>
          <strong>
            Hire from 400+ members working at the top Internet companies
          </strong>
        </p>

        <div className={styles.previewCard}>
          <h3>{companyName || "Company Name"}</h3>
          <div className={styles.detailsBox}>
            <p>
              <strong>Name:</strong> {fullName || "-"}
            </p>
            <p>
              <strong>Company Email:</strong> {email || "-"}
            </p>
            <p>
              <strong>Company name:</strong> {companyName || "-"}
            </p>
            <p>
              <strong>Company website:</strong> {companyWebsite || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;
