import * as monaco from 'monaco-editor';

const whiteTheme: monaco.editor.IStandaloneThemeData = {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
        'editorSuggestWidget.background': '#fff',
        'editorSuggestWidget.border': '#fff',
        'editorSuggestWidget.foreground': '#88adbf',
        'editorSuggestWidget.selectedBackground': '#dfeeff',
    },
};

monaco.editor.defineTheme('white', whiteTheme);
