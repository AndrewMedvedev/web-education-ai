import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import "../../styles/content/mermaidContent.css";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  securityLevel: "loose",
});

// Функция для безопасного экранирования названий subgraph
function fixSubgraphTitles(code) {
  const lines = code.split("\n");
  const result = [];

  for (let line of lines) {
    const indent = line.match(/^\s*/)[0]; // сохраняем исходные отступы
    const trimmed = line.trim();

    // Обрабатываем только строки, начинающиеся с subgraph (без учёта регистра)
    if (trimmed.toLowerCase().startsWith("subgraph")) {
      // Извлекаем часть после "subgraph"
      const rest = trimmed.substring(8).trim(); // 8 = длина "subgraph"

      if (rest) {
        // Если название уже в кавычках или используется синтаксис с id [title] – оставляем как есть
        if (
          rest.startsWith('"') ||
          rest.startsWith("'") ||
          (rest.includes("[") && rest.includes("]"))
        ) {
          result.push(line);
        } else {
          // Иначе оборачиваем название в кавычки, сохраняя возможный комментарий в конце
          const commentMatch = rest.match(/(.+?)(\s+%%[^$]*)?$/);
          if (commentMatch) {
            const titlePart = commentMatch[1].trim();
            const commentPart = commentMatch[2] || "";
            result.push(`${indent}subgraph "${titlePart}"${commentPart}`);
          } else {
            result.push(`${indent}subgraph "${rest}"`);
          }
        }
      } else {
        // Пустой subgraph – оставляем без изменений
        result.push(line);
      }
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

function sanitizeMermaid(code) {
  if (!code || typeof code !== "string") return "";

  let clean = code;

  // 1. Удаляем markdown ```mermaid ```
  clean = clean
    .replace(/^```[\s]*mermaid[\s]*\n?/i, "")
    .replace(/```[\s]*$/i, "");

  // 2. Нормализуем переносы строк
  clean = clean.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

  // 3. Удаляем %%{init}%% и подобные директивы
  clean = clean.replace(/^%%\{[\s\S]*?\}%%\s*\n?/gm, "");

  // 4. Определяем тип диаграммы
  const firstLine = clean.split("\n")[0].trim().toLowerCase();

  const isTimeline = firstLine.startsWith("timeline");
  const isSequence = firstLine.startsWith("sequencediagram");
  const isGantt = firstLine.startsWith("gantt");
  const isGraph =
    firstLine.startsWith("graph") ||
    firstLine.startsWith("flowchart") ||
    firstLine.startsWith("diagram");

  // 5. Фикс для diagram -> graph
  if (firstLine.startsWith("diagram")) {
    clean = clean.replace(/^diagram\s*(\w+)?/i, (_, dir) => {
      return `graph ${dir || "TD"}`;
    });
  }

  // 6. 🔥 FIX для timeline (главная причина падения)
  if (isTimeline) {
    const lines = clean.split("\n");

    let currentSection = null;
    let lastEvent = null;

    const result = [];

    for (let rawLine of lines) {
      const line = rawLine.trim();

      if (!line) continue;

      // timeline / title — оставляем
      if (line.startsWith("timeline") || line.startsWith("title")) {
        result.push(line);
        continue;
      }

      // 🔥 FIX: section с ":" ломает Mermaid
      if (line.startsWith("section")) {
        const sectionMatch = line.match(/^section\s+([^:]+)(?::\s*(.+))?/i);

        if (sectionMatch) {
          const sectionName = sectionMatch[1].trim();
          const inlineEvent = sectionMatch[2];

          result.push(`section ${sectionName}`);
          currentSection = sectionName;
          lastEvent = null;

          // если было "section X : текст" → превращаем в событие
          if (inlineEvent) {
            const eventName = inlineEvent.slice(0, 30); // безопасное имя
            result.push(`  ${eventName} : ${inlineEvent}`);
            lastEvent = eventName;
          }

          continue;
        }
      }

      // строки вида ": текст"
      if (line.startsWith(":")) {
        if (lastEvent) {
          result.push(`  ${lastEvent} ${line}`);
        }
        continue;
      }

      // нормальное событие
      if (line.includes(":")) {
        const [event, desc] = line.split(":");
        const eventName = event.trim() || "Событие";

        result.push(`  ${eventName} : ${desc.trim()}`);
        lastEvent = eventName;
        continue;
      }

      // если просто текст — превращаем в событие
      const fallbackEvent = line.slice(0, 30);
      result.push(`  ${fallbackEvent} : ${line}`);
      lastEvent = fallbackEvent;
    }

    return result.join("\n").trim();
  }

  // 7. 🚨 НЕ трогаем сложные типы
  if (isSequence || isGantt) {
    return clean.trim();
  }

  // 8. Обработка graph / flowchart
  if (isGraph) {
    // Экранируем специальные символы внутри квадратных скобок [ ... ]
    clean = clean.replace(/\[([^\]]+)\]/g, (match, text) => {
      if (/&#\d+;/.test(text)) return match;

      const escaped = text
        .replace(/\(/g, "&#40;")
        .replace(/\)/g, "&#41;")
        .replace(/\[/g, "&#91;")
        .replace(/\]/g, "&#93;")
        .replace(/\{/g, "&#123;")
        .replace(/\}/g, "&#125;")
        .replace(/#/g, "&#35;")
        .replace(/;/g, "&#59;")
        .replace(/\+/g, "&#43;")
        .replace(/=/g, "&#61;");

      return `[${escaped}]`;
    });

    // Исправляем названия subgraph (добавляем кавычки при необходимости)
    clean = fixSubgraphTitles(clean);

    // Удаляем пустые строки в начале
    clean = clean.replace(/^\s*\n+/, "");

    return clean.trim();
  }

  // 9. fallback
  return clean.trim();
}

const MermaidContent = ({ title, mermaidCode, explanation }) => {
  const containerRef = useRef(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  const cleanMermaid = sanitizeMermaid(mermaidCode?.replace(/\\n/g, "\n"));

  useEffect(() => {
    if (!containerRef.current || !cleanMermaid) return;

    // 🔍 Валидация перед рендером
    try {
      mermaid.parse(cleanMermaid);
    } catch (e) {
      console.error("Mermaid parse error:", e);
      containerRef.current.innerHTML =
        '<p style="color:red;">Ошибка в синтаксисе диаграммы</p>';
      return;
    }

    // 🎨 Рендер
    mermaid
      .render(idRef.current, cleanMermaid)
      .then(({ svg }) => {
        containerRef.current.innerHTML = svg;
      })
      .catch((err) => {
        console.error("Ошибка рендеринга Mermaid:", err);
        containerRef.current.innerHTML =
          '<p style="color:red;">Не удалось отобразить диаграмму</p>';
      });
  }, [cleanMermaid]);

  return (
    <div className="mermaid-content">
      {title && <h3>{title}</h3>}

      <div ref={containerRef} className="mermaid-container" />

      {explanation && <p>{explanation}</p>}
    </div>
  );
};

export default MermaidContent;
