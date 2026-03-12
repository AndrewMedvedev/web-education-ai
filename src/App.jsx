import Header from "./components/header";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Auth from "./components/auth";

const App = () => {
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
