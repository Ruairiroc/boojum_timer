import './App.css';
import Timers from './timers.js';
import Login from './Login';
import Signup from './Signup';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  const foodItems = ['Mexican Rice','Lime Rice','Chicken','Hot Honey Chicken','Beef','Pork','Chilli','Queso','Pinto Beans','Black Beans','3 Bean','Mock','Chorizo'];

  return(
    <Router>
      <div>
        <h1 className='header'>3 Hour Timer</h1>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
          <PrivateRoute>
            <Timers items={foodItems}></Timers>
          </PrivateRoute>
          } />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
