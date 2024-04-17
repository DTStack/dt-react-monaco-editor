<h1 align="center">dt-react-monaco-editor</h1>

<div align="center">
    
[Monaco Editor](https://github.com/Microsoft/monaco-editor) React Components

[![NPM version][npm-image]][npm-url] [![NPM downloads][download-img]][download-url]

[npm-image]: https://img.shields.io/npm/v/dt-react-monaco-editor.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/dt-react-monaco-editor
[download-img]: https://img.shields.io/npm/dm/dt-react-monaco-editor.svg?style=flat
[download-url]: https://www.npmjs.com/package/dt-react-monaco-editor

English | [简体中文](./README.zh-CN.md)

</div>

## Introduction

Provides `MonacoEditor` and `MonacoDiffEditor` component, make it easier to use Monaco Editor in React.

<br/>

## Installation

use npm

```shell
npm install dt-react-monaco-editor
```

or use yarn

```shell
yarn add dt-react-monaco-editor
```

or use pnpm

```shell
pnpm install dt-react-monaco-editor
```

<br/>

## Integrating

See [Monaco Editor integrate Docs](https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md).

<br/>

## Usage

### MonacoEditor Component

```jsx
import { MonacoEditor } from 'dt-react-monaco-editor';

function App() {
    const editorRef = useRef();
    return (
        <MonacoEditor
            value=""
            language="javascript"
            style={{ height: 400, width: 600 }}
            onChange={(value) => {
                console.log(value);
            }}
            editorDidMount={(ins) => (editorRef.current = ins)}
        />
    );
}
```

### MonacoDiffEditor Component

```jsx
import { MonacoDiffEditor } from 'dt-react-monaco-editor';

function App() {
    const editorRef = useRef();
    return (
        <MonacoDiffEditor
            original="const a = 1;"
            value="const a = 2;"
            language="sql"
            style={{ height: 400, width: 1200 }}
            onChange={(value) => {
                console.log(value);
            }}
            editorDidMount={(ins) => (editorRef.current = ins)}
        />
    );
}
```

<br/>

## Properties

### Common Properties

common properties can be used on `MonacoEditor` and `MonacoDiffEditor`.

-   `theme` theme used when the editor renders, defaults to `vs`.
-   `language` language of model in editor, defaults to `sql`.
-   `sync` sync value to model when value change, if sync property is true, the editor is controlled, defaults to `false`.
-   `onChange` an event emitted when the value of the editor model has changed.

### MonacoEditor Own Properties

-   `value` value of model in editor.
-   `options` options for monaco editor, refer to monaco interface [IStandaloneEditorConstructionOptions](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html).
-   **[deprecated]** `editorInstanceRef` get editor instance.
-   `onCursorSelection` an event emitted when the selection of the editor model has changed.
-   `onFocus` an event emitted when the editor is in focus.
-   `onBlur` an event emitted when the editor is out of focus.
-   `editorWillMount` called immediately before the editor is mounted (similar to componentWillMount of React).
-   `editorDidMount` called immediately after the editor is mounted (similar to componentDidMount of React).
-   `editorWillUnMount` called immediately before the editor is destroyed (similar to componentWillUnmount of React).

### MonacoDiffEditor Own Properties

-   `value` value of model in modifiedEditor.
-   `original` value of model in originalEditor.
-   `options` options for monaco diff editor, refer to monaco interface [IStandaloneDiffEditorConstructionOptions](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneDiffEditorConstructionOptions.html).
-   **[deprecated]** `diffEditorInstanceRef` get diff editor instance.
-   `editorWillMount` called immediately before the editor is mounted (similar to componentWillMount of React).
-   `editorDidMount` called immediately after the editor is mounted (similar to componentDidMount of React).
-   `editorWillUnMount` called immediately before the editor is destroyed (similar to componentWillUnmount of React).

<br/>

## Support more sql languages

Please see [monaco-sql-languages](https://github.com/DTStack/monaco-sql-languages).

`monaco-sql-languages` provides **highlighting**, **error prompts** and **auto-completion** functions for many kinds of SQL Languages for BigData domain. It supports on-demand import and is easy to integrate.

<br/>

## CHANGELOG

-   [changelog for zh-CN](./CHANGELOG.zh-CN.md)
-   [changelog base on commits](./CHANGELOG.md)
