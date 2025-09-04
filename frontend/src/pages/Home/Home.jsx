/**
 * Created by - Tejasve gupta on 23-05-2024
 * Reason - Created home page
 */
import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

import homeStyle from "./Home.module.css";

// import { useLocation } from "react-router-dom";
import { GlobalContext } from "../../context/Context";
import HeroSection from "../HomeComponents/HeroSection";
import HiringPartners from "../HomeComponents/HiringPartners";
import GettingStarted from "../HomeComponents/GettingStarted";
import Roles from "../HomeComponents/Roles";
import RepresentingCompanies from "../HomeComponents/RepresentingCompanies";
import Testimonial from "../HomeComponents/Testimonial";
import Advantages from "../HomeComponents/Advantages";
import OfferCard from "../HomeComponents/Offer";
import FAQ from "../HomeComponents/FAQ";
// import Dashboard from "../Dashboard/Dashboard";

const Home = (props) => {
  const { user } = useContext(GlobalContext);
  return (
    <div className={`${homeStyle.pageFrame}`}>
      {/* <div className={`${homeStyle.coloredBackground}`}> */}
      <div className={`${homeStyle.pageContainer}`}>
        <HeroSection />
        <HiringPartners />
        <GettingStarted />
        <Roles />
        <RepresentingCompanies />
        <Testimonial />
        <Advantages />
        <OfferCard />
        <FAQ />
        {/* <Dashboard /> */}
      </div>
      {/* </div> */}
    </div>
  );
};

export default Home;
