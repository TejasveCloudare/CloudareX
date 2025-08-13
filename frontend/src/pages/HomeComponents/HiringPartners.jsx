import React, { useState, useEffect } from "react";
import HPstyles from "./HiringPartners.module.css";
import { getHiringPartners } from "../../Api/services";
import { baseURL } from "../../Api/config"; // adjust path if needed

const HiringPartners = () => {
  const [data, setData] = useState({ heading: {}, companies: [] });

  useEffect(() => {
    const fetchData = async () => {
      const res = await getHiringPartners();
      if (res?.heading && res?.companies) {
        setData(res);
      }
    };

    fetchData();
  }, []);

  return (
    <section className={HPstyles.wrapper}>
      <div className={HPstyles.left}>
        <h2>{data.heading.title}</h2>
        <p>{data.heading.subtitle}</p>
      </div>
      <div className={HPstyles.right}>
        <div className={HPstyles.logoContainer}>
          {[...data.companies, ...data.companies].map((company, i) => (
            <img
              key={i}
              src={`${baseURL}${company.logo}`}
              alt={company.name}
              className={HPstyles.logo}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HiringPartners;
