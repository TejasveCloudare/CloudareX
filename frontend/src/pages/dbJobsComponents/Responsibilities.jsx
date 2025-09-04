import React, { useContext } from "react";
import Rstyles from "./Responsibilities.module.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { GlobalContext } from "../../context/Context";

const Responsibilities = ({ formData, onChange }) => {
  const { setStep } = useContext(GlobalContext);

  const goToPreviousStep = () => {
    setStep(1); // Navigate to Job Details
  };

  const goToNextStep = () => {
    setStep(3); // Navigate to Responsibilities
  };

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

      {/* Navigation Buttons */}
      <div className={Rstyles.navigationButtons}>
        <button className={Rstyles.backBtn} onClick={goToPreviousStep}>
          <FaArrowLeft /> Back
        </button>
        <button className={Rstyles.nextBtn} onClick={goToNextStep}>
          Next <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Responsibilities;
