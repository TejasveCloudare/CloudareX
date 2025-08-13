import React from "react";
import Rstyles from "./Responsibilities.module.css";

const Responsibilities = ({ formData, onChange }) => {
  return (
    <div className={Rstyles.stepForm}>
      <h2 className={Rstyles.heading}>Roles & Responsibilities</h2>

      <label className={Rstyles.label}>Roles & Responsibilities</label>
      <textarea
        rows="4"
        className={Rstyles.textarea}
        value={formData.roles_responsibilities}
        onChange={(e) => onChange("roles_responsibilities", e.target.value)}
        placeholder="Describe the job responsibilities here..."
      />

      <label className={Rstyles.label}>Qualifications</label>
      <input
        type="text"
        className={Rstyles.input}
        value={formData.qualifications}
        onChange={(e) => onChange("qualifications", e.target.value)}
        placeholder="Enter required qualifications"
      />
    </div>
  );
};

export default Responsibilities;
