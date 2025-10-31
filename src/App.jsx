import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./App.css";

export default function App() {
  const [filters, setFilters] = useState({
    toxic: null,
    irrelevant: null,
  });
  const [showCustomize, setShowCustomize] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [customList, setCustomList] = useState([]);
  const [isDuplicate, setIsDuplicate] = useState(false);

  // when loading, retrieve from cookie
  useEffect(() => {
    const saved = Cookies.get("customFilters");
    if (saved) {
      try {
        setCustomList(JSON.parse(saved));
      } catch {
        console.warn("Failed to parse saved custom filters");
      }
    }
  }, []);

  // save to cookie once customlis is changed
  useEffect(() => {    
    if (customList.length > 0) {
      Cookies.set("customFilters", JSON.stringify(customList), { expires: 7, sameSite: "lax" });
    } else {
      Cookies.remove("customFilters");
    }
  }, [customList]);

  const handleInputChange = (e) => {
    setCustomValue(e.target.value);
    setIsDuplicate(false);
  };

  const addCustomValue = () => {
    const newValue = customValue.trim();
    if (!newValue) return;

    const exists = customList.some(
      (item) => item.toLowerCase() === newValue.toLowerCase()
    );

    if (exists) {
      setIsDuplicate(true);
      return;
    }
    setCustomList((prev) => [...prev, newValue]);
    setCustomValue("");
    setIsDuplicate(false);
  };

  const removeItem = (index) => {
    const updated = customList.filter((_, idx) => idx !== index);
    setCustomList(updated);
    if (updated.length > 0) {
      Cookies.set("customFilters", JSON.stringify(updated), {
        expires: 7,
        sameSite: "lax",
      });
    } else {
      Cookies.remove("customFilters");
    }
  };

  const clearAllFilters = () => {
    setCustomList([]);
    Cookies.remove("customFilters");
  };

  const setFilterLevel = (key, level) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === level ? null : level,
    }));
  };

  const resetFilters = () => {
    setFilters({
      toxic: null,
      irrelevant: null,
    });
  };

  const segmentButtonClass = (active) =>
    `flex-1 py-2 text-sm font-medium text-center transition-colors duration-150 outline-none focus:outline-none select-none
    ${active
      ? "bg-cyan-500 text-white"
      : "bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-400"
    }
    border-none
     `;

  return (
    <div className="w-full p-8 bg-white text-gray-900 font-sans shadow-sm rounded-md">

      {/* Toxic Filter */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2 text-center">Toxic Filter</h2>
        <div className="filter-group">
          <button
            onClick={() => setFilterLevel("toxic", "low")}
            className={segmentButtonClass(filters.toxic === "low")}
          >
            Low
          </button>
          <button
            onClick={() => setFilterLevel("toxic", "medium")}
            className={segmentButtonClass(filters.toxic === "medium")}
          >
            Medium
          </button>
          <button
            onClick={() => setFilterLevel("toxic", "high")}
            className={segmentButtonClass(filters.toxic === "high")}
          >
            High
          </button>
        </div>
      </div>

      {/* Irrelevant Filter */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2 text-center">Irrelevant Filter</h2>
        <div className="filter-group">
          <button
            onClick={() => setFilterLevel("irrelevant", "low")}
            className={segmentButtonClass(filters.irrelevant === "low")}
          >
            Low
          </button>
          <button
            onClick={() => setFilterLevel("irrelevant", "medium")}
            className={segmentButtonClass(filters.irrelevant === "medium")}
          >
            Medium
          </button>
          <button
            onClick={() => setFilterLevel("irrelevant", "high")}
            className={segmentButtonClass(filters.irrelevant === "high")}
          >
            High
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={resetFilters}
          className="flex-1 py-2 rounded text-white font-medium outline-none focus:outline-none focus:ring-0"
          style={{
            backgroundColor: "#5a6268",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#6c757d")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#5a6268")
          }
        >
          Reset
        </button>

        <button 
         onClick={async () => {
          try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            await chrome.tabs.sendMessage(tab.id, {
              action: "analyse_page",
              toxicMode: filters.toxic || "medium",
              relevantMode: filters.irrelevant || "medium",
              customFilters: customList
            });
            alert("Filtering started on current page!");
          } catch (err) {
            console.error("Failed to send message:", err);
            alert("Error: Could not communicate with the page.");
          }
        }}
        className="flex-1 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 outline-none focus:outline-none focus:ring-0">
          Apply
        </button>
      </div>

      {/* Customize expand */}
      <div className="mt-4 border-t border-gray-300 pt-4">
        <button
          onClick={() => setShowCustomize((prev) => !prev)}
          className="w-full py-2 rounded bg-gray-100 text-gray-800 font-medium hover:bg-blue-100 hover:text-blue-700 border border-gray-300 flex justify-between items-center px-4 transition-colors duration-200"
        >
          <span>Customize Filter</span>

          {/* + / - animation */}
          <span className="relative w-4 h-4 flex items-center justify-center">
            <span
              className={`absolute text-xl font-extrabold transition-all duration-300 transform ${
                showCustomize ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"
              }`}
            >
              +
            </span>
            <span
              className={`absolute text-2xl font-extrabold transition-all duration-300 transform ${
                showCustomize ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-180 scale-75"
              }`}
            >
              -
            </span>
          </span>
        </button>

        {/* Expand Content */}
        {showCustomize && (
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showCustomize ? "max-h-96 mt-3" : "max-h-0 mt-0"
            } bg-gray-50 border border-gray-200 rounded-md text-left`}
          >
            <div className="p-3">
              {/* input & add button */}
              <div className="flex flex-col mb-3">
                <div className="flex gap-2 w-full box-border">
                  <input
                    type="text"
                    value={customValue}
                    onChange={handleInputChange}
                    placeholder="Enter custom keyword"
                    className={`flex-1 min-w-0 px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 box-border 
                      placeholder:text-xs
                      ${
                        isDuplicate
                          ? "border-red-400 focus:ring-red-300"
                          : "border-gray-300 focus:ring-blue-400"
                      }`}
                  />
                  <button
                    onClick={addCustomValue}
                    disabled={!customValue.trim()}
                    className={`px-4 py-2 text-sm font-medium rounded text-white transition-colors ${
                      isDuplicate
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Add
                  </button>
                </div>

                {/* keyword exist error */}
                {isDuplicate && (
                  <p className="text-xs text-red-500 mt-1">
                    This keyword already exists.
                  </p>
                )}
              </div>

              {customList.length > 0 && (
                <div className="flex flex-col items-center mt-3">
                  <div className="flex flex-wrap justify-start gap-2 w-full overflow-y-auto max-h-[120px] pr-1">
                    {customList.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-gray-200 text-gray-800 text-sm px-3 py-1.5 rounded-full max-w-full break-all overflow-hidden"
                      >
                        <span className="whitespace-normal break-all">{item}</span>
                        <button
                          onClick={() => removeItem(i)}
                          className="text-gray-500 hover:text-gray-700 font-bold leading-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={clearAllFilters}
                    className="mt-3 px-3 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded font-medium hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
