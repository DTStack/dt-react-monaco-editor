import * as React from 'react';
import { editor, IDisposable } from 'monaco-editor/esm/vs/editor/editor.api';

import { defaultOptions } from './config';
import type { MonacoDiffEditorProps } from './types';

class MonacoDiffEditor extends React.Component<MonacoDiffEditorProps> {
    constructor(props) {
        super(props);
    }

    diffEditor: editor.IStandaloneDiffEditor = null;
    private monacoDom = React.createRef<HTMLDivElement>();
    private __prevent_onChange = false;
    private subscription: IDisposable;

    componentDidMount() {
        this.initMonaco();
        /**
         * @deprecated editorInstanceRef will be removed in a future release
         */
        if (typeof this.props.diffEditorInstanceRef === 'function') {
            this.props.diffEditorInstanceRef(this.diffEditor);
        }
    }

    componentDidUpdate(prevProps) {
        const { language, theme, options, sync } = this.props;
        const { original, modified } = this.diffEditor.getModel();

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

        if (this.props.original !== original.getValue() && sync) {
            original.setValue(this.props.original);
        }

        if (
            this.props.value != null &&
            this.props.value !== modified.getValue() &&
            sync
        ) {
            this.__prevent_onChange = true;
            const modifiedEditor = this.diffEditor.getModifiedEditor();

            const readOnly = modifiedEditor.getRawOptions().readOnly;

            if (readOnly) {
                modifiedEditor.updateOptions({
                    readOnly: false,
                });
            }

            modifiedEditor.pushUndoStop();
            modifiedEditor.executeEdits('sync-value', [
                {
                    range: modified.getFullModelRange(),
                    text: this.props.value,
                    forceMoveMarkers: true,
                },
            ]);
            modifiedEditor.pushUndoStop();

            if (readOnly) {
                modifiedEditor.updateOptions({
                    readOnly: readOnly,
                });
            }
            this.__prevent_onChange = false;
        }
    }

    componentWillUnmount() {
        this.props.editorWillUnMount?.(this.diffEditor);
        this.destroyMonaco();
    }

    initMonaco() {
        const { original, value, language, options, theme = 'vs' } = this.props;
        if (!this.monacoDom.current) {
            console.error('Can not get monacoDom element!');
            return;
        }

        this.props.editorWillMount?.();
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
            this.monacoDom.current,
            editorOptions
        );
        this.diffEditor.setModel({
            original: originalModel,
            modified: modifiedModel,
        });

        this.initEditorEvent();
        this.props.editorDidMount?.(this.diffEditor);
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
            this.diffEditor.dispose();
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
                ref={this.monacoDom}
            />
        );
    }
}

export default MonacoDiffEditor;
