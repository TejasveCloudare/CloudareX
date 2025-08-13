import React from "react";
import Lstyles from "./Location.module.css";

const Location = ({ formData, onChange }) => {
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
    </div>
  );
};

export default Location;
