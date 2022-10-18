## :house: 简述
基于开源 monaco-editor，根据业务使用场景进行二次封装，极大的降低了使用成本，使编辑器部分代码可控性更高。
#### 功能
+ 除了 monaco-editor 自带的 language 外，还支持多种自定义的 language，如下表

| language     | 描述                    | 关键字自动补全 | 语法错误提示  | 语法高亮    | 
| :---         |    :----:              |  :---:       | :---:       |----:       | 
| dtsql        | 通用的 sql language     | yes ✅       | yes ✅      | yes ✅     |  
| dtflink      | flink sql language     | yes ✅       | yes ✅      | yes ✅     |  
| dtPython2    | python2 language       | yes ✅       | yes ✅      | yes ✅     |  
| dtPython3    | python3 language       | yes ✅       | yes ✅      | yes ✅     |  
| dtGreenplum  | greenplum sql language | yes ✅       | no ❌       | yes ✅     |  

+ 支持通过 props 传递的方式自定义**自动补全项**和**需要高亮的关键字**

<br/>

## :eyes: 在线预览
https://DTStack.github.io/dt-react-monaco-editor/

<br/>

## :zap: 安装
使用 npm
```bash
npm i dt-react-monaco-editor --save
```
使用 yarn
```bash
yarn dt-react-monaco-editor --save
```
使用 pnpm
```bash
pnpm install dt-react-monaco-editor --save
```

<br/>

## :book: 如何使用
#### 安装 monaco-editor-webpack-plugin
```bash
pnpm install monaco-editor-webpack-plugin
```
如果使用 monaco-editor-webpack-plugin 打包，那么还需要安装
```bash
pnpm install monaco-editor
```

#### webpack 配置部分
```js
const monacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin')
module.exports = {
    module: {
        rules: [
            // 打包 dt-react-monaco-editor 自定义语言的 worker 文件
            {
                test: /\.worker.[jt]s$/,
                include: (input: string) => {
                    return input.includes('dt-react-monaco-editor/lib/languages')
                }
                loader: 'worker-loader',
            },
        ]
    },
    plugins: [
        // 打包 monaco-editor 自带的 worker 文件并且自动注入 monaco 所需的环境变量
        new monacoEditorWebpackPlugin({
            features: [...],
            languages: [...],
        }),
    ]
}
```
monaco-editor-webpack-plugin 详细配置请看官方文档 [monaco-editor-webpack-plugin](https://github.com/microsoft/monaco-editor/tree/main/webpack-plugin)

#### 使用示例
```js
    import { Editor } from 'dt-react-monaco-editor'
    <Editor
        value='select * from table_name'
        language="dtsql"
        options={{ readOnly: false }}
    />
```

<br/>

## 依赖版本对照表
| dt-react-monaco-editor | monaco-editor  | monaco-editor-webpack-plugin | webpack |
| :---                   |    :----:      |  :---:                       |   ---:  | 
| <=0.1.4                |    0.13.1      |   1.4.0                      | <=4.x   |
| >=0.3.0                |    0.30.1      |   6.0.0                      | 5.x     |

<br/>


## :wrench: 本地开发
#### clone & install dependencies
```bash
git clone 
pnpm install
```
#### 启动本地服务器
```bash
pnpm storybook
```

#### 静态服务部署构建
```bash
pnpm build-storybook
```

<br/>

## :blue_book: 相关资料
* [Monaco Editor](https://microsoft.github.io/monaco-editor/)
* [Storybook](https://storybook.js.org/)




