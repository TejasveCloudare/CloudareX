import React, { useState, useEffect } from "react";
import RCstyles from "./RepresentingCompanies.module.css";
import { getRepresentingCompaniesData } from "../../Api/services";
import { baseURL } from "../../Api/config";
const RepresentingCompanies = () => {
  const [data, setData] = useState({ heading: {}, companies: [] });

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRepresentingCompaniesData();
      setData(response || { heading: {}, companies: [] });
    };

    fetchData();
  }, []);

  return (
    <section className={RCstyles.wrapper}>
      <div className={RCstyles.left}>
        <h2>{data.heading.title}</h2>
        <p>{data.heading.subtitle}</p>
      </div>
      <div className={RCstyles.right}>
        <div className={RCstyles.logoContainer}>
          {[...data.companies, ...data.companies].map((company, i) => (
            <img
              key={i}
              src={`${baseURL}${company.logo}`}
              alt={company.name}
              className={RCstyles.logo}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RepresentingCompanies;
