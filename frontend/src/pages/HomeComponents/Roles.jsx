import React, { useEffect, useState } from "react";
import rolesStyles from "./Roles.module.css";
import { getHiringRolesData } from "../../Api/services";
import { baseURL } from "../../Api/config";
const Roles = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      const result = await getHiringRolesData();
      setData(result);
    };

    fetchRoles();
  }, []);

  if (!data) return null;

  return (
    <section className={rolesStyles.wrapper}>
      <h2 className={rolesStyles.heading}>
        {data.heading.title} <span>{data.heading.highlight || ""}</span>
      </h2>
      <p className={rolesStyles.subheading}>{data.heading.subtitle}</p>

      <div className={rolesStyles.cardGrid}>
        {data.roles.map((role, index) => (
          <div key={index} className={rolesStyles.card}>
            <img
              src={`${baseURL}${role.icon}`} // full URL from backend
              alt={role.title}
              className={rolesStyles.icon}
            />
            <h3>{role.title}</h3>
            <p>{role.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Roles;
