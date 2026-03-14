import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";

const App = () => {
  const names = ["Модуль1", "Модуль2", "Модуль3", "Модуль4"];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home names={names} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
