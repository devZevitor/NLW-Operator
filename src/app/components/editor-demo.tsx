"use client";

import * as React from "react";
import { CodeEditor } from "@/components/ui/code-editor";

export function CodeEditorDemo() {
  const [code, setCode] = React.useState(`function greeting(name: string) {
  return \`Hello, \${name}!\`;
}

// Try editing this code!
console.log(greeting("World"));`);

  return (
    <div className="h-[300px]">
      <CodeEditor
        value={code}
        onChange={setCode}
        language="typescript"
        placeholder="Type some code..."
        maxLength={100}
        className="h-full"
        headerRight={
          <span className="font-mono text-xs text-muted-foreground">
            editable.ts
          </span>
        }
      />
    </div>
  );
}
