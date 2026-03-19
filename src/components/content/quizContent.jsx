import { useState } from "react";
import ".../styles/quizContent.css";

const QuizContent = ({ content }) => {
  const questions = content.questions || [];
  const [answersVisible, setAnswersVisible] = useState({});

  const toggleAnswer = (index) => {
    setAnswersVisible((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="quiz-block">
      {questions.map(([question, answer], index) => {
        const isVisible = answersVisible[index];
        return (
          <div key={index}>
            <div className="quiz-question">
              {index + 1}. {question}
            </div>
            <div
              className={`quiz-answer ${isVisible ? "" : "hidden-answer"}`}
              id={`answer-${index}`}
            >
              <strong>Ответ:</strong> {answer}
            </div>
            <button
              className="show-answer-btn"
              type="button"
              aria-expanded={isVisible}
              aria-controls={`answer-${index}`}
              onClick={() => toggleAnswer(index)}
            >
              {isVisible ? "Скрыть ответ" : "Показать ответ"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default QuizContent;
