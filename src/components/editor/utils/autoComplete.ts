import * as monaco from 'monaco-editor';
import { IAutoComplete } from './parser-types'

export function keywordsCompleteItemCreator (words: string[]): IMonacoLanguageCompletionItem[] {
    return words.map(
        (word, index) => {
            return {
                label: word,
                kind: monaco.languages.CompletionItemKind.Keyword,
                detail: '关键字',
                insertText: word + ' ',
                sortText: '1000' + index + word,
                filterText: word.toLowerCase(),
                range: undefined as any
            }
        }
    )
}

export function functionsCompleteItemCreator (functions: string[]): IMonacoLanguageCompletionItem[] {
    return functions.map(
        (functionName, index) => {
            return {
                label: functionName,
                kind: monaco.languages.CompletionItemKind.Function,
                detail: '函数',
                insertText: functionName + '($1) ',
                sortText: '2000' + index + functionName,
                filterText: functionName.toLowerCase(),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: undefined as any
            }
        }
    )
}

/**
 * @description completionItem provided to Monaco Editor
 */
type ICustomCompletionItem1 = {
    name: string;
    detail: string;
    /**
     * sortIndex 的值将影响自动补全项的排序，
     * 最终的 sortText = sortIndex + index + name
     * default is 1000
     */
    sortIndex: string | number;
    type: keyof typeof monaco.languages.CompletionItemKind;
    options?: {
        /**
         * 是否在函数后自动补上圆括号
         * default is true
         */
        autoBracketsForFunction?: boolean;
        /**
         * default is true
         * 是否当作 snippet 插入到 editor 中
         * 开启此选项时，选择自动补全项后光标将自动移动到 $1 位置
         */
        insertAsSnippet?: boolean;
    };
}

/**
 * @description ICustomCompletionItem1 的简化版本
 * 默认开启 autoBracketsForFunction 和 insertAsSnippet
 * @param [name, detail, sortIndex, type]
 */
type ICustomCompletionItem2 = [
    string,
    string,
    string|number,
    keyof typeof monaco.languages.CompletionItemKind
]

export type ICustomCompletionItem = ICustomCompletionItem1 | ICustomCompletionItem2

type IMonacoLanguageCompletionItem = monaco.languages.CompletionItem

/**
 * 生成自定义的自动提示项
 */
export function customCompletionItemsCreator (
    customCompletionItems: ICustomCompletionItem[]
): IMonacoLanguageCompletionItem[] {
    if (!customCompletionItems?.length) {
        return [];
    }
    return customCompletionItems.map(
        (completionItem, index: any) => {
            if (Array.isArray(completionItem)) {
                const [name, detail, sortIndex = '1000', type] = completionItem;
                return {
                    label: name,
                    kind: monaco.languages.CompletionItemKind[type || 'Text'],
                    detail,
                    insertText: type == 'Function' ? (name + '($1) ') : (name),
                    sortText: sortIndex + index + name,
                    filterText: name.toLowerCase(),
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range: undefined as any
                }
            } else {
                const {
                    name,
                    detail,
                    sortIndex = '1000',
                    type,
                    options: {
                        autoBracketsForFunction = true,
                        insertAsSnippet = true
                    }
                } = completionItem;
                let insertText = name
                if (type == 'Function' && autoBracketsForFunction) {
                    if (insertAsSnippet) {
                        insertText = (name + '($1) ')
                    } else {
                        insertText = (name + '( ) ')
                    }
                }
                const insertTextRules = insertAsSnippet
                    ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    : monaco.languages.CompletionItemInsertTextRule.KeepWhitespace
                return {
                    label: name,
                    kind: monaco.languages.CompletionItemKind[type || 'Text'],
                    detail,
                    insertText,
                    sortText: sortIndex + index + name,
                    filterText: name.toLowerCase(),
                    insertTextRules,
                    range: undefined as any
                }
            }
        }
    )
}

export type ICustomCompletionItemsCreator = typeof customCompletionItemsCreator

export type ISyntaxContext = {
    status: 0;
    model: monaco.editor.ITextModel;
    position: monaco.Position;
    word: monaco.editor.IWordAtPosition;
    autoComplete: IAutoComplete;
    context: {
        columnContext: string[];
        tableContext: string;
        completionContext: monaco.languages.CompletionContext;
    };
}

export type ICompleteProvideFunc = (
    /** 所有内置的默认补全项 */
    builtInCompleteItems: IMonacoLanguageCompletionItem[],
    /** resolve 接收到的补全项就是最终显示的补全项 */
    resolve: (CompleteItems: IMonacoLanguageCompletionItem[]) => void,
    /** 用来创建自定义补全项的辅助函数 */
    customCompletionItemsCreator: ICustomCompletionItemsCreator,
    /** 当前content解析出的语法信息 */
    syntaxContext: ISyntaxContext
) => any;

export type IOnSyntaxChange = (autoComplete: IAutoComplete, syntax: any) => any;
