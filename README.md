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

## :postbox: 版本发布

**组件发布至 npm**
**在按照一些列组件开发规范流程下，测试组件无问题后进行组件发布**

```bash
# output to lib
npm run compile
# Publish to registry
npm publish
```
```bash
# 默认分支为 master , 发布为此版本更新
$ npm run release

#【自定义】版本发布名称为 v1.0.0-test
$ npm run release -- -r v1.0.0-test

# 指定升级版本为【次】版本号
$ npm run release -- -r minor

# 指定升级版本为【主】版本号
$ npm run release -- -r major

# 指定升级版本为【修订】版本号
$ npm run release -- -r patch

# 指定发布分支
$ npm run release -- -b branchName

# 指定发布分支以及发布名称
$ npm run release -- -b branchName -r versionName

```


## :blue_book: 相关资料
* [Monaco Editor](https://microsoft.github.io/monaco-editor/)
* [Storybook](https://storybook.js.org/)
* [netlify](https://www.netlify.com/)
* [jest](https://jestjs.io/)
* [enzymejs](https://enzymejs.github.io/enzyme/)




