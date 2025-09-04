import React, { useContext } from "react";
import Lstyles from "./Location.module.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { GlobalContext } from "../../context/Context";

const Location = ({ formData, onChange }) => {
  const { setStep } = useContext(GlobalContext);

  const goToPreviousStep = () => {
    setStep(2); // Navigate to Responsibilities
  };

  const goToNextStep = () => {
    setStep(4); // Navigate to Additional Details
  };

  return (
    <div className={Lstyles.stepForm}>
      <h2 className={Lstyles.heading}>Job Location</h2>

      <label className={Lstyles.label}>Mode of Work</label>
      <select
        className={Lstyles.select}
        value={formData.mode_of_work}
        onChange={(e) => onChange("mode_of_work", e.target.value)}
      >
        <option value="">Select</option>
        <option value="remote">Remote</option>
        <option value="onsite">Onsite</option>
        <option value="hybrid">Hybrid</option>
      </select>

      <label className={Lstyles.label}>Location</label>
      <input
        type="text"
        className={Lstyles.input}
        value={formData.work_location}
        onChange={(e) => onChange("work_location", e.target.value)}
        placeholder="Enter job location"
      />

      {/* Navigation Buttons */}
      <div className={Lstyles.navigationButtons}>
        <button className={Lstyles.backBtn} onClick={goToPreviousStep}>
          <FaArrowLeft /> Back
        </button>
        <button className={Lstyles.nextBtn} onClick={goToNextStep}>
          Next <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Location;
