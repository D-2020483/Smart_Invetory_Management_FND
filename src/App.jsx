import React from "react"; 
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";

import SignIn from "@/pages/auth/Sign_in.page.jsx";
import SignUp from "./pages/auth/Sign_up.page";
import Homepage from "./pages/homepage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element= {<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Homepage/>} />
      </Routes>
    </Router>
  );
  };
export default App;