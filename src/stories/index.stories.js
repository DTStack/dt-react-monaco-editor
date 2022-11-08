import React from 'react';
import { storiesOf } from '@storybook/react';
import { FaGithub } from 'react-icons/fa';
// import MarkdownRender from 'dt-react-component/lib/markdownRender';
import { Table } from 'antd';
import OnlineDemo from './components/onlineDemo';

// const readmeHtml = require('../../README.md');
const { name, repository, version } = require('../../package.json');
const stories = storiesOf('Dt React Monaco Editor', module)
const dataSource = [
    {
        property: 'value',
        description: '初始填入的value数据（受控）',
        propType: 'string',
        defaultValue: ''
    },
    {
        property: 'language',
        description: '编辑器语言种类(具体可直接在线体验)',
        propType: 'string',
        defaultValue: 'sql'
    },
    {
        property: 'theme',
        description: '编辑器主题',
        propType: 'string',
        defaultValue: 'white'
    },
    {
        property: 'options',
        description: '配置项',
        propType: 'json',
        defaultValue: (<a
            href="https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.idiffeditorconstructionoptions.html"
            target="_blank"
            rel="noopener noreferrer"
        >
            详细配置请查看monaco-editor官网，该属性继承原编辑器对应属性全部api
        </a>)
    },
    {
        property: 'sync',
        description: '是否同步源文件内容',
        propType: 'boolean',
        defaultValue: 'false'
    },
    {
        property: 'isLog',
        description: '是否打印编辑器日志',
        propType: 'boolean',
        defaultValue: 'false'
    },
    {
        property: 'editorInstanceRef',
        description: '修改源文件Editor的引用',
        propType: 'function',
        defaultValue: '-'
    },
    {
        property: 'original',
        description: '源文件的属性对象',
        propType: 'json',
        defaultValue: '格式为:{ value: string,cursorPosition?: object },其中value为文件内容（必传）,cursorPosition为文件的指针位置(非必传)'
    },
    {
        property: 'modified',
        description: '被对比文件的属性对象',
        propType: 'json',
        defaultValue: '格式为:{ value: string },其中value为文件内容（必传)'
    },
    {
        property: 'onChange',
        description: '源文件改变事件回调函数',
        propType: 'function',
        defaultValue: '-'
    },
    {
        property: 'onBlur',
        description: '源文件失去焦点回调函数',
        propType: 'function',
        defaultValue: '-'
    },
    {
        property: 'onFocus',
        description: '源文件获得焦点回调函数',
        propType: 'function',
        defaultValue: '-'
    },
    {
        property: 'onCursorSelection',
        description: '文件指针改变事件回调函数',
        propType: 'function',
        defaultValue: '-'
    }
];
const columns = [
    {
        title: '参数',
        dataIndex: 'property',
        key: 'property',
        width: 200
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description'
    },
    {
        title: '类型',
        dataIndex: 'propType',
        key: 'propType',
        width: 80
    },
    {
        title: '默认值',
        dataIndex: 'defaultValue',
        key: 'defaultValue'
    }
];
stories
    .add('介绍', () => (
        <article style={{ marginLeft: 40 }}>
            <h1>
                <span>{name}</span>
                <a href={repository.url} rel="noopener noreferrer" target='_blank'>
                    <FaGithub/>
                </a>
            </h1>
            <h2>当前版本</h2>
            <p >v{version}</p>
            <h2>概述</h2>
            <p >
                dt-react-monaco-editor是基于monaco-editor做的一款编辑器组件，完美继承monaco-editor，在此基础上进行了业务封装和代码优化，主要用于目前公司有关编辑器场景的应用使用。
            </p>
            <h2>FAQ</h2>
            <p>使用过程中如有问题欢迎沟通～～</p>
        </article>
    ), {
        info: {
            TableComponent: () => (<></>),
            text: ``
        }
    })
    // MarkdownRender 组件暂时不支持表格
    // .add(`快速上手`, () => {
    //     return (
    //         <div style={{ marginLeft: 40 }}>
    //             <MarkdownRender
    //                 text={`${readmeHtml && readmeHtml.default}`}
    //                 dark={false}
    //             />
    //         </div>
    //     )
    // })
    .add('在线演示 & 文档', () => {
        return (
            <div style={{ marginLeft: 40 }}>
                <h2>何时使用</h2>
                <p>页面需使用编辑器时</p>
                <h2>示例</h2>
                <p>基础用法</p>
                <OnlineDemo />
            </div>
        )
    }, {
        info: {
            TableComponent: () => (
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    rowKey="property"
                />),
            text: `
            代码示例：
            ~~~js
            <Editor
                value=‘// 初始注释’
                language="dtPython"
                options={{ readOnly: false }}
            />
            ~~~
            `
        }
    })
