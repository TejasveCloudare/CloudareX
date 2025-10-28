import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import dashStyles from "./Dashboard.module.css";
import { GlobalContext } from "../../context/Context";
import { getWorkspaceByEmail } from "../../Api/services";

const Dashboard = () => {
  const { user } = useContext(GlobalContext);
  const [workspace, setWorkspace] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (!access) {
      navigate("/");
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (!isAuthorized || !user?.email) return;

    const fetchWorkspace = async () => {
      try {
        const data = await getWorkspaceByEmail(user.email);

        if (data?.workspace) {
          const finalWorkspace = {
            ...data.workspace,
            choices: data.choices,
          };
          setWorkspace(finalWorkspace);
        } else {
          setWorkspace(null);
        }
      } catch (error) {
        console.error("Error fetching workspace:", error);
        setWorkspace(null);
      }
    };

    fetchWorkspace();
  }, [user?.email, isAuthorized]);

  if (!isAuthorized) return null;

  return (
    <div className={dashStyles.dashboardContainer}>
      <Sidebar onToggle={setIsSidebarExpanded} />
      <div
        className={`${dashStyles.contentArea} ${
          isSidebarExpanded ? dashStyles.expanded : dashStyles.collapsed
        }`}
      >
        <Outlet context={{ user, workspace }} />
      </div>
    </div>
  );
};

export default Dashboard;
