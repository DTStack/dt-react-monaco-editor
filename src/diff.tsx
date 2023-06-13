import * as React from 'react';
import { editor, IDisposable } from 'monaco-editor/esm/vs/editor/editor.api';

import { defaultOptions } from './config';
import type { DiffEditorProps } from './types';

class MonacoDiffEditor extends React.Component<DiffEditorProps, any> {
    constructor(props: any) {
        super(props);
    }

    diffEditor: editor.IStandaloneDiffEditor = null;
    private monacoDom: HTMLDivElement = null;
    private __prevent_onChange = false;
    private subscription: IDisposable;

    componentDidMount() {
        this.initMonaco();
        if (typeof this.props.diffEditorInstanceRef === 'function') {
            this.props.diffEditorInstanceRef(this.diffEditor);
        }
    }

    componentDidUpdate(prevProps) {
        const { language, theme, options, sync, readOnly } = this.props;
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
            editor.setModelLanguage(original, language);
            editor.setModelLanguage(modified, language);
        }
        if (prevProps.theme !== theme) {
            editor.setTheme(theme);
        }
        if (prevProps.options !== options) {
            this.diffEditor.updateOptions({
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
            console.error('Can not get monacoDom element!');
            return;
        }

        const editorOptions: editor.IStandaloneDiffEditorConstructionOptions = {
            ...defaultOptions,
            renderIndicators: true,
            theme,
            scrollbar: {
                horizontal: 'visible',
            },
            ...options,
        };

        const originalModel = editor.createModel(original, language ?? 'sql');
        const modifiedModel = editor.createModel(value, language ?? 'sql');
        this.diffEditor = editor.createDiffEditor(
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

export default MonacoDiffEditor;
