import React, { useState, useEffect } from "react";
import profileInfoStyles from "./ProfileInfo.module.css";
import { useOutletContext } from "react-router-dom";
import { updateWorkspaceRole } from "../../Api/services";
import notificationObject from "../../components/Widgets/Notification/Notification";

const ProfileInfo = () => {
  const { user, workspace } = useOutletContext();
  const [formData, setFormData] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (workspace) {
      setFormData({
        industry: workspace.industry || "",
        sub_industry: workspace.sub_industry || "",
        type: workspace.type || "",
        stage: workspace.stage || "",
        size: workspace.size || "",
        founded_in: workspace.founded_in || "",
        companyWebsite: workspace.companyWebsite || "",
        domain: workspace.domain || "",
        about_company: workspace.about_company || "",
        about_founders: workspace.about_founders || "",
      });
      setIsModified(false);
      setIsEditing(false);
    }
  }, [workspace]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      setIsModified(true);
      return updated;
    });
  };

  const handleUpdate = async () => {
    const payload = {
      email: workspace?.email,
      ...formData,
    };

    try {
      const res = await updateWorkspaceRole(payload);
      if (res) {
        setIsModified(false);
        setIsEditing(false);
        notificationObject.success(res.message);
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const extractDomain = (url) => {
    if (!url) return "";
    try {
      const { hostname } = new URL(
        url.startsWith("http") ? url : `https://${url}`
      );
      return hostname.replace(/^www\./, "");
    } catch {
      return url.replace(/^https?:\/\/(www\.)?/, "");
    }
  };

  const companyDomain = extractDomain(formData.companyWebsite);
  const logoUrl = `https://logo.clearbit.com/${companyDomain}`;

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 1900; y--) {
      years.push({ label: y.toString(), value: y.toString() });
    }
    return years;
  };

  const renderDropdown = (label, name, value, options, placeholder) => (
    <div className={profileInfoStyles.field}>
      <label>{label}:</label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        disabled={!isEditing}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderInput = (label, name, value, placeholder) => (
    <div className={profileInfoStyles.field}>
      <label>{label}:</label>
      <input
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={!isEditing}
      />
    </div>
  );

  return (
    <div className={profileInfoStyles.mainWrapper}>
      {/* Sidebar */}
      <div className={profileInfoStyles.sidebar}>
        <img
          src={logoUrl}
          alt="Company Logo"
          className={profileInfoStyles.logoImage}
          onError={(e) => (e.target.src = "/default-logo.png")}
        />
        <h3>{workspace?.companyName || "Company Name"}</h3>
        <button
          className={profileInfoStyles.editToggleBtn}
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Content */}
      <div className={profileInfoStyles.content}>
        <h2>General Information</h2>
        <div className={profileInfoStyles.grid}>
          {workspace?.choices?.industry
            ? renderDropdown(
                "Industry",
                "industry",
                formData.industry,
                workspace.choices.industry,
                "Select Industry"
              )
            : renderInput(
                "Industry",
                "industry",
                formData.industry,
                "Enter Industry"
              )}

          {renderInput(
            "Sub Industry",
            "sub_industry",
            formData.sub_industry,
            "Enter Sub Industry"
          )}

          {workspace?.choices?.type
            ? renderDropdown(
                "Type",
                "type",
                formData.type,
                workspace.choices.type,
                "Select Type"
              )
            : renderInput("Type", "type", formData.type, "Enter Company Type")}

          {renderInput("Stage", "stage", formData.stage, "Enter Stage")}

          {workspace?.choices?.size
            ? renderDropdown(
                "Size",
                "size",
                formData.size,
                workspace.choices.size,
                "Select Size"
              )
            : renderInput("Size", "size", formData.size, "Enter Size")}

          {renderDropdown(
            "Founded In",
            "founded_in",
            formData.founded_in,
            generateYearOptions(),
            "Select Year"
          )}

          {renderInput(
            "Website",
            "companyWebsite",
            formData.companyWebsite,
            "Enter Website"
          )}

          {workspace?.choices?.domain
            ? renderDropdown(
                "Domain",
                "domain",
                formData.domain || companyDomain,
                workspace.choices.domain,
                "Select Domain"
              )
            : renderInput(
                "Domain",
                "domain",
                formData.domain || companyDomain,
                "Enter Domain"
              )}
        </div>

        <div className={profileInfoStyles.richSection}>
          <h3>About the Company</h3>
          <textarea
            name="about_company"
            value={formData.about_company}
            onChange={handleChange}
            placeholder="Write information about the company..."
            rows={4}
            disabled={!isEditing}
          />
        </div>

        <div className={profileInfoStyles.richSection}>
          <h3>About the Founders</h3>
          <textarea
            name="about_founders"
            value={formData.about_founders}
            onChange={handleChange}
            placeholder="Introduce the founding team..."
            rows={4}
            disabled={!isEditing}
          />
        </div>

        {/* Update Button */}
        {isEditing && isModified && (
          <div className={profileInfoStyles.updateButtonWrapper}>
            <button
              className={profileInfoStyles.updateButton}
              onClick={handleUpdate}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
