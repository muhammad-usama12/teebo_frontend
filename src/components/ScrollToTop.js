import React, { useState, useEffect } from "react";

export default function ScrollToTop() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScrollButtonShow = () => {
      window.pageYOffset > 300 ? setShowButton(true) : setShowButton(false)
    }

    window.addEventListener("scroll", handleScrollButtonShow);

    return () => {
      window.removeEventListener("scroll", handleScrollButtonShow)
    };
  }, [])

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth"});
  }

  return (
    <>
      {showButton &&
      <button
        className="scroll-to-top"
        onClick={handleScrollToTop}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>}
    </>
  );
}