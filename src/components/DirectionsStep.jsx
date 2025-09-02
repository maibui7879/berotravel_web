import { FaTimes, FaArrowUp, FaArrowLeft, FaArrowRight, FaUndoAlt } from "react-icons/fa";

// Chọn icon dựa theo maneuver
function getStepIcon(maneuver) {
  if (!maneuver) return <FaArrowUp />;
  const { type, modifier } = maneuver;

  if (type === "turn") {
    if (modifier?.includes("left")) return <FaArrowLeft />;
    if (modifier?.includes("right")) return <FaArrowRight />;
    if (modifier?.includes("slight left")) return <FaArrowLeft />;
    if (modifier?.includes("slight right")) return <FaArrowRight />;
    if (modifier?.includes("uturn")) return <FaUndoAlt />;
  }

  if (type === "arrive") return <FaArrowUp />;
  return <FaArrowUp />;
}

// Hàm format step sang tiếng Việt
function formatStep(step) {
  // Bước cuối Arrive
  if (step.instruction?.startsWith("Arrive at")) {
    const match = step.instruction.match(/Arrive at (.+), on the (left|right)/i);
    if (match) {
      const side = match[2].toLowerCase() === "left" ? "bên trái" : "bên phải";
      return `Đến nơi, phía ${side}`;
    }
    return "Đến nơi";
  }

  const distanceKm = step.distance / 1000;
  const distance =
    distanceKm < 1 ? `${Math.round(step.distance)} m` : `${distanceKm.toFixed(2)} km`;

  if (!step.instruction) return "";

  let instr = step.instruction;

  // Dịch các dạng phổ biến sang tiếng Việt
  instr = instr.replace(/Head east on (.+)/i, `Đi về hướng đông trên $1`);
  instr = instr.replace(/Head west on (.+)/i, `Đi về hướng tây trên $1`);
  instr = instr.replace(/Head north on (.+)/i, `Đi về hướng bắc trên $1`);
  instr = instr.replace(/Head south on (.+)/i, `Đi về hướng nam trên $1`);

  instr = instr.replace(/Turn right onto (.+)/i, `rẽ phải vào $1`);
  instr = instr.replace(/Turn left onto (.+)/i, `rẽ trái vào $1`);
  instr = instr.replace(/Turn sharp right onto (.+)/i, `rẽ gắt phải vào $1`);
  instr = instr.replace(/Turn sharp left onto (.+)/i, `rẽ gắt trái vào $1`);
  instr = instr.replace(/Slight right onto (.+)/i, `rẽ nhẹ phải vào $1`);
  instr = instr.replace(/Slight left onto (.+)/i, `rẽ nhẹ trái vào $1`);

  instr = instr.replace(/Enter the roundabout and take the (\d+)(st|nd|rd|th) exit onto (.+)/i, `vào vòng xuyến và đi theo lối ra thứ $1 vào $3`);

  return `${distance} nữa, ${instr}`;
}

export default function DirectionsStep({
  steps,
  exitDirections,
  destinationName,
  duration,
  currentStepIndex,
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-md space-y-3 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg">
          Chỉ dẫn đến <span className="text-blue-500">{destinationName}</span> – Ước tính {duration}
        </h2>
        <button
          onClick={exitDirections}
          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
        >
          <FaTimes /> Thoát
        </button>
      </div>

      {/* Danh sách bước */}
      <div className="flex-1 overflow-auto">
        <ul className="space-y-2 text-sm text-gray-700">
          {steps.map((step, idx) => (
            <li
              key={idx}
              className={`flex items-start p-2 border rounded-md transition gap-2 ${
                idx === currentStepIndex ? "bg-blue-100 border-blue-400" : "hover:bg-gray-100"
              }`}
            >
              <div className="mt-1 text-green-600">{getStepIcon(step.maneuver)}</div>
              <div>
                <p>{formatStep(step)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
