import { Link } from "react-router-dom";
import "../styles/modules.css";
const Modules = ({ index }) => {
  return (
    <div className="modules">
      <ul>
        <li>
          <Link to={`/module/${index}/theory`}>Теория📚</Link>
        </li>
        <li>
          <Link to={`/module/${index}/practice`}>Практика📝</Link>
        </li>
      </ul>
    </div>
  );
};

export default Modules;
