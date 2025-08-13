import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword.jsx";
import { LinkedInCallback } from "react-linkedin-login-oauth2";
import LinkedInRedirectHandler from "./pages/Login/LinkedInRedirectHandler.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Profile from "./pages/Dashboard/Profile.jsx";
import Pricing from "./pages/Dashboard/Pricing.jsx";
import WorkspaceInfo from "./pages/Login/WorkspaceInfo.jsx";
import Role from "./pages/Login/LoginRole.jsx";
import DashboardHome from "./pages/DbHomeComponents/DashHome.jsx";
import JobPosting from "./pages/Dashboard/JobPosting.jsx";
import JobPostingForm from "./pages/dbJobsComponents/JobPostingForm.jsx";
import ViewJobs from "./pages/Dashboard/ViewJobs.jsx";
import JobsById from "./pages/dbJobsComponents/JobsById.jsx";

function App() {
  return (
    <div>
      <Header />{" "}
      <Routes>
        <Route path="/" element={<Home />} />{" "}
        <Route path="/login" element={<Login />} />{" "}
        <Route path="/workspace" element={<WorkspaceInfo />} />{" "}
        <Route path="/role" element={<Role />} />{" "}
        <Route path="/signup" element={<Signup />} />{" "}
        <Route path="/forgotPassword" element={<ForgotPassword />} />{" "}
        <Route path="/linkedin" element={<LinkedInCallback />} />{" "}
        <Route path="/linkedin" element={<LinkedInRedirectHandler />} />{" "}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />{" "}
          <Route path="profile" element={<Profile />} />{" "}
          <Route path="jobs" element={<JobPosting />} />{" "}
          <Route path="pricing" element={<Pricing />} />{" "}
          <Route path="create-job" element={<JobPostingForm />} />{" "}
          <Route path="view-jobs" element={<ViewJobs />} />{" "}
          <Route path="job/:jobId" element={<JobsById />} />{" "}
        </Route>{" "}
      </Routes>{" "}
      <Footer />{" "}
    </div>
  );
}

export default App;
