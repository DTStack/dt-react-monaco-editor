## :house: 简述
基于开源monaco-editor,根据业务使用场景进行二次封装，极大的简化了代码，使编辑器部分代码可控性更高。
## :zap: 安装
> 使用 npm
```plain
npm i dt-react-monaco-editor --save
```
## :book: 如何使用
**直接引入**
```plain
import { Editor } from 'dt-react-monaco-editor/lib'
 <Editor
    value='// 初始注释'
    language="dtsql"
    options={{ readOnly: false }}
/>
```
## :wrench: 本地开发
**clone & npm install**
```plain
git clone 
npm install
```
**启动本地服务器**
```plain
 npm run storybook
```

**静态服务部署构建**
```plain
npm run build-storybook
```

## :blue_book: 相关资料
* [Monaco Editor](https://microsoft.github.io/monaco-editor/)
* [Storybook](https://storybook.js.org/)




