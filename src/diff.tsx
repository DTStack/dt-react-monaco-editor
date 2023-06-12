import * as React from 'react';
import * as monaco from 'monaco-editor';

import './languages/dtlog/dtlog.contribution';

import { defaultOptions } from './config';

export interface DiffEditorProps {
    /**
     * className to be added to monaco dom container
     */
    className?: string;
    /**
     * className to be added to the editor.
     */
    extraEditorClassName?: string;
    style?: React.CSSProperties;
    options?: monaco.editor.IStandaloneDiffEditorConstructionOptions;
    theme?: monaco.editor.BuiltinTheme;
    language?: string;
    /**
     * modified editor content
     */
    value: string;
    /**
     * original editor content
     */
    original: string;
    /**
     * get diff editor instance ref
     */
    diffEditorInstanceRef?: (
        diffEditorInstance: monaco.editor.IStandaloneDiffEditor
    ) => void;
    /**
     * on modified editor content change
     */
    onChange?: (
        originValue: string,
        event: monaco.editor.IModelContentChangedEvent
    ) => any;
    /**
     * sync to editor content when original or value change
     */
    sync?: boolean;
    /**
     * Is modified editor readonly
     */
    readOnly?: boolean;
}

class DiffEditor extends React.Component<DiffEditorProps, any> {
    constructor(props: any) {
        super(props);
    }

    diffEditor: monaco.editor.IStandaloneDiffEditor = null;

    private monacoDom: HTMLDivElement = null;
    private __prevent_onChange = false;
    private subscription: monaco.IDisposable;

    componentDidMount() {
        this.initMonaco();
        if (typeof this.props.diffEditorInstanceRef === 'function') {
            this.props.diffEditorInstanceRef(this.diffEditor);
        }
    }

    componentDidUpdate(prevProps) {
        const {
            language,
            theme,
            options,
            extraEditorClassName,
            sync,
            readOnly,
        } = this.props;
        const { original, modified } = this.diffEditor.getModel();

        if (this.props.original !== original.getValue() && sync) {
            original.setValue(this.props.original);
        }
        if (
            this.props.value != null &&
            this.props.value !== modified.getValue() &&
            sync
        ) {
            this.__prevent_onChange = true;
            this.diffEditor.getModifiedEditor().pushUndoStop();
            modified.pushEditOperations(
                [],
                [
                    {
                        range: modified.getFullModelRange(),
                        text: this.props.value,
                    },
                ],
                () => null
            );

            this.diffEditor.getModifiedEditor().pushUndoStop();
            this.__prevent_onChange = false;
        }
        if (prevProps.language !== language) {
            monaco.editor.setModelLanguage(original, language);
            monaco.editor.setModelLanguage(modified, language);
        }
        if (prevProps.theme !== theme) {
            monaco.editor.setTheme(theme);
        }
        if (prevProps.options !== options) {
            this.diffEditor.updateOptions({
                ...(extraEditorClassName ? { extraEditorClassName } : {}),
                ...options,
            });
        }
        if (prevProps.readOnly !== readOnly) {
            this.diffEditor.getModifiedEditor().updateOptions({
                readOnly,
            });
        }
    }

    componentWillUnmount() {
        this.destroyMonaco();
    }

    initMonaco() {
        const {
            original,
            value,
            language,
            options,
            theme = 'vs',
            readOnly,
        } = this.props;
        if (!this.monacoDom) {
            console.error('初始化dom节点出错');
            return;
        }

        const editorOptions: monaco.editor.IStandaloneDiffEditorConstructionOptions =
            {
                ...defaultOptions,
                renderIndicators: true,
                scrollbar: {
                    horizontal: 'visible',
                },
                theme,
                ...options,
            };

        const originalModel = monaco.editor.createModel(
            original,
            language ?? 'sql'
        );
        const modifiedModel = monaco.editor.createModel(
            value,
            language ?? 'sql'
        );
        this.diffEditor = monaco.editor.createDiffEditor(
            this.monacoDom,
            editorOptions
        );
        this.diffEditor.setModel({
            original: originalModel,
            modified: modifiedModel,
        });
        this.diffEditor.getModifiedEditor().updateOptions({
            readOnly: readOnly,
        });

        this.initEditorEvent();
    }

    initEditorEvent() {
        const { modified } = this.diffEditor.getModel();
        this.subscription = modified.onDidChangeContent((event) => {
            if (!this.__prevent_onChange && this.props.onChange) {
                this.props.onChange(modified.getValue(), event);
            }
        });
    }

    destroyMonaco() {
        if (this.diffEditor) {
            const { original, modified } = this.diffEditor.getModel();
            this.diffEditor.dispose();
            original.dispose();
            modified.dispose();
            this.subscription?.dispose();
        }
    }

    render() {
        const { className, style } = this.props;
        const renderClass = `react-monaco-diff-editor-container ${
            className ?? ''
        }`;
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
export default DiffEditor;
