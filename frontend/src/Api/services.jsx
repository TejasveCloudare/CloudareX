import notificationObject from "../components/Widgets/Notification/Notification";
import API from "./api";
// LOGIN STARTS HERE-----------------------------------------------------------

export const login = async (userDetails) => {
  const response = await API.post(`/login/`, userDetails, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 404) {
      notificationObject.error(response.response.data);
      console.log(response.response.data);
    }
    if (response.response.status == 401) {
      notificationObject.error(response.response.data);
      console.log(response.response.data);
    }
    return {};
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};

export const userDetails = async (access) => {
  const response = await API.get(`/user/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 401) {
      console.log(response.response.data);
    }
    return {};
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};

export const refresh = async () => {
  const data = {
    refresh_token: localStorage.getItem("refresh"),
  };
  const response = await API.post(`/refresh/`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status != 200) {
      console.log(response.response.data);
      localStorage.clear();
    }
    return {};
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};

export const signup = async (userDetails) => {
  const response = await API.post(`/signup/`, userDetails, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  if (response.response) {
    if (response.response.status == 500) {
      notificationObject.error(response.response.data);
    }
    return {};
  } else {
    if (response.status == 200) {
      return response ? response.data : {};
    }
  }
};

export const sendOtpApi = async (value) => {
  const response = await API.post(
    `/send-otp/`,
    { postFor: "email", data: value },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).catch((err) => console.log(err));
  return response ? response.data : {};
};

export const verifyOtpApi = async (value) => {
  try {
    const response = await API.post("/verify-otp/", {
      postFor: "otp",
      data: value,
    });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export const updatePasswordApi = async (value) => {
  const response = await API.put(`/update-password/`, value, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));
  return response ? response.data : {};
};

export const googleLogin = async (googlePayload) => {
  try {
    const response = await API.post(`/google-login/`, googlePayload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      notificationObject.error(error.response.data);
      console.error("Google Login Error:", error.response.data);
    } else {
      notificationObject.error("Something went wrong with Google login.");
      console.error("Google Login Error:", error);
    }
    throw error;
  }
};

export const linkedinLogin = async ({ code, redirect_uri }) => {
  try {
    const response = await API.post(
      `/linkedin-login/`,
      { code, redirect_uri },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      notificationObject.error(error.response.data);
      console.error("LinkedIn Login Error:", error.response.data);
    } else {
      notificationObject.error("Something went wrong with LinkedIn login.");
      console.error("LinkedIn Login Error:", error);
    }
    throw error;
  }
};

export const createWorkspace = async (workspaceDetails) => {
  const response = await API.post(`/workspace/`, workspaceDetails, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));

  if (response?.response) {
    if (response.response.status === 404) {
      notificationObject.error(response.response.data);
      console.log(response.response.data);
    }
    if (response.response.status === 401) {
      notificationObject.error(response.response.data);
      console.log(response.response.data);
    }
    return {};
  } else {
    if (response?.status === 200 || response?.status === 201) {
      return response.data;
    }
  }
};

export const updateWorkspaceRole = async (roleDetails) => {
  const response = await API.post(`/update-workspace-role/`, roleDetails, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.log(err);
  });

  if (response?.response) {
    if (response.response.status === 404 || response.response.status === 401) {
      notificationObject.error(response.response.data);
      console.log(response.response.data);
      return {};
    }
  } else {
    if (response?.status === 200 || response?.status === 201) {
      return response.data;
    }
  }
};

// LOGIN ENDS HERE-----------------------------------------------------------
export const getHiringPartners = async () => {
  const response = await API.get(`/hiring-partners/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error("Error fetching hiring partners:", err);
    return { error: err };
  });

  if (response?.response) {
    // Handle server error response
    console.error("Server error:", response.response.data);
    return {};
  } else if (response?.status === 200) {
    return response.data;
  } else {
    return {};
  }
};

export const GettingStartedSteps = async () => {
  const response = await API.get(`/getting-started/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error("Error fetching getting-started:", err);
    return { error: err };
  });

  if (response?.response) {
    // Handle server error response
    console.error("Server error:", response.response.data);
    return {};
  } else if (response?.status === 200) {
    return response.data;
  } else {
    return {};
  }
};

export const getHiringRolesData = async () => {
  const response = await API.get(`/roles/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error("Error fetching hiring roles:", err);
    return { error: err };
  });

  if (response?.response) {
    console.error("Server error:", response.response.data);
    return {};
  } else if (response?.status === 200) {
    return response.data;
  } else {
    return {};
  }
};

export const getRepresentingCompaniesData = async () => {
  const response = await API.get(`/representing-companies/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error("Error fetching representing companies:", err);
    return { error: err };
  });

  if (response?.response) {
    console.error("Server error:", response.response.data);
    return {};
  } else if (response?.status === 200) {
    return response.data;
  } else {
    return {};
  }
};

export const getTestimonialData = async () => {
  const response = await API.get(`/testimonial/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error("Error fetching testimonial:", err);
    return { error: err };
  });

  if (response?.response) {
    console.error("Server error:", response.response.data);
    return {};
  } else if (response?.status === 200) {
    return response.data;
  } else {
    return {};
  }
};

export const getAdvantagesData = async () => {
  const response = await API.get(`/Advantages/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error("Error fetching hiring benefits:", err);
    return { error: err };
  });

  if (response?.response) {
    console.error("Server error:", response.response.data);
    return [];
  } else if (response?.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const getOfferData = async () => {
  const response = await API.get(`/offer/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error("Error fetching offer data:", err);
    return { error: err };
  });

  if (response?.response) {
    console.error("Server error:", response.response.data);
    return [];
  } else if (response?.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const getFAQData = async () => {
  const response = await API.get(`/faqs/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error("Error fetching FAQ data:", err);
    return { error: err };
  });

  if (response?.response) {
    console.error("Server error:", response.response.data);
    return [];
  } else if (response?.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const getLoginQuotesData = async () => {
  const response = await API.get(`/LoginQuotes/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error("Error fetching LoginQuotes data:", err);
    return { error: err };
  });

  if (response?.response) {
    console.error("Server error:", response.response.data);
    return [];
  } else if (response?.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

// -----------------GET USER/WORKSPACE INFO----------------------------

export const getWorkspaceByEmail = async (email) => {
  const response = await API.get(`/workspace/?${email}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.log(err);
    return null;
  });

  if (response?.response) {
    if (response.response.status === 404) {
      notificationObject.error("Workspace not found");
    }
    if (response.response.status === 401) {
      notificationObject.error("Unauthorized access");
    }
    return {}; // return empty if error
  }

  if (response?.status === 200) {
    const { workspaces, choices } = response.data;
    console.log("Workspace:", workspaces[0]);
    console.log("choices:", choices);

    return {
      workspaces,
      choices,
    };
  }

  return {};
};

export const createJobPosting = async (jobData) => {
  const response = await API.post(`/job-postings/`, jobData, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error(err);

    if (err.response?.status === 400) {
      notificationObject.error("Invalid job posting data");
    }
    if (err.response?.status === 404) {
      notificationObject.error("Workspace not found");
    }
    if (err.response?.status === 401) {
      notificationObject.error("Unauthorized access");
    }

    return null;
  });

  if (response?.status === 201) {
    notificationObject.success("Job posting created successfully");
    console.log("Created Job Posting:", response.data);
    return response.data; // return created job posting
  }

  return null;
};

export const getJobPostingsByEmail = async (email) => {
  const response = await API.get(
    `/job-postings/?email=${encodeURIComponent(email)}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).catch((err) => {
    console.error(err);
    return null;
  });

  if (response?.response) {
    if (response.response.status === 404) {
      notificationObject.error("Workspace not found");
    }
    if (response.response.status === 401) {
      notificationObject.error("Unauthorized access");
    }
    return []; // return empty array if error
  }

  if (response?.status === 200) {
    const jobPostings = response.data;
    console.log("Job Postings:", jobPostings);

    return jobPostings;
  }

  return [];
};

export const getWorkspacesByWebsite = async (website) => {
  const response = await API.get(
    `workspaces/domain/?website=${encodeURIComponent(website)}`, // Removed extra slash at start
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).catch((err) => {
    console.error("Error fetching workspaces by website:", err);
    return null;
  });

  if (response?.response) {
    if (response.response.status === 404) {
      notificationObject.error("No workspaces found for this website");
    }
    if (response.response.status === 401) {
      notificationObject.error("Unauthorized access");
    }
    return [];
  }

  if (response?.status === 200) {
    console.log("Workspaces for website:", response.data);
    return response.data;
  }

  return [];
};

export const getAllJobs = async () => {
  const response = await API.get(`/jobs/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error("Error fetching job postings:", err);
    return { error: err };
  });

  if (response?.response) {
    console.error("Server error:", response.response.data);
    return [];
  } else if (response?.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const getJobById = async (jobId) => {
  const response = await API.get(`/jobs/${jobId}/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error(`Error fetching job with ID ${jobId}:`, err);
    return { error: err };
  });

  if (response?.response) {
    console.error("Server error:", response.response.data);
    return null;
  } else if (response?.status === 200) {
    return response.data;
  } else {
    return null;
  }
};

export const getJobPostingChoices = async () => {
  const response = await API.get(`/job-posting/choices/`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error("Error fetching job postings Choices:", err);
    return { error: err };
  });

  if (response?.response) {
    console.error("Server error:", response.response.data);
    return [];
  } else if (response?.status === 200) {
    return response.data;
  } else {
    return [];
  }
};

export const applyForJob = async (jobId, formData) => {
  try {
    const response = await API.post(`/apply/${jobId}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response?.status === 201 || response?.status === 200) {
      notificationObject.success("Application submitted successfully");
      console.log("Application Response:", response.data);
      return response.data;
    }
  } catch (err) {
    console.error("Error applying for job:", err);

    if (err.response?.status === 400) {
      notificationObject.error("Invalid application data");
    } else if (err.response?.status === 404) {
      notificationObject.error("Job not found");
    } else if (err.response?.status === 401) {
      notificationObject.error("Unauthorized access");
    } else {
      notificationObject.error("Something went wrong. Please try again.");
    }
  }

  return null;
};

export const getAppliedCandidates = async (jobId) => {
  try {
    const response = await API.get(`/jobs/${jobId}/candidates/`);

    if (response?.status === 200) {
      console.log("Applied Candidates Data:", response.data);
      return response.data;
    }
  } catch (err) {
    console.error("Error fetching applied candidates:", err);

    if (err.response?.status === 404) {
      notificationObject.error(
        "Job not found. Candidates cannot be retrieved."
      );
    } else if (err.response?.status === 401) {
      notificationObject.error("Unauthorized access. Please log in.");
    } else {
      notificationObject.error(
        "Failed to retrieve candidates. Please try again."
      );
    }
  }

  return null;
};
