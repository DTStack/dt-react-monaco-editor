<h1 align='center'> 更新日志 </h1>

当前文件只包含 `1.x` 及以上版本的更新日志，因为在 `1.x` 版本`dt-react-monaco-editor` 进行了大范围重构，随之而来的是许多破坏性变更。

去 [CHANGELOG.md](./CHANGELOG.md) 查看更多更新日志。

<br/>

## 1.0.1

`2023-7-13`

-   🐞 修复 当 `MonacoEditor` 组件开启 `sync` 选项时，更新 `value` 的值会导致编辑器内部的内容被自动选中的问题。 ([760c51a](https://github.com/DTStack/dt-react-monaco-editor/commit/760c51a58fcc11f34ba2f6179e35b88d2f80a805),[195bcea](https://github.com/DTStack/dt-react-monaco-editor/commit/195bcea292a177b35c0cd0701d6fe9654a2b3003))

<br/>

## 1.0.0-beta.x

`2023-06-14`

#### 主要变更

-   🗑 移除内置的自定义 languages 相关功能，包括：
    -   `dtsql`
    -   `dtflink`
    -   `dtPython2`
    -   `dtPython3`
    -   `dtlog`
-   🗑 移除所有与自动补全和语法解析相关的 `utils`。
-   🛠 不再默认导出 `Editor` 组件，取而代之的是命名导出 `MonacoEditor` 和 `MonacoDiffEditor` 组件。

#### MonacoEditor 组件（原默认导出组件）主要变更

-   🗑 移除所有与自动补全和语法解析相关的属性。
-   🗑 移除组件的 `isLog` 属性。
-   🗑 移除 `cursorPosition` 属性。
-   🛠 内置 dom container 的 `className` 从 `code-editor` 变更为 `react-monaco-editor-container`。
-   🐞 修复 当 `sync` 属性为 `true` 时，`value` 的更新会触发 `onChange` 事件回调的 bug， 在 `1.x` 版本中，开启了 sync 标识后，组件即变成受控状态，并且支持撤销操作。

#### MonacoDiffEditor（原 DiffEditor 组件）主要变更

-   🛠 `original` 属性类型变更为 `string`，对应 originalEditor 的 `value`。
-   🛠 `modified` 属性更名为 `value`, 其类型变更为 `string`，对应 modifiedEditor 的 `value`。
-   🗑 移除 `editorInstanceRef` 属性，仍可以使用 `diffEditorInstanceRef` 对应的 ref 获取到对应的 `originEditor` 和 `modifiedEditor`。
-   🗑 移除组件顶部显示的 _当前版本_ 和 _历史版本_ title。
-   🗑 移除 `onBlur`、`onFocus`、`onCursorSelection`，但仍然支持 `onChange`。
-   🆕 新增 `readOnly` 属性，控制 `modifiedEditor` 是否为只读模式。
-   🛠 内置 dom container 的 `className` 从 `code-editor` 变更为 `react-monaco-diff-editor-container`。
-   🗑 不再在组件挂载时动态改变 `theme`。

<br/>

## 如何继续使用 0.x 版本支持的 languages 功能？

使用 [monaco-sql-languages](https://github.com/DTStack/monaco-sql-languages)。

在 `0.x` 版本，`dt-react-monaco-editor` 内置了一些自定义的 `languages`，但是由于 `MonacoEditor` language 功能注册方式限制，当项目中引入 `dt-react-monaco-editor` 时，总是间接的引入了 `dt-react-monaco-editor` 内置的所有 languages，即使其中某些 languages 功能是项目不需要的。并且没有被使用的 languages 功能无法被打包工具 treeShaking，这毫无疑问增加了项目的打包体积。

所以在 `1.x` 版本，`dt-react-monaco-editor` 移除了所有内置的 `languages` 功能，这对于 `dt-react-monaco-editor` 来说实际上是一种解耦操作。开发者仍然可以通过引入 [monaco-sql-languages](https://github.com/DTStack/monaco-sql-languages)，来使用多种 sql languages 的**高亮、自动错误提示以及自动补全功能**。另外 [monaco-sql-languages](https://github.com/DTStack/monaco-sql-languages) 支持按需引入，因此不再需要担心在 `0.x` 版本中遇到的问题。
