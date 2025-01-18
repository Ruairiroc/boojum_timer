import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTrashAlt, faUndo } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function Timers() {
  const [timers, setTimers] = useState({});
  const [undoStack, setUndoStack] = useState([]); 
  const [deleteMode, setDeleteMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetchTimers().then(() => setLoading(false));
    const interval = setInterval(() => {
      fetchTimers();
    }, 1000); // Update every second

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const fetchTimers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/timers");
      console.log("Timers fetched:", response.data);  // Log the fetched timers object

      setTimers(response.data);
    } catch (error) {
      console.error("Error fetching timers:", error);
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
    try {
      setUndoStack((prevStack) => [...prevStack, timers]);

      const duration = 5 * 60 * 1000; // 5 minutes in milliseconds

      // updated post request to send foodItem and duration in the body
      // fooditem is the name of the item gotten from the button click
      await axios.post("http://localhost:5000/api/timers/", { foodItem: foodItem, duration: duration });
  
      // Update timers from backend to keep in sync
      // only use backend data as source of truth (stops it going out of sync if only using one data source)
      fetchTimers();
    } catch (error) {
      console.error("Error starting/resetting timer:", error);
    }
  };

  // While to the end user it looks like the timer is being deleted, 
  // we're actually just updating the value in the timers object to null
  // so a post request is more suitable here as it allows necessary data (foodItem) to be sent in the body
  const deleteTimer = async (foodItem) => {
    try {
      setUndoStack((prevStack) => [...prevStack, timers]);

      await axios.post("http://localhost:5000/api/timers/stop/", { foodItem });
      fetchTimers();
    } catch (error) {
      console.error("Error deleting timer:", error);
    }
  };

  const undoLastAction = () => {
    if (undoStack.length > 0) {
      console.log(undoStack);
      // Restore the last state from the stack
      const previousState = undoStack[undoStack.length - 1];
      setUndoStack((prevStack) => prevStack.slice(0, -1)); // Remove the last state
      
      console.log(undoStack);
      setTimers(previousState); // Restore timers to previous state
    }
  };

  const getMilliseconds = (timestamp) => {
    return timestamp - Date.now();
  }

  const formatTime = (timestamp) => {
    if (timestamp === null) {
      return "00:00:00"
    } else {
      const milliseconds = getMilliseconds(timestamp);
      // if (milliseconds <= 0) {
      //   audioRef.current.play();
      //   return "00:00:00";
      // }
      const seconds = Math.floor((milliseconds / 1000));
      const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      return `${h}:${m}:${s}`;
    }
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
        disabled={undoStack.length === 0} // Disable if there's no undo history
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
            onClick={() => (deleteMode ? deleteTimer(foodItem) : startOrResetTimer(foodItem))}
            className="button"
          >
            {foodItem}
          </button>

          <div className="rectangle">{formatTime(duration)}</div>
        </div>
      ))
    )}

      <audio ref={audioRef} src="/mixkit-spaceship-alarm-998.mp3" preload="auto"></audio>
    </div>
  );
}

export default Timers;
