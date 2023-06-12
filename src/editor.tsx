import * as React from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

// monaco 当前版本并未集成最新basic-languages， 暂时shell单独引入
import './languages/dtlog/dtlog.contribution';
import { defaultOptions } from './config';

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
     * className to be added to monaco dom container
     */
    className?: string;
    /**
     * className to be added to the editor.
     */
    extraEditorClassName?: string;
    style?: React.CSSProperties;
    options?: IEditorOptions;
    theme?: monaco.editor.BuiltinTheme;
    language?: string;
    /**
     * get editor instance ref
     */
    editorInstanceRef?: (editorInstance: IEditorInstance) => any;
    /**
     * sync to editor content when value change
     */
    sync?: boolean;
    /**
     * callback for selection change event
     */
    onCursorSelection?: (
        selectionContent: string,
        event: monaco.editor.ICursorSelectionChangedEvent
    ) => any;
    onChange?: (
        value: string,
        event: monaco.editor.IModelContentChangedEvent
    ) => any;
    onFocus?: (value: string) => any;
    onBlur?: (value: string) => any;
}
class Editor extends React.Component<EditorProps, any> {
    constructor(props: any) {
        super(props);
    }

    editor: IEditorInstance = null;
    private monacoDom: any = null;
    private __prevent_onChange = false;
    private _changeSubscription: monaco.IDisposable;
    private _selectionSubscription: monaco.IDisposable;
    private _focusSubscription: monaco.IDisposable;
    private _blurSubscription: monaco.IDisposable;
    private _contextSubscription: monaco.IDisposable;

    componentDidMount() {
        this.initMonaco();
        if (typeof this.props.editorInstanceRef === 'function') {
            this.props.editorInstanceRef(this.editor);
        }
    }

    componentDidUpdate(prevProps) {
        const { language, theme, options, extraEditorClassName, sync } =
            this.props;
        if (
            this.props.value != null &&
            this.props.value !== this.editor.getValue() &&
            sync
        ) {
            this.__prevent_onChange = true;
            this.editor.pushUndoStop();
            this.editor.getModel().pushEditOperations(
                [],
                [
                    {
                        range: this.editor.getModel().getFullModelRange(),
                        text: this.props.value,
                    },
                ],
                () => null
            );

            this.editor.pushUndoStop();
            this.__prevent_onChange = false;
        }
        if (prevProps.language !== language) {
            monaco.editor.setModelLanguage(this.editor.getModel(), language);
        }
        if (prevProps.theme !== theme) {
            monaco.editor.setTheme(theme);
        }
        if (prevProps.options !== options) {
            console.log(options);
            this.editor.updateOptions({
                ...(extraEditorClassName ? { extraEditorClassName } : {}),
                ...options,
            });
        }
    }

    componentWillUnmount() {
        this.destroyMonaco();
    }

    initMonaco() {
        const { value, language, options, theme } = this.props;
        if (!this.monacoDom) {
            console.error('初始化dom节点出错');
            return;
        }
        const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
            {
                ...defaultOptions,
                ...options,
                value,
                language: language || 'sql',
                theme,
            };
        this.editor = monaco.editor.create(this.monacoDom, editorOptions);
        this.initEditorEvent();
    }

    initEditorEvent() {
        this._changeSubscription = this.editor.onDidChangeModelContent(
            (event) => {
                const { onChange } = this.props;
                const newValue = this.editor.getValue();
                if (!this.__prevent_onChange && this.props.onChange) {
                    onChange(newValue, event);
                }
            }
        );

        this._selectionSubscription = this.editor.onDidChangeCursorSelection(
            (event) => {
                const { onCursorSelection } = this.props;
                const ranges = this.editor.getSelections();
                const model = this.editor.getModel();
                const content: string = ranges.reduce((prev, cur) => {
                    return prev + model.getValueInRange(cur);
                }, '');

                onCursorSelection?.(content, event);
            }
        );

        this._focusSubscription = this.editor.onDidFocusEditorText(() => {
            this.props.onFocus?.(this.editor.getValue());
        });

        this._blurSubscription = this.editor.onDidBlurEditorText(() => {
            this.props.onBlur?.(this.editor.getValue());
        });

        /**
         * set contextMenu dom position to fixed
         * to avoid the contextMenu being truncated by "overflow: hidden"
         */
        this._contextSubscription = this.editor.onContextMenu((e) => {
            const contextMenuElement = this.editor
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

    destroyMonaco() {
        if (this.editor) {
            this.editor?.getModel()?.dispose();
            this.editor?.dispose();
            this._blurSubscription?.dispose();
            this._focusSubscription?.dispose();
            this._changeSubscription?.dispose();
            this._selectionSubscription?.dispose();
            this._contextSubscription?.dispose();
        }
    }

    render() {
        const { className, style } = this.props;
        const renderClass = `react-monaco-editor-container ${className ?? ''}`;
        const renderStyle: React.CSSProperties = {
            height: '100%',
            width: '100%',
            ...(style ?? {}),
        };

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
