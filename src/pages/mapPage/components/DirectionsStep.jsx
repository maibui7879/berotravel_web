import { FaTimes, FaArrowUp, FaArrowLeft, FaArrowRight, FaUndoAlt, FaArrowDown } from "react-icons/fa";

// Chọn icon dựa theo maneuver
function getStepIcon(maneuver) {
  if (!maneuver) return <FaArrowUp />;
  const { type, modifier } = maneuver;

  if (type === "turn") {
    if (modifier === "left" || modifier === "slight left") return <FaArrowLeft />;
    if (modifier === "right" || modifier === "slight right") return <FaArrowRight />;
    if (modifier === "sharp left") return <FaArrowLeft className="rotate-45" />;
    if (modifier === "sharp right") return <FaArrowRight className="-rotate-45" />;
    if (modifier === "uturn" || modifier === "uturn left" || modifier === "uturn right")
      return <FaUndoAlt />;
    return <FaArrowUp />;
  }

  if (type === "merge" || type === "on ramp" || type === "off ramp" || type === "fork") {
    if (modifier?.includes("left")) return <FaArrowLeft />;
    if (modifier?.includes("right")) return <FaArrowRight />;
    return <FaArrowUp />;
  }

  if (type === "roundabout" || type === "rotary") {
    return <FaUndoAlt />;
  }

  if (type === "arrive") {
    if (modifier === "left") return <FaArrowLeft />;
    if (modifier === "right") return <FaArrowRight />;
    return <FaArrowDown />;
  }

  return <FaArrowUp />;
}

// Hàm format step sang tiếng Việt
function formatStep(step) {
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
  instr = instr.replace(/Head east on (.+)/i, `đi về hướng đông trên $1`);
  instr = instr.replace(/Head west on (.+)/i, `đi về hướng tây trên $1`);
  instr = instr.replace(/Head north on (.+)/i, `đi về hướng bắc trên $1`);
  instr = instr.replace(/Head south on (.+)/i, `đi về hướng nam trên $1`);
  instr = instr.replace(/Continue straight onto (.+)/i, `đi thẳng trên $1`);
  instr = instr.replace(/Turn right onto (.+)/i, `rẽ phải vào $1`);
  instr = instr.replace(/Turn left onto (.+)/i, `rẽ trái vào $1`);
  instr = instr.replace(/Turn sharp right onto (.+)/i, `rẽ gắt phải vào $1`);
  instr = instr.replace(/Turn sharp left onto (.+)/i, `rẽ gắt trái vào $1`);
  instr = instr.replace(/Slight right onto (.+)/i, `rẽ nhẹ phải vào $1`);
  instr = instr.replace(/Slight left onto (.+)/i, `rẽ nhẹ trái vào $1`);
  instr = instr.replace(
    /Enter the roundabout and take the (\d+)(st|nd|rd|th) exit onto (.+)/i,
    `vào vòng xuyến và đi theo lối ra thứ $1 vào $3`
  );

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
      <div className="items-center mb-2">
        <h2 className="font-bold text-lg">
          Chỉ dẫn đến <span className="text-blue-500">{destinationName}</span> – Ước tính {duration}
        </h2>
        <button
          onClick={exitDirections}
          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
        >
          <FaTimes /> Thoát đi theo chỉ dẫn
        </button>
      </div>

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
