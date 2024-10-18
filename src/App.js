import './App.css';
import Timers from './timers.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  const foodItems = ['Mexican Rice','Lime Rice','Chicken','Hot Honey Chicken','Beef','Pork','Chilli','Queso','Pinto Beans','Black Beans','3 Bean','Mock','Chorizo'];

  return(
    <Router>
      <div>
        <h1 className='header'>3 Hour Timer</h1>

        <Routes>
          <Route path="/timers" element={<Timers items={foodItems}></Timers>} />
           
        </Routes>
      </div>
    </Router>
  );
}

export default App;
