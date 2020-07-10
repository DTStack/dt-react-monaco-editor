## :house: 简述
基于开源monaco-editor,根据业务使用场景进行二次封装，极大的简化了代码，使编辑器部分代码可控性更高。
## :zap: 安装
> 使用 npm
```plain
npm i dt-react-monaco-editor --save
```
## :book: 如何使用
**直接引入l**
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
git clone ssh://git@gitlab.prod.dtstack.cn:10022/dt-insight-front/infrastructure/dt-react-monaco-editor.git
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
**组件发布至 npm**
**在按照一些列组件开发规范流程下，测试组件无问题后进行组件发布**

```plain
npm run compile 输出 lib 目录
登陆 npm 执行 npm publish
```
这里使用 netlify 托管 storybook 静态服务
netlify 服务器检测到 push master 操作会自动执行 npm run build-storybook，生成最新的静态资源重新部署，可在 [https://dtux.netlify.com/](https://dtux.netlify.com/) 查看效果

## :blue_book: 相关资料
* [Monaco Editor](https://microsoft.github.io/monaco-editor/)
* [Storybook](https://storybook.js.org/)
* [netlify](https://www.netlify.com/)
* [jest](https://jestjs.io/)
* [enzymejs](https://enzymejs.github.io/enzyme/)




