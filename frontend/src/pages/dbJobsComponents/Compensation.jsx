import React, { useContext } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Cstyles from "./Compensation.module.css";
import { GlobalContext } from "../../context/Context";

const Compensation = ({ formData, onChange }) => {
  const { setStep } = useContext(GlobalContext);

  const goToPreviousStep = () => {
    setStep(0); // Navigate to Job Details
  };

  const goToNextStep = () => {
    setStep(2); // Navigate to Responsibilities
  };

  return (
    <div className={Cstyles.stepForm}>
      <h2 className={Cstyles.heading}>Compensation</h2>

      <label className={Cstyles.label}>CTC (LPA)</label>
      <input
        type="number"
        className={Cstyles.input}
        value={formData.compensation_lpa}
        onChange={(e) =>
          onChange("compensation_lpa", parseFloat(e.target.value))
        }
        placeholder="Enter total CTC in LPA"
      />

      <label className={Cstyles.label}>Is Compensation Negotiable?</label>
      <div className={Cstyles.checkboxWrapper}>
        <input
          type="checkbox"
          className={Cstyles.checkbox}
          checked={formData.is_compensation_negotiable}
          onChange={(e) =>
            onChange("is_compensation_negotiable", e.target.checked)
          }
        />
        <span className={Cstyles.checkboxLabel}>Yes</span>
      </div>

      <label className={Cstyles.label}>ESOPS (LPA)</label>
      <input
        type="number"
        className={Cstyles.input}
        value={formData.esops_lpa}
        onChange={(e) => onChange("esops_lpa", parseFloat(e.target.value))}
        placeholder="Enter ESOPS value"
      />

      <label className={Cstyles.label}>Variable Pay (LPA)</label>
      <input
        type="number"
        className={Cstyles.input}
        value={formData.variable_lpa}
        onChange={(e) => onChange("variable_lpa", parseFloat(e.target.value))}
        placeholder="Enter variable pay"
      />

      {/* ✅ Navigation Buttons */}
      <div className={Cstyles.navigationButtons}>
        <button className={Cstyles.backBtn} onClick={goToPreviousStep}>
          <FaArrowLeft /> Back
        </button>
        <button className={Cstyles.nextBtn} onClick={goToNextStep}>
          Next <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Compensation;
