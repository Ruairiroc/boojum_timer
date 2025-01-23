import { aliases } from "@fortawesome/free-solid-svg-icons/fa0";
import React, {useEffect, useState} from "react";


const Timer = React.memo(({ timestamp, currentTime,interacted, audioRef, foodItem, deleteTimer }) => {
  const [activated, setActivated] = useState(false);  

  
  const formatTime = (timeLeft) => {
    // console.log(timestamp, currentTime, timeLeft);
    if (!timestamp || timeLeft <= 0) {

      return "00:00:00";

    }

    const seconds = Math.floor(timeLeft / 1000);
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const showChromeNotification = (foodItem, ) => {







    // audioRef.play();
    // alert(`${foodItem}'s timer has finished!`);
    // audioRef.pause();
    // audioRef.currentTime = 0;

    return
    // if (Notification.permission === "granted") {
    //     const notification = new Notification("Timer Done!", {
    //         body: `${foodItem}'s timer has finished. Click to stop the sound.`,
    //     });

    //     notification.onclick = () => {
    //         audioRef.current.pause();
    //         audioRef.current.currentTime = 0;
    //         notification.close();
    //     };
    // }
};
  const timeLeft = timestamp - currentTime;

  useEffect(() => {
    if (timeLeft <= 0 && timestamp) {
      setActivated(true);
    
    if(interacted === true){ 
      deleteTimer(foodItem);     
      audioRef.current.play();
      audioRef.current.muted = false;
      alert(`${foodItem}'s timer has finished!`);
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
      setActivated(false);
    }
  }

  }, [timeLeft, timestamp, audioRef, foodItem, deleteTimer, interacted, activated]);

  return (
    <div className="rectangle" style={{ background: activated ? "red" : "" }} onClick={activated ? () => {deleteTimer(foodItem); setActivated(false)}: null}>
      {formatTime(timeLeft)}
    </div>

  );
});

export default Timer;