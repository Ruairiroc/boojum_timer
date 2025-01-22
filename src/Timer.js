import React from "react";

const Timer = React.memo(({ timestamp, currentTime, audioRef, foodItem }) => {
  const formatTime = (timeLeft) => {
    console.log(timestamp, currentTime, timeLeft);
    if (!timestamp) {
      return "00:00:00";
    } else  if (!!timestamp && timeLeft <= 0) {
      showChromeNotification(foodItem);
      return "00:00:00";
    }
    const seconds = Math.floor(timeLeft / 1000);
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const showChromeNotification = (foodItem) => {
    audioRef.current.play();
    alert(`${foodItem}'s timer has finished!`);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    return
    // if (Notification.permission === "granted") {
        // const notification = new Notification("Timer Done!", {
        //     body: `${foodItem}'s timer has finished. Click to stop the sound.`,
        // });

        // notification.onclick = () => {
        //     audioRef.current.pause();
        //     audioRef.current.currentTime = 0;
        //     notification.close();
        // };
    // }
};
  const timeLeft = timestamp - currentTime;

  return (
    <div className="rectangle">
      {formatTime(timeLeft)}
    </div>
  );
});

export default Timer;