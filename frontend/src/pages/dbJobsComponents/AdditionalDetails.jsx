import React from "react";
import Astyles from "./AdditionalDetails.module.css";

const AdditionalDetails = ({ formData, onChange, onPublish }) => {
  return (
    <div className={Astyles.stepForm}>
      <h2 className={Astyles.heading}>Additional Details</h2>

      <label className={Astyles.label}>Interview Process</label>
      <textarea
        rows="3"
        className={Astyles.textarea}
        value={formData.interview_process}
        onChange={(e) => onChange("interview_process", e.target.value)}
        placeholder="Describe the interview process..."
      />

      <label className={Astyles.label}>30-60-90 Day Plan</label>
      <textarea
        rows="3"
        className={Astyles.textarea}
        value={formData.plan_30_60_90}
        onChange={(e) => onChange("plan_30_60_90", e.target.value)}
        placeholder="Outline the 30-60-90 day plan..."
      />

      <label className={Astyles.label}>Additional Info</label>
      <textarea
        rows="3"
        className={Astyles.textarea}
        value={formData.additional_info}
        onChange={(e) => onChange("additional_info", e.target.value)}
        placeholder="Any extra information for candidates..."
      />

      <label className={Astyles.label}>
        Non-Negotiable Skill IDs (comma separated)
      </label>
      <input
        type="text"
        className={Astyles.input}
        placeholder="e.g. 1,2,5"
        value={formData.non_negotiable_skills.join(",")}
        onChange={(e) =>
          onChange(
            "non_negotiable_skills",
            e.target.value
              .split(",")
              .map((id) => parseInt(id.trim()))
              .filter((id) => !isNaN(id))
          )
        }
      />

      <button className={Astyles.publishBtn} onClick={onPublish}>
        🚀 Publish Job
      </button>
    </div>
  );
};

export default AdditionalDetails;
