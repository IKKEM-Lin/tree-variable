import MonacoEditor, {
  loader,
  DiffEditor,
} from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';

loader.config({ monaco });

import { JSONSchema7 } from 'json-schema';
import classes from './Editor.module.css';

type EditorProps = {
  code: string;
  schema?: JSONSchema7 | string;
  onChange: (newCode: string, validated: boolean) => void;
  diffView?: boolean;
  isDark?: boolean;
  language?: 'json';
  // onClose: () => void;
};

const monacoEditorOptions: editor.IStandaloneEditorConstructionOptions = {
  // minimap: {
  //   enabled: false,
  // },
  automaticLayout: true,
  scrollBeyondLastLine: false,
};

export function Editor({
  code,
  onChange,
  diffView,
  isDark,
  language,
}: EditorProps) {
  const [editorVal, setEditorVal] = useState<string>(code);
  const [markers, setMarkers] = useState<editor.IMarker[]>([]);
  // const _schema = typeof schema === "string" ? parseStr2JSON(schema) : schema;
  // const monacoEl = useMonaco();
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const [mountDone, setMountDone] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.KeyS, function () {
      editor?.trigger('keyboard', 'editor.action.triggerSuggest', {});
    });
  }, [editorRef, mountDone]);

  useEffect(() => {
    // console.log({ editorRef }, editorRef.current?.getModel());
    editorRef.current?.createDecorationsCollection([]);
    onChange && onChange(editorVal, markers.length === 0);
    // monacoEl?.Range;
  }, [editorVal, markers]);

  return (
    <div className={classes.editorWrapper}>
      <div
        style={{
          position: 'relative',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{ height: '100%' }}
          className={(diffView && classes.hidden) || undefined}
        >
          <MonacoEditor
            language={language}
            // path={String(modelUri)}
            value={editorVal}
            theme={isDark ? 'vs-dark' : 'vs-light'}
            onChange={(newCode) => {
              setEditorVal(newCode || '');
            }}
            height={`100%`}
            options={monacoEditorOptions}
            onValidate={(marks) => {
              setMarkers(marks);
            }}
            onMount={(editor) => {
              editorRef.current = editor;
              setMountDone(true);
            }}
          />
        </div>
        {diffView && (
          <div
            style={{ height: '100%' }}
            className={(isDark && classes.darkBackgound) || undefined}
          >
            <DiffEditor
              language={language}
              original={code}
              modified={editorVal}
              theme={isDark ? 'vs-dark' : 'vs-light'}
              height={`100%`}
              options={{
                ...monacoEditorOptions,
                originalEditable: false,
                renderSideBySide: false,
                readOnly: true,
              }}
            />
          </div>
        )}
      </div>
      {/* <div
          className={`${classes.validate} ${isDark && classes.validateDark}`}
        >
          {markers.map((marker) => {
            const { message, startColumn, startLineNumber } = marker;
            const errorRange = `[Ln ${startLineNumber}, Col ${startColumn}]`;
            return (
              <div key={errorRange + message}>
                {message} {errorRange}
              </div>
            );
          })}
        </div> */}
    </div>
  );
}
