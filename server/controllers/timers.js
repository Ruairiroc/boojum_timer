
  // simplified to one object using foodItem as key and duration as value
  const baseTimers = {
    "Mexican Rice": null, 
    "Lime Rice": null, 
    "Chicken": null, 
    "Hot Honey Chicken": null, 
    "Beef": null, 
    "Pork": null, 
    "Chilli": null, 
    "Queso": null, 
    "Pinto Beans": null, 
    "Black Beans": null, 
    "3 Bean": null, 
    "Mock": null, 
    "Chorizo": null
  };

  let timers = {...baseTimers};

  // moving this here to keep track of undo history even when page is refreshed
  // I don't like the idea of an infinite array, could build up too much memory
  // maybe limit it to 20 or so items in future
  let undoStack = [];

  // Function to update undo stack when any action is taken
  // if undo stack is empty, push base timers to it
  // had buggy behaviour if I didn't do this, as it would push the current timers object to the stack, which for some reason wasn't always all nulls on the first go
  addToUndoStack = () => {
    if (undoStack.length === 0) {
      undoStack.push({...baseTimers});
    } else {
      undoStack.push({...timers});
      console.log(undoStack);
    }
  };

  // function to pop last item from undo stack and set timers to previous value
  const undoLastAction = (req, res) => {
    if (undoStack.length > 0) {
      const previousState = undoStack.pop();
      console.log("setting timers to: ",previousState);
      timers = previousState;
    }  else if (undoStack.length === 0) {
      timers = {...baseTimers};
      console.log("setting timers to base: ",baseTimers);
    }
    res.status(200).json({ message: "Timers set to previous state", timers: timers});
  };
  // Controller to handle getting all timers
  const getTimers = (req, res) => {
    res.status(200).json(timers);
  };
  
  // Controller to handle starting or resetting a timer
  // Body of POST formatted as { foodItem: "Mexican Rice", duration: 300000 }
  const startOrResetTimer = (req, res) => {
    const { foodItem, duration } = req.body;
    addToUndoStack();
    timers[foodItem] = Date.now() + duration;
  
    res.status(200).json({ message: "Timer started/reset for "+foodItem, endTime: timers[foodItem], timers: timers});
  };
  
  
  // Controller to handle stopping a timer
  // Body of POST formatted as { foodItem: "Mexican Rice" }
  const stopTimer = (req, res) => {
    const { foodItem } = req.body;

    if (timers.hasOwnProperty(foodItem)) {
      addToUndoStack();
      timers[foodItem] = null;
      res.status(200).json({ message: `Timer stopped for ${foodItem}`, timers: timers });
    } else {
      res.status(400).json({ message: `Timer for ${foodItem} not found`});
    }
  };
  
  module.exports = {
    getTimers,
    undoLastAction,
    startOrResetTimer,
    stopTimer
  };
  