import React from "react";

const Timer = React.memo(({ timestamp, currentTime }) => {
  const formatTime = (timeLeft) => {

    if (timeLeft <= 0) {
      return "00:00:00";
    }
    const seconds = Math.floor(timeLeft / 1000);
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const timeLeft = timestamp - currentTime;

  return (
    <div className="rectangle">
      {formatTime(timeLeft)}
    </div>
  );
});

export default Timer;