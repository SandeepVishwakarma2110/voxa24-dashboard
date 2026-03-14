import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const DateRangeFilter = ({ onApply }) => {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showPicker, setShowPicker] = useState(false);

  const handleApply = () => {
    onApply(range[0]);
    setShowPicker(false);
  };

  return (
    <div   >
      <button 
        className="bg-[#2276B6] text-white px-4 py-2 rounded-lg hover:scale-105 smooth-transition"
        onClick={() => setShowPicker((prev) => !prev)}
      >
        Select Date Range
      </button>
      {showPicker && (
        <div className="mt-2 bg-white p-4 rounded shadow-lg w-fit">
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={range}
          />
          <button
            className="bg-[#FFB2B2] text-black py-2 w-full rounded mt-2"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
