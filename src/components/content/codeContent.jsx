import "prismjs/themes/prism.css";
import "../../styles/content/codeContent.css";
import ReactMarkdown from "react-markdown";

const CodeContent = ({ language, code, explanation }) => {
  // Извлекаем нужные поля

  return (
    <div className="code-block">
      <div className="language">
        <strong>Язык:</strong> {language}
      </div>

      {/* Отображаем код (Markdown) */}
      <div className="code">
        <ReactMarkdown>{code}</ReactMarkdown>
      </div>

      {/* Отображаем объяснение */}
      <div className="explanation">
        <strong>Объяснение:</strong> {explanation}
      </div>
    </div>
  );
};

export default CodeContent;
