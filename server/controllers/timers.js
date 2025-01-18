
  // simplified to one object using foodItem as key and duration as value
  let timers = {
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

  // moving this here to keep track of undo history even when page is refreshed
  // initialised with first state of all null timers, shouldn't ever be zero items in the array
  let undoStack = [timers];

  // Function to update undo stack when any action is taken
  addToUndoStack = () => {
    undoStack.push({ ...timers });
    console.log(undoStack);
  };

  // function to pop last item from undo stack and set timers to previous value
  const undoLastAction = () => {
    if (undoStack.length > 1) {
      const previousState = undoStack.pop();
      timers = previousState;
    } else if (undoStack.length === 1) {
      // if only one item left in undo stack, set timers to that value but don't remove it
      timers = undoStack[0];
    }
  };
  // Controller to handle getting all timers
  const getTimers = (req, res) => {
    res.json(timers);
  };
  
  // Controller to handle starting or resetting a timer
  // Body of POST formatted as { foodItem: "Mexican Rice", duration: 300000 }
  const startOrResetTimer = (req, res) => {
    const { foodItem, duration } = req.body;
    addToUndoStack();
    timers[foodItem] = Date.now() + duration;
  
    res.status(200).json({ message: "Timer started/reset", endTime: timers[foodItem] });
  };
  
  
  // Controller to handle stopping a timer
  // Body of POST formatted as { foodItem: "Mexican Rice" }
  const stopTimer = (req, res) => {
    const { foodItem } = req.body;

    if (timers.hasOwnProperty(foodItem)) {
      addToUndoStack();
      timers[foodItem] = null;
      res.status(200).json({ message: `Timer stopped for ${foodItem}` });
    } else {
      res.status(400).json({ message: `Timer for ${foodItem} not found` });
    }
  };
  
  module.exports = {
    getTimers,
    undoLastAction,
    startOrResetTimer,
    stopTimer
  };
  