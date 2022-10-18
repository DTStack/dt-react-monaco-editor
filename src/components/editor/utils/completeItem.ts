import * as monaco from 'monaco-editor';

export function keywordsCompleteItemCreator (words: any) {
    return words.map(
        (word: any, index: any) => {
            return {
                label: word,
                kind: monaco.languages.CompletionItemKind.Keyword,
                detail: '关键字',
                insertText: word + ' ',
                sortText: '1000' + index + word,
                filterText: word.toLowerCase()
            }
        }
    )
}

export function functionsCompleteItemCreator (functions: any) {
    return functions.map(
        (functionName: any, index: any) => {
            return {
                label: functionName,
                kind: monaco.languages.CompletionItemKind.Function,
                detail: '函数',
                insertText: functionName + '($1) ',
                sortText: '2000' + index + functionName,
                filterText: functionName.toLowerCase(),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            }
        }
    )
}

export function customCompletionItemsCreator (_customCompletionItems: any) {
    if (!_customCompletionItems) {
        return [];
    }
    return _customCompletionItems.map(
        ([ name, detail, sortIndex, type ]: any, index: any) => {
            sortIndex = sortIndex || '3000';
            return {
                label: name,
                kind: monaco.languages.CompletionItemKind[type || 'Text'],
                detail: detail,
                insertText: type == 'Function' ? (name + '($1) ') : (name),
                sortText: sortIndex + index + name,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            }
        }
    )
}
