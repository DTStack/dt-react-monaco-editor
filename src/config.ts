import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions =
    {
        readOnly: false,
        contextmenu: true,
        autoIndent: 'keep',
        automaticLayout: true,
        showFoldingControls: 'always',
        folding: true,
        foldingStrategy: 'auto',
        suggestFontSize: 13,
        fontSize: 13,
        fixedOverflowWidgets: true,
        renderControlCharacters: true,
    };
