import React, { useEffect, useState } from "react";
import gsStyles from "./GettingStarted.module.css";
import { GettingStartedSteps } from "../../Api/services";
import { baseURL } from "../../Api/config";

const GettingStarted = () => {
  const [stepsData, setStepsData] = useState([]);

  useEffect(() => {
    const fetchSteps = async () => {
      const res = await GettingStartedSteps();
      if (Array.isArray(res)) {
        setStepsData(res);
      }
    };

    fetchSteps();
  }, []);

  return (
    <section className={gsStyles.wrapper}>
      <h2 className={gsStyles.heading}>
        Get started in <span>3 simple steps</span>
      </h2>

      {stepsData.map((step, index) => (
        <div key={index} className={gsStyles.content}>
          <div className={gsStyles.left}>
            <div className={gsStyles.stepNumber}>{step.number}</div>
            <h3>{step.title}</h3>
            {step.is_html ? (
              <p
                dangerouslySetInnerHTML={{ __html: step.description }}
                className={gsStyles.htmlDesc}
              ></p>
            ) : (
              <p>{step.description}</p>
            )}
          </div>
          <div className={gsStyles.right}>
            <img
              src={`${baseURL}${step.image}`}
              alt={step.alt}
              className={gsStyles.gif}
            />
          </div>
        </div>
      ))}
    </section>
  );
};

export default GettingStarted;
