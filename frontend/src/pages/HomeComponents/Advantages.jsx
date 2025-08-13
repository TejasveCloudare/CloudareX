import React, { useEffect, useState } from "react";
import AdvStyles from "./Advantage.module.css";
import { getAdvantagesData } from "../../Api/services";
import { baseURL } from "../../Api/config";

const Advantages = () => {
  const [advantages, setAdvantages] = useState([]);

  useEffect(() => {
    const fetchAdvantages = async () => {
      const data = await getAdvantagesData();
      setAdvantages(data || []);
    };

    fetchAdvantages();
  }, []);

  return (
    <section className={AdvStyles.wrapper}>
      <h2 className={AdvStyles.heading}>
        The <span className={AdvStyles.highlight}>CloudareX advantage</span>
      </h2>

      <div className={AdvStyles.grid}>
        {advantages.map((item, index) => (
          <div key={index} className={AdvStyles.card}>
            <img
              src={`${baseURL}${item.icon}`}
              alt={item.title}
              className={AdvStyles.icon}
            />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Advantages;
