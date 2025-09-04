import React, { useContext } from "react";
import JDstyles from "./JobDetails.module.css";
import { GlobalContext } from "../../context/Context";
import { FaArrowRight } from "react-icons/fa";

const JobDetails = ({ formData, onChange }) => {
  const { jobPostingChoices, setStep } = useContext(GlobalContext);

  const goToNextStep = () => {
    setStep(1); // Navigate to Compensation step
  };
  return (
    <div className={JDstyles.stepForm}>
      <h2 className={JDstyles.heading}>Job Details</h2>

      {/* Job Title */}
      <label className={JDstyles.label}>Job Title</label>
      <input
        type="text"
        className={JDstyles.input}
        value={formData.job_title}
        onChange={(e) => onChange("job_title", e.target.value)}
        placeholder="Enter job title"
      />

      {/* Function */}
      <label className={JDstyles.label}>Function</label>
      <select
        className={`${JDstyles.input}`}
        value={formData.function}
        onChange={(e) => onChange("function", e.target.value)}
      >
        <option value="">Select function</option>
        {jobPostingChoices?.function_choices?.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {/* ✅ Experience Fields Side by Side */}
      <div className={JDstyles.row}>
        <div className={JDstyles.column}>
          <label className={JDstyles.label}>Experience Min</label>
          <input
            type="number"
            className={JDstyles.input}
            value={formData.experience_min}
            onChange={(e) =>
              onChange("experience_min", parseInt(e.target.value))
            }
            placeholder="Min years"
          />
        </div>
        <div className={JDstyles.column}>
          <label className={JDstyles.label}>Experience Max</label>
          <input
            type="number"
            className={JDstyles.input}
            value={formData.experience_max}
            onChange={(e) =>
              onChange("experience_max", parseInt(e.target.value))
            }
            placeholder="Max years"
          />
        </div>
      </div>

      {/* ✅ Employment Type */}
      <label className={JDstyles.label}>Employment Type</label>
      <select
        className={`${JDstyles.input} select`}
        value={formData.employment_type}
        onChange={(e) => onChange("employment_type", e.target.value)}
      >
        <option value="">Select employment type</option>
        {jobPostingChoices?.employment_type_choices?.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {/* Number of Openings */}
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
      <button className={JDstyles.nextBtn} onClick={goToNextStep}>
        Next <FaArrowRight />
      </button>
    </div>
  );
};

export default JobDetails;
