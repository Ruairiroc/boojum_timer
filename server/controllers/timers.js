const foodItems = [
    'Mexican Rice', 'Lime Rice', 'Chicken', 'Hot Honey Chicken', 'Beef', 'Pork', 'Chilli', 'Queso', 'Pinto Beans', 'Black Beans', '3 Bean', 'Mock', 'Chorizo'
  ];
  let timers = foodItems.map(() => null);
  
  // Controller to handle getting all timers
  const getTimers = (req, res) => {
    const currentTimers = timers.map((timer, index) => {
      if (timer) {
        const remainingTime = Math.max(0, timer.endTime - Date.now());
        return { item: foodItems[index], remainingTime };
      } else {
        return { item: foodItems[index], remainingTime: null };
      }
    });
    res.json(currentTimers);
  };
  
  // Controller to handle starting or resetting a timer
  const startOrResetTimer = (req, res) => {
    const { index } = req.params;
    const { duration } = req.body;
  
    if (!timers[index]) {
      timers[index] = { endTime: Date.now() + duration };
    } else {
      timers[index].endTime = Date.now() + duration;
    }
  
    res.status(200).json({ message: "Timer started/reset", endTime: timers[index].endTime });
  };
  
  // Controller to handle stopping a timer
  const stopTimer = (req, res) => {
    const { index } = req.params;
    timers[index] = null;
    res.status(200).json({ message: "Timer stopped" });
  };
  
  module.exports = {
    getTimers,
    startOrResetTimer,
    stopTimer
  };
  