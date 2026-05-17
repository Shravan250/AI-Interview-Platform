import { useState } from "react";
import Editor from "@monaco-editor/react";

type EditorState = {
  code: string;
  language: "javascript" | "python" | "java";
  isRunning: boolean;
  output: string;
  errors: string;
};

type CodeEditorProps = {
  language: "javascript" | "python" | "java";
  onRun: (code: string) => Promise<{ output?: string; error?: string }>;
  onSubmit: (code: string) => void;
};

export default function CodeEditor({
  language,
  onRun,
  onSubmit,
}: CodeEditorProps) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setErrors("");
    setOutput("");

    const res = await onRun(code);
    setIsRunning(false);

    if (res.error) setErrors(res.error);
    else setOutput(res.output ?? "");
  };

  return (
    <div className="editor-container">
      <Editor
        height="400px"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
      />

      <div className="controls">
        <button onClick={handleRun} disabled={isRunning}>
          Run
        </button>
        <button onClick={() => onSubmit(code)}>Submit</button>
      </div>

      {errors && <pre className="error">{errors}</pre>}
      {output && <pre className="output">{output}</pre>}
    </div>
  );
}
