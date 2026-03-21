import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Theory from "./components/theory";
import Modules from "./components/module";
import Auth from "./components/auth";
const App = () => {
  const names = ["Модуль1", "Модуль2", "Модуль3", "Модуль4"];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home names={names} />} />
        <Route path="/module/:id/theory" element={<Theory names={names} />} />
        <Route path="/module/:id" element={<Modules index={123} />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
