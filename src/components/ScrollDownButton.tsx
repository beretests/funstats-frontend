import React from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ScrollDownButton: React.FC = () => {
  return (
    <div className="flex justify-center mt-10">
      <button
        className="animate-bounce bg-primary-100 text-neutral-50 font-special px-4 py-2 rounded-full shadow-lg hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-100/50"
        onClick={() =>
          window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
        }
      >
        Learn More <KeyboardArrowDownIcon />
      </button>
    </div>
  );
};

export default ScrollDownButton;
