import { useState, useEffect, createContext } from "react";
import {
  refresh,
  userDetails,
  getWorkspaceByEmail,
  getWorkspacesByWebsite,
  getJobPostingChoices,
} from "../Api/services";

export const GlobalContext = createContext();

export default function Context(props) {
  const [user, setUser] = useState({});
  const [workspace, setWorkspace] = useState(null);
  const [associatedNames, setAssociatedNames] = useState(null); // ✅ null means loading
  const [currentStep, setStep] = useState(0);
  const [jobPostingChoices, setJobPostingChoices] = useState(null);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      getUserDetails(access);
    } else {
      localStorage.clear();
    }
    fetchJobPostingChoices();
  }, []);

  const getUserDetails = async (access) => {
    const response = await userDetails(access);
    if (response.user) {
      setUser(response.user);
      getWorkspaceDetails(response.user.email); // ✅ Fetch workspace after user is set
    } else {
      const response = await refresh();
      if (response.refresh) {
        localStorage.setItem("access", response.access);
        getUserDetails(response.access);
      }
    }
  };

  const getWorkspaceDetails = async (email) => {
    try {
      const workspaceResponse = await getWorkspaceByEmail(email);
      if (
        workspaceResponse &&
        Array.isArray(workspaceResponse.workspaces) &&
        workspaceResponse.workspaces.length > 0
      ) {
        const finalWorkspace = {
          ...workspaceResponse.workspaces[0],
          choices: workspaceResponse.choices,
        };
        setWorkspace(finalWorkspace);

        // ✅ Fetch associated names after setting workspace
        fetchAssociatedNames(finalWorkspace.companyWebsite);
      } else {
        setWorkspace(null);
        setAssociatedNames([]); // clear if no workspace
      }
    } catch (error) {
      console.error("Failed to fetch workspace:", error);
      setWorkspace(null);
      setAssociatedNames([]);
    }
  };

  // ✅ Fetch associated names based on company website
  const fetchAssociatedNames = async (companyWebsite) => {
    if (!companyWebsite) return;

    setAssociatedNames(null); // ✅ show loading state

    const normalizeWebsite = (url) => {
      try {
        let domain = url.toLowerCase().replace(/^https?:\/\//, "");
        if (domain.startsWith("www.")) domain = domain.slice(4);
        return domain;
      } catch {
        return url;
      }
    };

    const normalizedWebsite = normalizeWebsite(companyWebsite);
    const data = await getWorkspacesByWebsite(normalizedWebsite);

    console.log("Associated names response:", data); // ✅ Debug

    if (Array.isArray(data)) {
      const names = data.filter(
        (name) => name?.toLowerCase() !== user?.full_name?.toLowerCase()
      );
      setAssociatedNames(names);
    } else {
      setAssociatedNames([]);
    }
  };

  const fetchJobPostingChoices = async () => {
    try {
      const response = await getJobPostingChoices();
      if (response) {
        setJobPostingChoices(response);
      }
    } catch (error) {
      console.error("Failed to fetch job posting choices:", error);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        workspace,
        setWorkspace,
        associatedNames, // ✅ Provided
        getWorkspaceDetails,
        currentStep,
        setStep,
        jobPostingChoices,
        fetchAssociatedNames,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
