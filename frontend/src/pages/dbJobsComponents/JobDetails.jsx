import React from "react";
import JDstyles from "./JobDetails.module.css";

const JobDetails = ({ formData, onChange }) => {
  return (
    <div className={JDstyles.stepForm}>
      <h2 className={JDstyles.heading}>Job Details</h2>

      <label className={JDstyles.label}>Job Title</label>
      <input
        type="text"
        className={JDstyles.input}
        value={formData.job_title}
        onChange={(e) => onChange("job_title", e.target.value)}
        placeholder="Enter job title"
      />

      <label className={JDstyles.label}>Function</label>
      <input
        type="text"
        className={JDstyles.input}
        value={formData.function}
        onChange={(e) => onChange("function", e.target.value)}
        placeholder="Enter function"
      />

      <label className={JDstyles.label}>Experience Min</label>
      <input
        type="number"
        className={JDstyles.input}
        value={formData.experience_min}
        onChange={(e) => onChange("experience_min", parseInt(e.target.value))}
        placeholder="Minimum years of experience"
      />

      <label className={JDstyles.label}>Experience Max</label>
      <input
        type="number"
        className={JDstyles.input}
        value={formData.experience_max}
        onChange={(e) => onChange("experience_max", parseInt(e.target.value))}
        placeholder="Maximum years of experience"
      />

      <label className={JDstyles.label}>Number of Openings</label>
      <input
        type="number"
        className={JDstyles.input}
        value={formData.number_of_openings}
        onChange={(e) =>
          onChange("number_of_openings", parseInt(e.target.value))
        }
        placeholder="Enter total openings"
      />
    </div>
  );
};

export default JobDetails;
