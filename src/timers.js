import React, {useRef,useEffect, useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faTrashAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import './App.css';




function Timers({items}){
    // this is a test commit
    const[showRectangle, setShowRectangle] = useState(Array(items.length).fill(false));
    const[showTimer, setShowTimer] = useState(Array(items.length).fill(5));
    const[deleteMode, setDeleteMode] = useState(false);
    const[deletedIndex, setDeletedIndex] = useState(false);
    const[previousTimers,setPreviousTimers] = useState(Array(items.length).fill(null));
    const intervalIds = useRef(Array(items.length).fill(null));
    const audioRef = useRef(null);


    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    const handleClick = (index) =>{
        if (deleteMode) {
            // Handle deletion
            let updatedShowRectangle = [...showRectangle];
            updatedShowRectangle[index] = false;
            setShowRectangle(updatedShowRectangle);
            setDeletedIndex(index);

            setPreviousTimers((prevTimers) => {
                const updatedPreviousTimers = [...prevTimers];
                updatedPreviousTimers[index] = showTimer[index]; // Save the current timer before deleting
                return updatedPreviousTimers;
            });

            clearInterval(intervalIds.current[index]);
        } else {
            // Handle showing/resetting the timer
            let updatedShowRectangle = [...showRectangle];
            let updatedPreviousTimers = [...previousTimers];

            if (updatedShowRectangle[index]) {
                // If the rectangle is already shown, reset the timer
                //updatedPreviousTimers[index] = showTimer[index];
                resetTimer(index);
            } else {
                // Show the rectangle and start the timer
                updatedShowRectangle[index] = true;
                setShowTimer((prevTimers) => {
                    const updatedPreviousTimers = [...prevTimers];
                    updatedPreviousTimers[index] = 5;
                    return updatedPreviousTimers;
                });

                setPreviousTimers((prevTimers) => {
                    const updatedPreviousTimers = [...prevTimers];
                    updatedPreviousTimers[index] = 5;
                    return updatedPreviousTimers;
                });

                startTimer(index);
            }

            setShowRectangle(updatedShowRectangle);
            setPreviousTimers(updatedPreviousTimers);
            setDeletedIndex(null);
        }
    };

    const showChromeNotification = (itemName) => {
        audioRef.current.play();

        if (Notification.permission === "granted") {
            const notification = new Notification("Timer Done!", {
                body: `${itemName}'s timer has finished. Click to stop the sound.`,
            });

            notification.onclick = () => {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                notification.close();
            };
        }
    };

    const startTimer = (index) =>{
        clearInterval(intervalIds.current[index]);

        const intervalId = setInterval(() => {
            setShowTimer((prevTimers) => {
                const updatedTimers = [...prevTimers];
                if (updatedTimers[index] > 0) {
                    updatedTimers[index] -= 1;
                } else {
                    clearInterval(intervalId);
                    showChromeNotification(items[index]); 
                }
                return updatedTimers;
            });
        }, 1000);
    
        intervalIds.current[index] = intervalId;

    };


    const resetTimer = (index) => {
        clearInterval(intervalIds.current[index]);
        setShowTimer((prevTimers) => {
            const updatedTimers = [...prevTimers];
            updatedTimers[index] = 10800; 
            return updatedTimers;
        });

        startTimer(index);
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const undoLastAction = () => {
        if (deletedIndex !== null) {
            // Undo deletion
            let updatedShowRectangle = [...showRectangle];
            updatedShowRectangle[deletedIndex] = true;
            setShowRectangle(updatedShowRectangle);

            setShowTimer((prevTimers) => {
                const updatedTimers = [...prevTimers];
                updatedTimers[deletedIndex] = previousTimers[deletedIndex];
                return updatedTimers;
            });
    
            startTimer(deletedIndex);
            setDeletedIndex(null);
        } else {
            // Undo timer reset
            const index = previousTimers.findIndex(timer => timer !== null);
            if (index !== -1) {
                clearInterval(intervalIds.current[index]); // Stop the current timer
    
                setShowTimer((prevTimers) => {
                    const updatedTimers = [...prevTimers];
                    updatedTimers[index] = previousTimers[index]; // Restore the previous timer
                    return updatedTimers;
                });
    
                startTimer(index); // Restart the timer
                setPreviousTimers((prevTimers) => {
                    const updatedPreviousTimers = [...prevTimers];
                    updatedPreviousTimers[index] = null; // Clear the previous timer value after undo
                    return updatedPreviousTimers;
                });
            }
        }
    };

    return(
        <div>
            <button onClick={() => setDeleteMode(!deleteMode)} className="button" style={{
                    backgroundColor: deleteMode ? '#ff6347' : '', // Change color when in delete mode
                }}>
                {deleteMode ? (
                    <>
                        <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: '5px' }} />
                        Exit Delete Mode
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }} />
                        Delete Mode
                    </>
                )}
            </button>

            <button onClick={undoLastAction} className="button" disabled={previousTimers.every(timer => timer === null) && deletedIndex === null}>
                <FontAwesomeIcon icon={faUndo} style={{ marginRight: '5px' }} />
                Undo
            </button>

            {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <button  onClick={() => handleClick(index)} className='button'>
                    {item}
                    {showRectangle[index]}
                </button>

                {showRectangle[index] && (
                <div className="rectangle">
                    {formatTime(showTimer[index])}
                </div>)}
                </div>
            ))}

            <audio ref={audioRef} src="/mixkit-spaceship-alarm-998.mp3" preload="auto"></audio>
        </div>
    );
}

export default Timers;