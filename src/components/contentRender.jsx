import TextContent from "./content/textContent";
import MermaidContent from "./content/mermaidContent";
import QuizContent from "./content/quizContent";
import CodeContent from "./content/codeContent";

const ContentRenderer = ({ content }) => {
  switch (content.type) {
    case "text":
      return <TextContent content={content} />;
    case "mermaid":
      return <MermaidContent content={content} />;
    case "quiz":
      return <QuizContent content={content} />;
    case "code":
      return <CodeContent content={content} />;
    default:
      return <></>;
  }
};

export default ContentRenderer;
