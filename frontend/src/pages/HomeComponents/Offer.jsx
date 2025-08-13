import React, { useEffect, useState } from "react";
import OfferStyles from "./Offer.module.css";
import { getOfferData } from "../../Api/services";
import { baseURL } from "../../Api/config";
const Offer = () => {
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOfferData();
      setOffer(data);
    };
    fetchData();
  }, []);

  if (!offer) return null;

  const firstCol = offer.features.slice(0, 4);
  const secondCol = offer.features.slice(4);

  return (
    <section className={OfferStyles.wrapper}>
      <div className={OfferStyles.card}>
        <div className={OfferStyles.header}>
          <div className={OfferStyles.LeftHeader}>
            <span className={OfferStyles.badge}>{offer.badge}</span>
            <div className={OfferStyles.discount}>
              <span className={OfferStyles.strike}>{offer.info.old}</span>
              <span className={OfferStyles.free}>{offer.info.new}</span>
            </div>
            <p className={OfferStyles.note}>{offer.info.note}</p>
          </div>
          <a href={offer.cta.link} className={OfferStyles.cta}>
            {offer.cta.text} →
          </a>
        </div>

        <hr className={OfferStyles.divider} />

        <div className={OfferStyles.features}>
          <ul>
            {firstCol.map((feat, index) => (
              <li key={index}>✅ {feat}</li>
            ))}
          </ul>
          <ul>
            {secondCol.map((feat, index) => (
              <li key={index}>✅ {feat}</li>
            ))}
          </ul>
        </div>

        <p className={OfferStyles.trusted}>{offer.info.TrustedText}</p>

        <div className={OfferStyles.logoSliderWrapper}>
          <div className={OfferStyles.logoSlider}>
            {offer.trustedBy.concat(offer.trustedBy).map((logo, index) => (
              <img key={index} src={`${baseURL}${logo}`} alt="Trusted Logo" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offer;
