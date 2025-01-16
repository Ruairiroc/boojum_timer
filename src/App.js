import './App.css';
import Timers from './timers_2.js';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


function App() {
  const foodItems = ['Mexican Rice','Lime Rice','Chicken','Hot Honey Chicken','Beef','Pork','Chilli','Queso','Pinto Beans','Black Beans','3 Bean','Mock','Chorizo'];

  return(
    <Router>
      <div>
        <h1 className='header'>3 Hour Timer</h1>

        <Routes>
        <Route path="/" element={<Navigate to="/timers_2"/>} />

          <Route path="/timers_2" element={<Timers items={foodItems}></Timers>} />
           
        </Routes>
      </div>
    </Router>
  );
}

export default App;
