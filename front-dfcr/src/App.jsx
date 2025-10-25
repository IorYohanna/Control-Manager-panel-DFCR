import * as React from "react";
import Signup from "./page/Auth/Signup";
import {
  Route,
  Routes
} from "react-router-dom";
import Login from "./page/Auth/Login";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />}/>
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}
export default App;
