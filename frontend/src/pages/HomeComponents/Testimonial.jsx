import React, { useEffect, useState } from "react";
import TestimonialStyles from "./Testimonial.module.css";
import { getTestimonialData } from "../../Api/services";
import { baseURL } from "../../Api/config";

const Testimonial = () => {
  const [testimonial, setTestimonial] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTestimonialData();
      setTestimonial(data);

      if (data?.image) {
        try {
          const image = data.image;
          setImageSrc(image);
        } catch (err) {
          console.error("Image not found:", data.image);
          // Optionally set fallback image:
          // setImageSrc(require(`../../assets/images/default.png`));
        }
      }
    };

    fetchData();
  }, []);

  if (!testimonial) return null;

  return (
    <section className={TestimonialStyles.wrapper}>
      <div className={TestimonialStyles.content}>
        <div className={TestimonialStyles.textSection}>
          <p className={TestimonialStyles.quote}>“{testimonial.quote}“</p>
          <div className={TestimonialStyles.meta}>
            <div>
              <p className={TestimonialStyles.name}>{testimonial.name}</p>
              <p className={TestimonialStyles.role}>
                {testimonial.designation}
              </p>
            </div>
            <div className={TestimonialStyles.separator}></div>
            <div
              className={TestimonialStyles.company}
              style={{ color: testimonial.companyColor }}
            >
              {testimonial.company}
            </div>
          </div>
        </div>
        <div className={TestimonialStyles.imageSection}>
          {imageSrc && (
            <img
              src={`${baseURL}${imageSrc}`}
              alt={testimonial.name}
              className={TestimonialStyles.personImage}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
