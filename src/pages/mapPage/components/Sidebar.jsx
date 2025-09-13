import { useState, useRef } from "react";
import SearchBar from "../components/SearchBar";
import ResultList from "../components/ResultList";
import DirectionsStep from "../components/DirectionsStep";

export default function Sidebar({
  drawerOpen,
  setDrawerOpen,
  mobileFull,
  setMobileFull,
  steps,
  results,
  handleSearch,
  handleDirections,
  handleDetail,
  handleSelectPlace,
  loadingDirections,
  userLocation,
  exitDirections,
  directionsDestination,
  durationText,
  currentStepIndex,
}) {
  const sidebarRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const [dragging, setDragging] = useState(false);

  const handleMouseDown = (e) => {
    setDragging(true);
    startYRef.current = e.clientY || e.touches[0].clientY;
    startHeightRef.current = sidebarRef.current.getBoundingClientRect().height;
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const clientY = e.clientY || e.touches[0].clientY;
    const delta = startYRef.current - clientY;
    let newHeight = startHeightRef.current + delta;
    const windowHeight = window.innerHeight;
    if (newHeight < windowHeight * 0.4) newHeight = windowHeight * 0.4;
    if (newHeight > windowHeight) newHeight = windowHeight;
    sidebarRef.current.style.height = `${newHeight}px`;
  };

  const handleMouseUp = () => {
    if (!dragging) return;
    setDragging(false);
    document.body.style.userSelect = "auto";
    const windowHeight = window.innerHeight;
    const currentHeight = sidebarRef.current.getBoundingClientRect().height;
    setMobileFull(currentHeight > windowHeight * 0.7); // auto full nếu >70% màn hình
  };

  return (
    <>
      {drawerOpen && (
        <div
          ref={sidebarRef}
          className={`
            fixed right-0 bottom-0 md:top-0
            w-full md:w-[400px]
            ${mobileFull ? "h-full" : "h-[40%]"} md:h-full
            bg-gray-200 shadow-2xl z-[9999]
            rounded-t-xl md:rounded-l-xl
            flex flex-col transition-all duration-300
          `}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Toggle desktop */}
          <button
            className={`hidden md:block
              absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full
              bg-gray-500 text-white px-2 py-6
              rounded-l-full shadow-lg hover:bg-gray-600 z-[10000]`}
            onClick={() => setDrawerOpen(false)}
          >
            ›
          </button>

          {/* Mobile drag handle */}
          <div
            className="md:hidden w-12 h-1.5 bg-gray-400 rounded-full mx-auto mt-2 cursor-grab"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          />

          <div className="p-4 flex-1 overflow-auto scrollbar-hide">
            {!steps.length && <SearchBar onSearch={handleSearch} />}

            {!steps.length ? (
              <ResultList
                results={results}
                onDirections={handleDirections}
                onDetail={handleDetail}
                onSelectPlace={handleSelectPlace}
                loadingDirections={loadingDirections}
                userLocation={userLocation}
              />
            ) : (
              <DirectionsStep
                steps={steps}
                exitDirections={exitDirections}
                destinationName={directionsDestination}
                duration={durationText}
                currentStepIndex={currentStepIndex}
              />
            )}
          </div>
        </div>
      )}

      {/* Toggle button desktop khi đóng */}
      {!drawerOpen && (
        <button
          className={`
            hidden md:block fixed right-0 top-1/2 -translate-y-1/2
            bg-gray-500 text-white px-2 py-6 rounded-l-full shadow-lg hover:bg-gray-600 z-[10000]`}
          onClick={() => setDrawerOpen(true)}
        >
          ‹
        </button>
      )}
    </>
  );
}
