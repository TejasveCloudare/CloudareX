import { useState, useEffect, createContext } from "react";
import { refresh, userDetails, getWorkspaceByEmail } from "../Api/services";

export const GlobalContext = createContext();

export default function Context(props) {
  const [user, setUser] = useState({});
  const [workspace, setWorkspace] = useState(null);
  const [currentStep, setStep] = useState(1);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      getUserDetails(access);
    } else {
      localStorage.clear();
    }
  }, []);

  const getUserDetails = async (access) => {
    const response = await userDetails(access);
    if (response.user) {
      setUser(response.user);
      getWorkspaceDetails(response.user.email); // fetch workspace after user is set
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
        console.log("Setting workspace to:", finalWorkspace); // ✅ Log here
        setWorkspace(finalWorkspace);
      } else {
        console.warn("No workspace found for email:", email);
        setWorkspace(null);
      }
    } catch (error) {
      console.error("Failed to fetch workspace:", error);
      setWorkspace(null);
    }
  };

  console.log("workspace--", workspace);
  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        workspace,
        setWorkspace,
        getWorkspaceDetails,
        currentStep,
        setStep,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
