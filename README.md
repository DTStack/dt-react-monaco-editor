## :house: 简述
基于开源 monaco-editor,根据业务使用场景进行二次封装，极大的简化了代码，使编辑器部分代码可控性更高。
## :zap: 安装
> 使用 npm
```bash
    npm i dt-react-monaco-editor --save
```
## :book: 如何使用
**在线预览**

https://DTStack.github.io/dt-react-monaco-editor/

**webpack 配置**
```diff
    1、
        rule.push( {
            test: /\.worker\.[jt]s$/,
            use: { loader: 'worker-loader' }
        })
    2、
        node = {
            fs: 'empty',
            module: "empty",
        };
    3、
        plugins.push(new webpack.ContextReplacementPlugin(
            /monaco-editor(\\|\/)esm(\\|\/)vs(\\|\/)editor(\\|\/)common(\\|\/)services/,
            __dirname
        ))

```
**直接引入**
```js
    import { Editor } from 'dt-react-monaco-editor'
    <Editor
        value='// 初始注释'
        language="dtsql"
        options={{ readOnly: false }}
    />
```
## :wrench: 本地开发
**clone & npm install**
```bash
    git clone 
    npm install
```
**启动本地服务器**
```bash
    npm run storybook
```

**静态服务部署构建**
```bash
    npm run build-storybook
```

## :blue_book: 相关资料
* [Monaco Editor](https://microsoft.github.io/monaco-editor/)
* [Storybook](https://storybook.js.org/)




