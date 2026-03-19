import "../../styles/content/textContent.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TextContent = ({ content }) => {
  return (
    <div className="text-content">
      <ReactMarkdown rehypePlugins={[remarkGfm]}>
        {content.md_content}
      </ReactMarkdown>
    </div>
  );
};

export default TextContent;
