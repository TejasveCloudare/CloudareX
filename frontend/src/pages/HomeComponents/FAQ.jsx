import React, { useState, useEffect } from "react";
import FAQstyles from "./FAQ.module.css";
import { getFAQData } from "../../Api/services"; // Adjust the path if needed

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqData, setFaqData] = useState({ heading: "", items: [] });

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFAQData();
      if (data && data.items) {
        setFaqData(data);
      }
    };
    fetchData();
  }, []);

  return (
    <section className={FAQstyles.wrapper}>
      <h2 className={FAQstyles.heading}>{faqData.heading}</h2>
      {faqData.items.map((item, index) => (
        <div
          key={index}
          className={`${FAQstyles.item} ${
            openIndex === index ? FAQstyles.open : ""
          }`}
        >
          <div className={FAQstyles.question} onClick={() => toggle(index)}>
            {item.question}
            <span className={FAQstyles.icon}>
              {openIndex === index ? "−" : "+"}
            </span>
          </div>

          <div
            className={`${FAQstyles.answerWrapper} ${
              openIndex === index ? FAQstyles.expand : FAQstyles.collapse
            }`}
          >
            <div className={FAQstyles.answer}>{item.answer}</div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FAQ;
