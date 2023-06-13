import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export interface EditorProps {
    /**
     * Value of model in editor.
     */
    value: string;
    /**
     * ClassName to be added to monaco dom element (dom container).
     * You can also set extraEditorClassName in options
     * and it will be added to the editor
     */
    className?: string;
    /**
     * Style to be added to monaco dom element (dom container).
     * Default height is '100%'.
     * Default width is '100%'.
     */
    style?: React.CSSProperties;
    /**
     * Options for monaco editor.
     * Refer to monaco interface IStandaloneEditorConstructionOptions.
     * @see {@link monaco.editor.IStandaloneEditorConstructionOptions}
     */
    options?: monaco.editor.IStandaloneEditorConstructionOptions;
    /**
     * The theme used when the editor renders, defaults to 'vs'.
     * You can create custom themes via {@link monaco.editor.defineTheme}.
     * Refer to monaco type BuiltinTheme.
     * @see {@link  monaco.editor.BuiltinTheme}
     */
    theme?: monaco.editor.BuiltinTheme;
    /**
     * Language of model in MonacoEditor, defaults to 'sql'.
     * You can import monaco built-in languages from 'monaco-editor/esm/vs/basic-languages/*.*.contribution.js' ,
     * or use monaco-editor-webpack-plugin.
     */
    language?: string;
    /**
     * Get editor instance.
     */
    editorInstanceRef?: (
        editorInstance: monaco.editor.IStandaloneCodeEditor
    ) => any;
    /**
     * Sync value to model when value change if sync is true.
     */
    sync?: boolean;
    /**
     * An event emitted when the selection of the editor model has changed.
     */
    onCursorSelection?: (
        selectionContent: string,
        event: monaco.editor.ICursorSelectionChangedEvent
    ) => any;
    /**
     * An event emitted when the value of the editor model has changed.
     */
    onChange?: (
        value: string,
        event: monaco.editor.IModelContentChangedEvent
    ) => any;
    /**
     * An event emitted when the editor is in focus.
     */
    onFocus?: (value: string) => any;
    /**
     * An event emitted when the editor is out of focus.
     */
    onBlur?: (value: string) => any;
}

export interface DiffEditorProps {
    /**
     * Value of model in modifiedEditor.
     */
    value: string;
    /**
     * Value of model in originalEditor.
     */
    original: string;
    /**
     * ClassName to be added to monaco dom element (dom container).
     * You can also set extraEditorClassName in options
     * and it will be added to the editor
     */
    className?: string;
    /**
     * Style to be added to monaco dom element (dom container).
     * Default height is '100%'.
     * Default width is '100%'.
     */
    style?: React.CSSProperties;
    /**
     * Options for monaco diff editor.
     * Refer to monaco interface IStandaloneEditorConstructionOptions.
     * @see {@link monaco.editor.IStandaloneDiffEditorConstructionOptions}
     */
    options?: monaco.editor.IStandaloneDiffEditorConstructionOptions;
    /**
     * The theme used when the editor renders, defaults to 'vs'.
     * You can create custom themes via {@link monaco.editor.defineTheme}.
     * Refer to monaco type BuiltinTheme.
     * @see {@link  monaco.editor.BuiltinTheme}
     */
    theme?: monaco.editor.BuiltinTheme;
    /**
     * Language of model in MonacoEditor, defaults to 'sql'.
     * You can import monaco built-in languages from 'monaco-editor/esm/vs/basic-languages/*.*.contribution.js' ,
     * or use monaco-editor-webpack-plugin.
     */
    language?: string;
    /**
     * Get diff editor instance.
     */
    diffEditorInstanceRef?: (
        diffEditorInstance: monaco.editor.IStandaloneDiffEditor
    ) => void;
    /**
     * Sync value to model when value change if sync is true.
     */
    sync?: boolean;
    /**
     * Is modified editor readonly.
     */
    readOnly?: boolean;
    /**
     * An event emitted when the value of the modifiedEditor model has changed.
     */
    onChange?: (
        originValue: string,
        event: monaco.editor.IModelContentChangedEvent
    ) => any;
}
