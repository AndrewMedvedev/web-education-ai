import "../styles/home.css";
import { Link } from "react-router-dom";

const Home = ({ names }) => {
  return (
    <div className="container">
      <header>
        <h1>Образовательная платформа ТИУ</h1>
      </header>
      <main>
        <ul>
          {names.map((name, index) => (
            <li key={name}>
              <Link to={`/module/${index}`}>{name}</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Home;
