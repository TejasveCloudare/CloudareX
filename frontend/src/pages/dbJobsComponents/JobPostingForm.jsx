import React, { useState, useContext } from "react";
import JobPostingSidebar from "./JobPostingSidebar";
import styles from "./JobPostingForm.module.css";
import JobDetails from "./JobDetails";
import Compensation from "./Compensation";
import Responsibilities from "./Responsibilities";
import Location from "./Location";
import AdditionalDetails from "./AdditionalDetails";
import { GlobalContext } from "../../context/Context";
import { createJobPosting } from "../../Api/services";
import notificationObject from "../../components/Widgets/Notification/Notification";

const JobPostingForm = () => {
  const { currentStep, setStep, workspace, user } = useContext(GlobalContext);

  const [formData, setFormData] = useState({
    job_title: "",
    function: "",
    experience_min: "",
    experience_max: "",
    employment_type: "", // ✅ Added this field
    number_of_openings: "",
    compensation_lpa: "",
    is_compensation_negotiable: false,
    esops_lpa: "",
    variable_lpa: "",
    roles_responsibilities: "",
    qualifications: "",
    mode_of_work: "",
    work_location: "",
    interview_process: "",
    plan_30_60_90: "",
    additional_info: "",
    non_negotiable_skills: [],
    workspace_email: user?.email || "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePublish = async () => {
    console.log("Publishing Job: ", formData);

    // Basic validation
    if (!formData.workspace_email) {
      notificationObject.error("Workspace email is required");
      return;
    }
    if (!formData.non_negotiable_skills.length) {
      notificationObject.error(
        "Please select at least one non-negotiable skill"
      );
      return;
    }

    // Call the POST API
    const result = await createJobPosting(formData);

    if (result) {
      notificationObject.success("Job posting created successfully");
      console.log("Created Job Posting:", result);

      // Optionally reset form
      setFormData({
        job_title: "",
        function: "",
        experience_min: "",
        experience_max: "",
        employment_type: "", // ✅ Reset this too
        number_of_openings: "",
        compensation_lpa: "",
        is_compensation_negotiable: false,
        esops_lpa: "",
        variable_lpa: "",
        roles_responsibilities: "",
        qualifications: "",
        mode_of_work: "",
        work_location: "",
        interview_process: "",
        plan_30_60_90: "",
        additional_info: "",
        non_negotiable_skills: [],
        workspace_email: workspace?.email || "",
      });

      // Optionally navigate back to job listings
      setStep(0);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <JobDetails formData={formData} onChange={handleChange} />;
      case 1:
        return <Compensation formData={formData} onChange={handleChange} />;
      case 2:
        return <Responsibilities formData={formData} onChange={handleChange} />;
      case 3:
        return <Location formData={formData} onChange={handleChange} />;
      case 4:
        return (
          <AdditionalDetails
            formData={formData}
            onChange={handleChange}
            onPublish={handlePublish} // ✅ Trigger POST on final step
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.jobPostingContainer}>
      <JobPostingSidebar />
      <div className={styles.formSection}>{renderStep()}</div>
    </div>
  );
};

export default JobPostingForm;
