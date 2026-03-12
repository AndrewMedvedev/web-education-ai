import { NavLink } from "react-router-dom";
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <h1>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Образовательная платформа ТИУ
        </NavLink>
      </h1>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/courses"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Курсы
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/statistics"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Статистика
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
