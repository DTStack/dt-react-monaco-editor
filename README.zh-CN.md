<h1 align="center">dt-react-monaco-editor</h1>

<div align="center">
    
[Monaco Editor](https://github.com/Microsoft/monaco-editor) React Components

[![NPM version][npm-image]][npm-url] [![NPM downloads][download-img]][download-url]

[npm-image]: https://img.shields.io/npm/v/dt-react-monaco-editor.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/dt-react-monaco-editor
[download-img]: https://img.shields.io/npm/dm/dt-react-monaco-editor.svg?style=flat
[download-url]: https://www.npmjs.com/package/dt-react-monaco-editor

简体中文 | [English](./README.md)

</div>

## 简介

提供 `MonacoEditor` 组件和 `MonacoDiffEditor` 组件，让在 React 中使用 Monaco Editor 更轻松。

<br/>

## 安装

使用 npm

```shell
npm install dt-react-monaco-editor
```

或者使用 yarn

```shell
yarn add dt-react-monaco-editor
```

或者使用 pnpm

```shell
pnpm install dt-react-monaco-editor
```

<br/>

## 集成

看 [Monaco Editor 官方集成文档](https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md).

<br/>

## 使用

### MonacoEditor 组件

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

### MonacoDiffEditor 组件

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

## 属性

### 公共属性

公共属性在 `MonacoEditor` 和 `MonacoDiffEditor` 上都可以使用。

-   `theme` 编辑器在渲染时应用的主题， 默认是 `vs`。
-   `language` 编辑器的语言类型， 默认是 `sql`。
-   `sync` 当 `value` 属性变化时是否将新的 `value` 同步到编辑器中，如果 `sync` 属性是 `true`，编辑器就是受控的, 默认时 `false`。
-   `onChange` 当编辑器的值变化时，触发这个回调。

### MonacoEditor 属性

-   `value` 编辑器的值。
-   `options` Monaco Editor 的选项， 关联 monaco 接口[IStandaloneEditorConstructionOptions](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneEditorConstructionOptions.html)。
-   **[deprecated]** `editorInstanceRef` 获取 `MonacoEditor` 内部的 editor 实例。
-   `onCursorSelection` 当编辑器选中的内容发生变化时，触发这个回调。
-   `onFocus` 当编辑器聚焦时，触发这个回调。
-   `onBlur` 当编辑器失焦时，触发这个回调。
-   `editorWillMount` 在编辑器即将挂载时调用（类似于 React 的 componentWillMount）。
-   `editorDidMount` 当编辑器挂载完成时调用 （类似于 React 的 componentDidMount）。
-   `editorWillUnMount` 当编辑器即将销毁时调用 （类似于 React 的 componentWillUnmount）。

### MonacoDiffEditor 属性

-   `value` modifiedEditor（右边的编辑器） 的值。
-   `original` originalEditor（左边的编辑器） 的值。
-   `options` Monaco DiffEditor 的选项， 关联 monaco 接口 [IStandaloneDiffEditorConstructionOptions](https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IStandaloneDiffEditorConstructionOptions.html).
-   **[deprecated]** `diffEditorInstanceRef` 获取 `MonacoDiffEditor` 内部的 diffEditor 实例。
-   `editorWillMount` 在编辑器即将挂载时调用（类似于 React 的 componentWillMount）。
-   `editorDidMount` 当编辑器挂载完成时调用 （类似于 React 的 componentDidMount）。
-   `editorWillUnMount` 当编辑器即将销毁时调用 （类似于 React 的 componentWillUnmount）。

<br/>

## 支持更多 SQL 语言功能

请看 [monaco-sql-languages](https://github.com/DTStack/monaco-sql-languages).

`monaco-sql-languages` 为大数据领域的多种 SQL 类型提供了**高亮**、**自动错误提示**以及**自动补全** 功能，它支持**按需引入**并且很**容易集成**。

<br/>

## 更新日志

-   [更新日志](./CHANGELOG.zh-CN.md)
-   [基于提交的更新日志](./CHANGELOG.md)
