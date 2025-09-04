import React, { useState, useContext } from "react";
import Astyles from "./AdditionalDetails.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { GlobalContext } from "../../context/Context";

const AdditionalDetails = ({ formData, onChange, onPublish }) => {
  const [showModal, setShowModal] = useState(false);
  const { setStep } = useContext(GlobalContext);

  const handleReviewClick = () => {
    setShowModal(true); // ✅ Show modal first
  };

  const handleConfirmPublish = () => {
    setShowModal(false);
    onPublish(); // ✅ Call the original publish function
  };
  const goToPreviousStep = () => {
    setStep(3); // Navigate to Job Details
  };
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

      <button className={Astyles.publishBtn} onClick={handleReviewClick}>
        🚀 Review and Publish Job
      </button>

      {/* ✅ Modal */}
      {showModal && (
        <div className={Astyles.modalOverlay}>
          <div className={Astyles.modalContent}>
            <h3>Review Job Details</h3>
            <div className={Astyles.modalBody}>
              <p>
                <strong>Job Title:</strong> {formData.job_title}
              </p>
              <p>
                <strong>Function:</strong> {formData.function}
              </p>
              <p>
                <strong>Experience:</strong> {formData.experience_min} -{" "}
                {formData.experience_max} years
              </p>
              <p>
                <strong>Employment Type:</strong> {formData.employment_type}
              </p>
              <p>
                <strong>Number of Openings:</strong>{" "}
                {formData.number_of_openings}
              </p>
              <p>
                <strong>Compensation:</strong> {formData.compensation_lpa} LPA
              </p>
              <p>
                <strong>Roles & Responsibilities:</strong>{" "}
                {formData.roles_responsibilities}
              </p>
              <p>
                <strong>Qualifications:</strong> {formData.qualifications}
              </p>
              <p>
                <strong>Mode of Work:</strong> {formData.mode_of_work}
              </p>
              <p>
                <strong>Work Location:</strong> {formData.work_location}
              </p>
              <p>
                <strong>Interview Process:</strong> {formData.interview_process}
              </p>
              <p>
                <strong>30-60-90 Day Plan:</strong> {formData.plan_30_60_90}
              </p>
              <p>
                <strong>Additional Info:</strong> {formData.additional_info}
              </p>
              <p>
                <strong>Non-Negotiable Skills:</strong>{" "}
                {formData.non_negotiable_skills.join(", ")}
              </p>
            </div>
            <div className={Astyles.modalActions}>
              <button
                onClick={() => setShowModal(false)}
                className={Astyles.cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                className={Astyles.confirmBtn}
              >
                ✅ Confirm & Publish
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={Astyles.navigationButtons}>
        <button className={Astyles.backBtn} onClick={goToPreviousStep}>
          <FaArrowLeft /> Back
        </button>
      </div>
    </div>
  );
};

export default AdditionalDetails;
