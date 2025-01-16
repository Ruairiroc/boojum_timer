import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTrashAlt, faUndo } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function Timers() {
  const [timers, setTimers] = useState([]);
  const [undoStack, setUndoStack] = useState([]); 
  const [deleteMode, setDeleteMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchTimers();
    const interval = setInterval(() => {
      updateCountdowns();
    }, 1000); // Update every second

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  const fetchTimers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/timers");
      console.log("Timers fetched:", response.data);  // Log the fetched timers

      setTimers(response.data);
    } catch (error) {
      console.error("Error fetching timers:", error);
    }
    setLoading(false);
  };

  const updateCountdowns = () => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.remainingTime !== null && timer.remainingTime > 0) {
          return { ...timer, remainingTime: Math.max(timer.remainingTime - 1000, 0) };
        }
        return timer;
      })
    );
  };

  const startOrResetTimer = async (index) => {
    try {
      setUndoStack((prevStack) => [...prevStack, [...timers]]);

      const duration = 5 * 60 * 1000; // 5 minutes in milliseconds
      await axios.post(`http://localhost:5000/api/timers/${index}`, { duration });
  
      // Update timer directly in the state
      setTimers((prevTimers) =>
        prevTimers.map((timer, idx) =>
          idx === index ? { ...timer, remainingTime: duration } : timer
        )
      );
    } catch (error) {
      console.error("Error starting/resetting timer:", error);
    }
  };

  const deleteTimer = async (index) => {
    try {
      setUndoStack((prevStack) => [...prevStack, [...timers]]);

      await axios.delete(`http://localhost:5000/api/timers/${index}`);
      fetchTimers();
    } catch (error) {
      console.error("Error deleting timer:", error);
    }
  };

  const undoLastAction = () => {
    if (undoStack.length > 0) {
      // Restore the last state from the stack
      const previousState = undoStack[undoStack.length - 1];
      setUndoStack((prevStack) => prevStack.slice(0, -1)); // Remove the last state
      setTimers(previousState); // Restore timers to previous state
    }
  };

  const formatTime = (milliseconds) => {
    if (milliseconds === null) return "Not running";
    const seconds = Math.floor(milliseconds / 1000);
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  if (loading) return <p>Loading...</p>;

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

      {timers.length === 0 ? (
      <p>No timers available</p>
    ) : (
      timers.map((timer, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <button
            onClick={() => (deleteMode ? deleteTimer(index) : startOrResetTimer(index))}
            className="button"
          >
            {timer.item}
          </button>

          <div className="rectangle">{formatTime(timer.remainingTime)}</div>
        </div>
      ))
    )}

      <audio ref={audioRef} src="/mixkit-spaceship-alarm-998.mp3" preload="auto"></audio>
    </div>
  );
}

export default Timers;
