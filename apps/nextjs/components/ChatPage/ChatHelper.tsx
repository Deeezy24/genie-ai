import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Check, Copy, Download, FileText, Sparkles } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Message, User } from "@/lib/types";

interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
}

const ChatHelper = () => {
  const formatPastedText = useCallback(
    (text: string) =>
      text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s*\n\s*\n+/g, "\n\n")
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
        .replace(/^\n+|\n+$/g, ""),
    [],
  );

  // Enhanced language detection
  const detectLanguage = (code: string): string => {
    const patterns = {
      javascript: /(?:function|const|let|var|=>|\.js|import|export|console\.log)/i,
      typescript: /(?:interface|type|\.ts|: string|: number|: boolean)/i,
      python: /(?:def |import |from |\.py|print\(|if __name__|class )/i,
      java: /(?:public class|private|protected|\.java|System\.out)/i,
      cpp: /(?:#include|std::|cout|cin|\.cpp|\.h)/i,
      csharp: /(?:using System|public class|\.cs|Console\.WriteLine)/i,
      php: /(?:<\?php|\$[a-zA-Z]|echo |\.php)/i,
      ruby: /(?:def |end|\.rb|puts |require)/i,
      go: /(?:package |func |import \(|\.go|fmt\.)/i,
      rust: /(?:fn |let mut|\.rs|println!|use std)/i,
      sql: /(?:SELECT|INSERT|UPDATE|DELETE|CREATE TABLE|FROM|WHERE)/i,
      html: /(?:<html|<div|<span|<p>|<!DOCTYPE)/i,
      css: /(?:\{[^}]*\}|\.class|#id|@media|padding:|margin:)/i,
      json: /^\s*[{[][\s\S]*[}\]]\s*$/,
      xml: /(?:<\?xml|<[a-zA-Z][^>]*>)/,
      yaml: /^\s*[a-zA-Z_][a-zA-Z0-9_]*:\s*[^\n]*$/m,
      bash: /(?:^#!\/bin\/(?:bash|sh)|[$](?:\(|\{)|grep|awk|sed)/i,
      powershell: /(?:Get-|Set-|New-|Remove-|\$_|\.ps1)/i,
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(code)) return lang;
    }

    return "text";
  };

  const extractFilename = (code: string, language: string): string | undefined => {
    const filenamePatterns = [
      /\/\/ @filename: ([^\n]+)/,
      /# @filename: ([^\n]+)/,
      /<!-- @filename: ([^\n]+) -->/,
      /\/\* @filename: ([^\n]+) \*\//,
    ];

    for (const pattern of filenamePatterns) {
      const match = code.match(pattern);
      if (match && match[1]) return match[1].trim();
    }

    const extensions = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      csharp: "cs",
      php: "php",
      ruby: "rb",
      go: "go",
      rust: "rs",
      html: "html",
      css: "css",
      json: "json",
      xml: "xml",
      yaml: "yml",
      bash: "sh",
      powershell: "ps1",
      sql: "sql",
    };

    const ext = extensions[language as keyof typeof extensions] || "txt";
    return `untitled.${ext}`;
  };

  const parseCodeBlocks = (message: string): { text: string; codeBlocks: CodeBlock[] } => {
    const codeBlocks: CodeBlock[] = [];
    let text = message;

    const fencedCodeRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    let match: RegExpExecArray | null = null;
    let blockIndex = 0;

    // biome-ignore lint/suspicious/noAssignInExpressions:  expression
    while ((match = fencedCodeRegex.exec(message)) !== null) {
      const language = match[1] || detectLanguage(match[2] ?? "");
      const code = match[2]?.trim() ?? "";
      const filename = extractFilename(code, language);

      codeBlocks.push({ language, code, filename });
      text = text.replace(match[0], `__CODE_BLOCK_${blockIndex}__`);
      blockIndex++;
    }

    // Extract inline code that looks like a code block
    if (codeBlocks.length === 0) {
      const lines = message.split("\n");
      const potentialCode = lines.filter(
        (line) =>
          line.match(/^\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*[=:(]/) ||
          line.match(/^\s*(function|const|let|var|def|class|import|from|#include)/),
      );

      if (potentialCode.length > 2) {
        const code = message.trim();
        const language = detectLanguage(code);
        const filename = extractFilename(code, language);

        codeBlocks.push({ language, code, filename });
        text = `__CODE_BLOCK_0__`;
      }
    }

    return { text, codeBlocks };
  };

  const CodeBlockIDE = useCallback(
    ({ codeBlock, index }: { codeBlock: CodeBlock; index: number }) => {
      const [copied, setCopied] = useState(false);
      const [isExpanded, setIsExpanded] = useState(true);
      const codeRef = useRef<HTMLPreElement>(null);

      const handleCopy = async () => {
        await navigator.clipboard.writeText(codeBlock.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };

      const handleDownload = () => {
        const blob = new Blob([codeBlock.code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = codeBlock.filename || `code-block-${index + 1}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      };

      const getLanguageIcon = () => {
        const icons = {
          javascript: "🟨",
          typescript: "🔷",
          python: "🐍",
          java: "☕",
          cpp: "⚡",
          csharp: "🔷",
          php: "🐘",
          ruby: "💎",
          go: "🐹",
          rust: "🦀",
          html: "🌐",
          css: "🎨",
          json: "📄",
          sql: "🗃️",
          bash: "💻",
          powershell: "💙",
        };
        return icons[codeBlock.language as keyof typeof icons] || "📝";
      };

      const lineCount = codeBlock.code.split("\n").length;

      return (
        <div className=" border border-gray-700 rounded-lg overflow-hidden my-4">
          <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getLanguageIcon()}</span>
              <span className="text-sm text-gray-300 font-mono">
                {codeBlock.filename || `${codeBlock.language}.${codeBlock.language}`}
              </span>
              <span className="text-xs text-gray-500">
                {lineCount} line{lineCount !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <FileText className="w-3 h-3" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownload}
                className="h-6 w-6 p-0 text-gray-400 hover:text-blue-400"
                title="Download file"
              >
                <Download className="w-3 h-3" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                title="Copy code"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          </div>

          {/* Code Content */}
          {isExpanded && (
            <div className="relative">
              <pre
                ref={codeRef}
                className="text-sm p-4 overflow-x-auto bg-[#1e1e1e] text-gray-300 font-mono leading-relaxed"
                style={{ tabSize: 2 }}
              >
                <code className="language-${codeBlock.language}">
                  {codeBlock.code.split("\n").map((line, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: just a key
                    <div key={i} className="flex">
                      <span className="select-none text-gray-600 mr-4 text-right w-8 flex-shrink-0">{i + 1}</span>
                      <span className="flex-1">{line || " "}</span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          )}
        </div>
      );
    },
    [parseCodeBlocks],
  );

  const formatMessageForDisplay = useCallback(
    (message: string) => {
      if (!message) return "";

      const { text, codeBlocks } = parseCodeBlocks(message);
      const paragraphs = text.split(/\n\s*\n/);

      return paragraphs.map((paragraph, index) => {
        const codeBlockMatch = paragraph.match(/^__CODE_BLOCK_(\d+)__$/);
        if (codeBlockMatch) {
          const blockIndex = parseInt(codeBlockMatch[1] ?? "0");
          const codeBlock = codeBlocks[blockIndex];
          if (codeBlock) {
            // biome-ignore lint/suspicious/noArrayIndexKey: just a key
            return <CodeBlockIDE key={`code-${index}`} codeBlock={codeBlock} index={blockIndex} />;
          }
        }

        if (paragraph.match(/^\s*[-*•]\s/m) || paragraph.match(/^\s*\d+\.\s/m)) {
          const items = paragraph.split("\n").filter((line) => line.trim());
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: just a key
            <ul key={index} className="list-disc list-inside my-3 space-y-1">
              {items.map((item, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: just a key
                <li key={i} className="text-gray-200 leading-relaxed">
                  {item.replace(/^\s*[-*•]\s*/, "").replace(/^\s*\d+\.\s*/, "")}
                </li>
              ))}
            </ul>
          );
        }

        const formattedText = paragraph
          // Headline (###)
          .replace(/^### (.+)$/gm, "<h2 class='text-xl font-bold text-white mb-2'>$1</h2>")

          // Subheadline (*** Title ***)
          .replace(/^\*{2} (.+?) \*{2}$/gm, "<h3 class='text-base font-semibold text-gray-300 mb-1'>$1</h3>")

          // Standalone full-line bold (for subheading style)
          .replace(/^\*\*(.+?)\*\*$/gm, "<p class='text-base font-semibold text-gray-100 mb-2'>$1</p>")

          // Bold at beginning of paragraph (like "**Game Structure**: ...")
          .replace(/^(\*\*(.*?)\*\*)(:)/gm, "<strong class='font-semibold text-white'>$2</strong>$3")

          // Regular bold inline
          .replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-white'>$1</strong>")

          // Italic
          .replace(/\*(.*?)\*/g, "<em class='italic text-gray-300'>$1</em>")

          // Inline code
          .replace(
            /`([^`]+)`/g,
            '<code class="bg-gray-800 text-green-300 px-2 py-0.5 rounded text-sm font-mono">$1</code>',
          );

        return (
          <p
            // biome-ignore lint/suspicious/noArrayIndexKey: just a key index
            // biome-ignore lint/suspicious/noArrayIndexKey: just a key index
            key={index}
            className="mb-3 leading-relaxed text-gray-200"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: just a key
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      });
    },
    [parseCodeBlocks],
  );

  const ChatMessage = ({ message, user }: { message: Message; user: User }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      const content = message.workspace_conversation_content;
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const isAgent = message.workspace_conversation_member === "agent";
    const content = message.workspace_conversation_content;

    return (
      <div className="flex gap-4 justify-start items-center mb-6">
        {isAgent ? (
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        ) : (
          <Avatar className="w-7 h-7 sm:w-8 sm:h-8 ring-2 ring-blue-500/20">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback className="bg-blue-600 text-white font-semibold text-xs sm:text-sm">
              {user.fullName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="group relative w-full">
          <div
            className={`${isAgent ? "bg-zinc-900" : "bg-zinc-900"} border text-white p-4 sm:p-5 rounded-xl shadow-lg`}
          >
            <div className="prose prose-invert max-w-none text-[15px] sm:text-base leading-relaxed break-words">
              {formatMessageForDisplay(content)}
            </div>
          </div>

          {/* Copy button: keep it reachable on mobile */}
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 p-2"
            title="Copy message"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </Button>
        </div>
      </div>
    );
  };

  return {
    formatPastedText,
    formatMessageForDisplay,
    ChatMessage,
    parseCodeBlocks,
    detectLanguage,
    extractFilename,
  };
};

export default ChatHelper;
