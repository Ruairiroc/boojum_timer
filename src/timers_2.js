import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTrashAlt, faUndo } from "@fortawesome/free-solid-svg-icons";
import Timer from "./Timer";
import "./App.css";

function Timers() {
  const [timers, setTimers] = useState({});
  const [deleteMode, setDeleteMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [interacted, setInteracted] = useState(false);  
  const [currentTime, setCurrentTime] = useState(Date.now());
  const audioRef = useRef(null);
  const alarm = new Audio("/mixkit-spaceship-alarm-998.mp3");

  useEffect(() => {
    
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    setLoading(true);
    window.addEventListener('click', setInteracted(true));
    window.addEventListener('touchstart', setInteracted(true));

    console.log(interacted);

    // .then() is for async functions, it will run the function inside the .then() after the first fetchTimers() function it is tacked onto returns,
    //  thus making sure the function has returned before setting loading to false
    fetchTimers().then(() => setLoading(false));
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000); // Update every second

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [interacted]);

  const fetchTimers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/timers");
      // console.log("Timers fetched:", response.data);  // Log the fetched timers object

      setTimers(response.data);
    } catch (error) {
      // console.error("Error fetching timers:", error);
    }
  };

  // after spending a long time trying to update this I realised it has no use in this context, we're getting the info from the backend always so no need to have maths going on in the front end...
  // const updateCountdowns = () => {
  //   setTimers((prevTimers) =>
  //     Object.entries(prevTimers).reduce((updatedTimers, [foodItem, timer]) => {
  //       if ( !!timer && getMilliseconds(timer) > 0) {
  //         updatedTimers[foodItem] = Math.max(timer - 1000, 0) 
  //       } else {
  //         updatedTimers[foodItem] =  null;
  //       }
  //       return updatedTimers;
  //     }, {}) // {} is the initial value of updatedTimers
  //   );
  // };

  const startOrResetTimer = async (foodItem) => {
    setInteracted(true);

    try {
      const duration = 5 * 1000; // 5 minutes in milliseconds

      // updated post request to send foodItem and duration in the body
      // fooditem is the name of the item gotten from the button click
      // the updated timers object is returned in the response from the backend
      const response = await axios.post("http://localhost:5000/api/timers/", { foodItem: foodItem, duration: duration });
      setTimers(response.data.timers);
      // Update timers from backend to keep in sync
      // only use backend data as source of truth (stops it going out of sync if only using one data source)
      
    } catch (error) {
      // console.error("Error starting/resetting timer:", error);
    }
  };

  // While to the end user it looks like the timer is being deleted, 
  // we're actually just updating the value in the timers object to null
  // so a post request is more suitable here as it allows necessary data (foodItem) to be sent in the body
  const deleteTimer = async (foodItem, duration) => {
    console.log("deleting timer", foodItem, duration);
    // only send request if timer is not at zero
    if (duration !== null || duration > currentTime) {
      try {
        const response = await axios.post("http://localhost:5000/api/timers/stop/", { foodItem });
        setTimers(response.data.timers);
      } catch (error) {
        // console.error("Error deleting timer:", error);
      }
    }
  };

  const undoLastAction = async () => {
    // send a post request to the backend to set timers object to previous state
    // then fetch updated timers object
    const response = await axios.post("http://localhost:5000/api/timers/undo/", {});
    setTimers(response.data.timers);
  };
  
  return (
    <div>
      <button
        onClick={() => setDeleteMode(!deleteMode)}
        className="button"
        style={{ backgroundColor: deleteMode ? "#ff6347" : "" }}
      >
        {deleteMode ? (
          <>
            <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: "5px" }} />
            Exit Delete Mode
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faTrash} style={{ marginRight: "5px" }} />
            Delete Mode
          </>
        )}
      </button>

      <button
        onClick={undoLastAction}
        className="button"
      >
        <FontAwesomeIcon icon={faUndo} style={{ marginRight: "5px" }} />
        Undo
      </button>

      { loading ? (
      <p>No timers available</p>
    ) : (
      // modified iterator for simplified {food: duration} object
      Object.entries(timers).map(([foodItem, duration]) => (
        <div key={foodItem} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <button
            onClick={() => (deleteMode ? deleteTimer(foodItem, duration) : startOrResetTimer(foodItem))}
            className="button"
          >
            {foodItem}
          </button>

          <Timer timestamp={duration} currentTime={currentTime} interacted={interacted} audioRef={audioRef} foodItem={foodItem} deleteTimer={deleteTimer}/>
        </div>
      )) // changed timer to it's own component because It's being reused and refreshed so often
    )}

      <audio ref={audioRef} src="/mixkit-spaceship-alarm-998.mp3" preload= "auto"></audio>
    </div>
  );
}

export default Timers;
