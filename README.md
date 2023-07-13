<h1 align="center">dt-react-monaco-editor</h1>
<h2 align="center">
    
[Monaco Editor](https://github.com/Microsoft/monaco-editor) React Components

</h2>

## Introduction
Provides `MonacoEditor` and `MonacoDiffEditor` component, make it easier to use Monaco Editor in React.
## Installation
use npm
```bash
npm install dt-react-monaco-editor
```
or use yarn
```bash
yarn add dt-react-monaco-editor
```
or use pnpm
```
pnpm install dt-react-monaco-editor
```

## Integrating
See [Monaco Editor integrate Docs](https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md).

## Usage
### MonacoEditor Component
```jsx
import { MonacoEditor } from 'dt-react-monaco-editor';

function App () {
  const editorRef = useRef();
  return(
    <MonacoEditor
      value=''
      language='javascript'
      style={{ height: 400, width: 600 }}
      onChange={(value) => { console.log(value) }}
      editorInstanceRef={ins => editorRef.current = ins}
    />
  )
}
```

### MonacoDiffEditor Component
```jsx
import { MonacoDiffEditor } from 'dt-react-monaco-editor';

function App () {
  const editorRef = useRef();
  return(
    <MonacoDiffEditor
      original='const a = 1;'
      value='const a = 2;'
      language='sql'
      style={{ height: 400, width: 1200 }}
      onChange={(value) => { console.log(value) }}
      diffEditorInstanceRef={ins => editorRef.current = ins}
    />
  )
}
```

## Properties
### Common Properties
common properties can be used on MonacoEditor and MonacoDiffEditor.
+ `theme` theme used when the editor renders, defaults to `vs`.
+ `language` language of model in editor, defaults to `sql`.
+ `sync` sync value to model when value change, if sync property is true, the editor is controlled.
+ `onChange` an event emitted when the value of the editor model has changed.

### MonacoEditor Own Properties
+ `value` value of model in editor.
+ `options` options for monaco editor, refer to monaco interface [IStandaloneEditorConstructionOptions](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html).
+ `editorInstanceRef` get editor instance.
+ `onCursorSelection` an event emitted when the selection of the editor model has changed.
+ `onFocus` an event emitted when the editor is in focus.
+ `onBlur` an event emitted when the editor is out of focus.

### MonacoDiffEditor Own Properties
+ `value` value of model in modifiedEditor.
+ `original` value of model in originalEditor.
+ `options` options for monaco diff editor, refer to monaco interface [IStandaloneDiffEditorConstructionOptions](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneDiffEditorConstructionOptions.html).
+ `diffEditorInstanceRef` get diff editor instance.
+ `readOnly` set modified editor readonly.

## Support more sql languages
Please See [monaco-sql-languages](https://github.com/DTStack/monaco-sql-languages).

`monaco-sql-languages` provides **highlighting**, **error prompts** and **auto-completion** functions for many kinds of SQL Languages for BigData domain.

<br/>

## CHANGELOG

-   [changelog for zh-CN](./CHANGELOG.zh-CN.md)
-   [changelog base on commits](./CHANGELOG.md)
