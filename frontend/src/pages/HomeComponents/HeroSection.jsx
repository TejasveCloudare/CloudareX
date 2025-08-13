import React from "react";
import HeroStyle from "./HeroSection.module.css";

const HeroSection = () => {
  return (
    <div className={HeroStyle.heroWrapper}>
      <div className={HeroStyle.heroContent}>
        <div className={HeroStyle.heroLine} />
        <h1 className={HeroStyle.heroHeading}>
          Access <span className={HeroStyle.blue}>talent</span> you won't
          <br />
          <span className={HeroStyle.break}>reach elsewhere</span>
        </h1>
        <p className={HeroStyle.heroSubtext}>
          GrowthX connects you with experienced professionals
          <br />
          in <strong>Product</strong>, <strong>Strategy</strong>,{" "}
          <strong>Growth</strong>, <strong>Marketing</strong>, and
          <br />
          <strong>Executive roles</strong>
        </p>
        <button className={HeroStyle.ctaButton}>Post a job →</button>
      </div>
    </div>
  );
};

export default HeroSection;
