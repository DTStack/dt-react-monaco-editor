import * as React from 'react';
// import * as monaco from 'monaco-editor/esm/vs/editor/edcore.main.js';
import * as monaco from 'monaco-editor';

// monaco 当前版本并未集成最新basic-languages， 暂时shell单独引入
import * as dtPython from './languages/dt-python/python.contribution';
import './languages/dtlog/dtlog.contribution';
import './languages/shell/shell.contribution';

import './style.scss';
import '../theme/whiteTheme';
import { defaultOptions } from './config';
import {
    jsonEqual,
    delayFunctionWrap,
    ICompleteProvideFunc,
    IOnSyntaxChange,
} from './utils';

const provideCompletionItemsMap = {
    dtPython2: {
        /**
         * 注册自定义补全函数
         */
        register: dtPython.registerCompleteItemsProvider,
        /**
         * 释放自定义补全函数
         */
        dispose: dtPython.disposeProvider,
        onChange: dtPython.onChange,
    },
    dtPython3: {
        /**
         * 注册自定义补全函数
         */
        register: dtPython.registerCompleteItemsProvider,
        /**
         * 释放自定义补全函数
         */
        dispose: dtPython.disposeProvider,
        onChange: dtPython.onChange,
    },
};

/**
 * monarch language config
 */
export type IMonarchLanguageConf =
    | monaco.languages.IMonarchLanguage
    | PromiseLike<monaco.languages.IMonarchLanguage>;

/**
 * type of editor instance
 */
export type IEditorInstance = monaco.editor.IStandaloneCodeEditor;

/**
 * type of editor options
 */
export type IEditorOptions = monaco.editor.IEditorOptions &
    monaco.editor.IGlobalEditorOptions;

export interface EditorProps {
    /**
     * editor content
     */
    value: string;
    /**
     * className
     */
    className?: string;
    /**
     * style
     */
    style?: React.CSSProperties;
    /**
     * editor 配置项
     */
    options?: IEditorOptions;
    /**
     * editor 主题
     */
    theme?: monaco.editor.BuiltinTheme | 'white';
    /**
     * monaco editor language, default is sql
     */
    language?: string;
    /**
     * editor language config
     */
    languageConfig?: IMonarchLanguageConf;
    /**
     * 获取 editor 实例
     */
    editorInstanceRef?: (editorInstance: IEditorInstance) => any;
    /**
     * 光标当前位置
     */
    cursorPosition?: monaco.IPosition;
    /**
     * 是否禁用语法解析
     */
    disabledSyntaxCheck?: boolean;
    /**
     * 当value变化时，是否同步到editor中
     */
    sync?: boolean;
    /**
     * 文件内容改变事件回调函数
     */
    onChange?: (value: string, editorInstance: IEditorInstance) => any;
    /**
     * editor 失去焦点事件回调函数
     */
    onBlur?: (value: string, preValue: string) => any;
    /**
     * editor 聚焦事件回调函数
     */
    onFocus?: (value: string, preValue: string) => any;
    /**
     * 选中内容改变事件回调函数
     */
    onCursorSelection?: (selectionContent: string) => any;
    /**
     * 语法解析完成回调函数
     */
    onSyntaxChange?: IOnSyntaxChange;
    /**
     * 提供自动补全项的方法
     */
    customCompleteProvider?: ICompleteProvideFunc;
    /**
     * 是否打印编辑器日志
     */
    isLog?: boolean;
    /**
     * disableParseSqOnChange
     * 当sql 改变时是否不解析 sql
     * true：onChange 既解析 sql 语法（parseSyntax）、也解析 sql 提示（parserSql）
     * false: onChange 时只解析 sql 语法，不解析 sql 提示，sql 由 provideCompletionItems 去解析
     */
    disableParseSqOnChange?: boolean;
}
class Editor extends React.Component<EditorProps, any> {
    constructor(props: any) {
        super(props);
    }
    /**
     * monaco需要的渲染节点
     */
    monacoDom: any = null;
    /**
     * monaco实例
     */
    monacoInstance: IEditorInstance = null;
    /**
     * monaco渲染外部链接对象的销毁用ID
     */
    _linkId: any = null;

    shouldComponentUpdate(nextProps: EditorProps, nextState: any) {
        // 此处禁用render， 直接用editor实例更新编辑器
        return false;
    }

    componentDidMount() {
        this.initMonaco();
        if (typeof this.props.editorInstanceRef === 'function') {
            this.props.editorInstanceRef(this.monacoInstance);
        }
    }
    /**
     * 补全代理函数，来执行用户自定义补全方法。
     */
    providerProxy = (
        completeItems: any,
        resolve: any,
        customCompletionItemsCreator: any,
        status: any
    ) => {
        const { customCompleteProvider } = this.props;
        if (customCompleteProvider) {
            customCompleteProvider(
                completeItems,
                resolve,
                customCompletionItemsCreator,
                status
            );
        } else {
            resolve(completeItems);
        }
    };

    initProviderProxy() {
        const keyAndValues = Object.entries(provideCompletionItemsMap);
        for (let [, language] of keyAndValues) {
            /**
             * 每个函数的补全函数都由该组件统一代理
             */
            language.register(this.providerProxy, this.monacoInstance);
        }
    }
    disposeProviderProxy() {
        const keyAndValues = Object.entries(provideCompletionItemsMap);
        for (let [, language] of keyAndValues) {
            language.dispose(this.monacoInstance);
        }
    }
    // eslint-disable-next-line
    UNSAFE_componentWillReceiveProps(nextProps: EditorProps) {
        const { sync, value, theme, languageConfig, language } = nextProps;
        if (this.props.value !== value && sync) {
            /**
             * value更新， 并且含有sync同步标记，则更新编辑器值
             */
            const editorText = !value ? '' : value;
            this.updateValueWithNoEvent(editorText);
        }
        if (languageConfig !== this.props.languageConfig) {
            if (!jsonEqual(languageConfig, this.props.languageConfig)) {
                this.updateMonarch(languageConfig, language);
            }
        }
        if (this.props.language !== nextProps.language) {
            monaco.editor.setModelLanguage(
                this.monacoInstance.getModel(),
                nextProps.language
            );
        }
        if (this.props.options !== nextProps.options) {
            this.monacoInstance.updateOptions(nextProps.options);
        }

        if (this.props.theme !== theme) {
            monaco.editor.setTheme(theme);
        }
        // if(this.props.download!==download){
        //     this.initLink(download);
        // }
    }

    componentWillUnmount() {
        this.disposeProviderProxy();
        this.destroyMonaco();
    }
    /**
     * 提供下载链接。ps:不是很好用，屏蔽了
     * @param {string} link
     */
    initLink(link: any) {
        this.monacoInstance.changeViewZones((changeAccessor: any) => {
            if (this._linkId) {
                changeAccessor.removeZone(this._linkId);
            }
            let boxNode = document.createElement('div');
            let domNode = document.createElement('a');
            domNode.innerHTML = '完整下载链接';
            domNode.className = 'dt-monaco-link';
            domNode.setAttribute('href', link);
            domNode.setAttribute('download', '');
            boxNode.appendChild(domNode);
            this._linkId = changeAccessor.addZone({
                afterLineNumber: 0,
                heightInLines: 1,
                domNode: boxNode,
            });
        });
    }
    updateMonarch(config: IMonarchLanguageConf, language: string) {
        if (config && language) {
            if (config) {
                monaco.languages.setMonarchTokensProvider(language, config);
            }
        }
    }
    isValueExist(props: EditorProps) {
        const keys = Object.keys(props);
        if (keys.includes('value')) {
            return true;
        }
        return false;
    }

    log(args: any) {
        const { isLog } = this.props;
        isLog && console.log(...args);
    }

    destroyMonaco() {
        if (this.monacoInstance) {
            this.monacoInstance.dispose();
        }
    }

    initMonaco() {
        const { value, language, options, cursorPosition } = this.props;
        if (!this.monacoDom) {
            console.error('初始化dom节点出错');
            return;
        }

        const editorOptions = Object.assign({}, defaultOptions, options, {
            value,
            language: language || 'sql',
        });

        this.monacoInstance = monaco.editor.create(
            this.monacoDom,
            editorOptions
        );

        if (this.monacoInstance && cursorPosition) {
            this.monacoInstance.setPosition(cursorPosition);
            this.monacoInstance.focus();
            this.monacoInstance.revealPosition(
                cursorPosition,
                monaco.editor.ScrollType.Immediate
            );
        }

        this.initEditor();
    }

    initEditor() {
        this.initTheme();
        this.initEditorEvent();
        this.initProviderProxy();
        // this.initLink();
    }
    initTheme() {
        this.props.theme && monaco.editor.setTheme(this.props.theme);
    }
    updateValueWithNoEvent(value: string) {
        this.monacoInstance.setValue(value);
    }
    languageValueOnChange(callback: Function) {
        const { disableParseSqOnChange = false } = this.props;
        if (this.props.disabledSyntaxCheck) {
            return;
        }
        const newValue = this.monacoInstance.getValue();
        const languageId = this.monacoInstance.getModel().getLanguageId();
        if (
            provideCompletionItemsMap[languageId] &&
            provideCompletionItemsMap[languageId].onChange
        ) {
            provideCompletionItemsMap[languageId].onChange(
                newValue,
                this.monacoInstance,
                callback,
                disableParseSqOnChange
            );
        }
    }

    delayLanguageValueOnChange: any = delayFunctionWrap(
        this.languageValueOnChange.bind(this)
    );

    initEditorEvent() {
        this.languageValueOnChange(this.props.onSyntaxChange);
        this.monacoInstance.onDidChangeModelContent((event) => {
            this.log('编辑器事件');
            const { onChange, onSyntaxChange } = this.props;
            const newValue = this.monacoInstance.getValue();
            // 考虑到语法解析比较耗时，所以把它放到一个带有调用延迟的函数中，并且提供一个可供订阅的onSyntaxChange函数
            this.delayLanguageValueOnChange(onSyntaxChange);
            if (onChange && !event.isFlush) {
                this.log('订阅事件触发');
                onChange(newValue, this.monacoInstance);
            }
        });

        this.monacoInstance.onDidBlurEditorText(() => {
            this.log('编辑器事件 onDidBlur');
            const { onBlur, value } = this.props;
            if (onBlur) {
                const oldValue = this.monacoInstance.getValue();
                onBlur(value, oldValue);
            }
        });

        this.monacoInstance.onDidFocusEditorText(() => {
            this.log('编辑器事件 onDidFocus');
            const { onFocus, value } = this.props;
            if (onFocus) {
                const oldValue = this.monacoInstance.getValue();
                onFocus(value, oldValue);
            }
        });

        this.monacoInstance.onDidChangeCursorSelection((event: any) => {
            this.log('编辑器事件 onDidChangeCursorSelection');
            const { onCursorSelection } = this.props;
            const ranges = this.monacoInstance.getSelections();
            const model = this.monacoInstance.getModel();
            let selectionContent = '';
            for (let i = 0; i < ranges.length; i++) {
                selectionContent = selectionContent += model.getValueInRange(
                    ranges[i]
                );
            }
            if (onCursorSelection) {
                onCursorSelection(selectionContent);
            }
        });
        /**
         * 改变contextMenu的定位为fixed，避免容器内overflow:hidden属性截断contextMenu
         */
        this.monacoInstance.onContextMenu((e: any) => {
            this.log('编辑器事件 onContextMenu');
            const contextMenuElement = this.monacoInstance
                .getDomNode()
                .querySelector<HTMLElement>('.monaco-menu-container');

            if (contextMenuElement) {
                const posY =
                    e.event.posy + contextMenuElement.clientHeight >
                    window.innerHeight
                        ? e.event.posy - contextMenuElement.clientHeight
                        : e.event.posy;

                const posX =
                    e.event.posx + contextMenuElement.clientWidth >
                    window.innerWidth
                        ? e.event.posx - contextMenuElement.clientWidth
                        : e.event.posx;

                contextMenuElement.style.position = 'fixed';
                contextMenuElement.style.top =
                    Math.max(0, Math.floor(posY)) + 'px';
                contextMenuElement.style.left =
                    Math.max(0, Math.floor(posX)) + 'px';
            }
        });
    }

    render() {
        const { className, style } = this.props;

        let renderClass = 'code-editor';
        renderClass = className ? `${renderClass} ${className}` : renderClass;

        let renderStyle: any = {
            position: 'relative',
            minHeight: '400px',
            height: '100%',
            width: '100%',
        };

        renderStyle = style ? Object.assign(renderStyle, style) : renderStyle;

        return (
            <div
                className={renderClass}
                style={renderStyle}
                ref={(domIns) => {
                    this.monacoDom = domIns;
                }}
            />
        );
    }
}
export default Editor;