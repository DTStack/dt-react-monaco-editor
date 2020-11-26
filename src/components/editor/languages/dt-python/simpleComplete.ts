// import * as monaco from 'monaco-editor/esm/vs/editor/edcore.main.js';
import * as monaco from 'monaco-editor';
import DtWorker from './python.worker';
import { get } from 'lodash';
import { language } from './python';

let _DtParserInstance: any;
class DtParser {
    _DtParser: any;
    _eventMap: any;
    private currentLanguage: any;
    constructor (currentLanguage) {
        this.currentLanguage = currentLanguage
        this._DtParser = new DtWorker();
        this._eventMap = {};
        this._DtParser.onmessage = (e: any) => {
            const data = e.data;
            const eventId = data.eventId;
            if (this._eventMap[eventId]) {
                this._eventMap[eventId].resolve(data.result)
                this._eventMap[eventId] = null;
            }
        }
    }
    parserSql () {
        const arg = arguments;
        const eventId = this._createId();
        return new Promise((resolve: any, reject: any) => {
            this._DtParser.postMessage({
                eventId: eventId,
                type: 'parserSql',
                data: Array.from(arg),
                language: this.currentLanguage
            });
            this._eventMap[eventId] = {
                resolve,
                reject,
                arg,
                type: 'parserSql'
            }
        })
    }
    parseSyntax () {
        const arg = arguments;
        const eventId = this._createId();
        return new Promise((resolve: any, reject: any) => {
            this._DtParser.postMessage({
                eventId: eventId,
                type: 'parseSyntax',
                data: Array.from(arg),
                language: this.currentLanguage
            });
            this._eventMap[eventId] = {
                resolve,
                reject,
                arg,
                type: 'parseSyntax'
            }
        })
    }
    _createId () {
        return new Date().getTime() + '' + ~~(Math.random() * 100000)
    }
}

function loadDtParser (currentLanguage: string) {
    if (!_DtParserInstance) {
        _DtParserInstance = new DtParser(currentLanguage);
    }
    return _DtParserInstance;
}
/**
 * Select thing from table, table, table;
 * select __+ thing __+ from __+ Table (__* , __*table)* __*;
 * thing=([,.\w])
 */
// const selectRegExp = /Select\s+[\s\S]+\s+from(\s+\w+)((\s*,\s*\w+)*)\s*;/i;
let cacheKeyWords: any = [];
let _completeProvideFunc: any = {};
let _tmpDecorations: any = [];
function dtPythonWords () {
    return {
        keywords: language.keywords
    }
}
function keywordsCompleteItemCreater (words: any) {
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
function functionsCompleteItemCreater (functions: any) {
    return functions.map(
        (functionName: any, index: any) => {
            return {
                label: functionName,
                kind: monaco.languages.CompletionItemKind.Function,
                detail: '函数',
                insertText: {
                    value: functionName + '($1) '
                },
                sortText: '2000' + index + functionName,
                filterText: functionName.toLowerCase()
            }
        }
    )
}
function customCompletionItemsCreater (_customCompletionItems: any) {
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
                insertText: {
                    value: type == 'Function' ? (name + '($1) ') : (name)
                },
                sortText: sortIndex + index + name
            }
        }
    )
}
/**
 * 创建固定的补全项，例如：keywords...
 */
function createDependencyProposals () {
    if (!cacheKeyWords.length) {
        const words: any = dtPythonWords();
        const functions: any = [].concat(words.builtinFunctions).concat(words.windowsFunctions).concat(words.innerFunctions).concat(words.otherFunctions).filter(Boolean);
        const keywords: any = [].concat(words.keywords);
        cacheKeyWords = keywordsCompleteItemCreater(keywords).concat(functionsCompleteItemCreater(functions))
    }
    return cacheKeyWords
}

monaco.languages.registerCompletionItemProvider('dtPython2', {
    triggerCharacters: ['.'],
    provideCompletionItems: function (model: any, position: any, token: any, CompletionContext: any) {
        const currentLanguage = model?._languageIdentifier?.language
        const completeItems = createDependencyProposals();
        return new Promise<any>(async (resolve: any, reject: any) => {
            const completeProvideFunc = _completeProvideFunc[model.id]
            if (completeProvideFunc) {
                const textValue = model.getValue();
                const cursorIndex = model.getOffsetAt(position);
                const dtParser = loadDtParser(currentLanguage);
                let autoComplete = await dtParser.parserSql([textValue.substr(0, cursorIndex), textValue.substr(cursorIndex)]);
                let columnContext: any;
                let tableContext: any;
                let suggestTablesIdentifierChain = get(autoComplete, 'suggestTables.identifierChain', []);
                if (suggestTablesIdentifierChain.length) {
                    tableContext = suggestTablesIdentifierChain[0].name;
                }
                if (autoComplete && autoComplete.suggestColumns && autoComplete.suggestColumns.tables && autoComplete.suggestColumns.tables.length) {
                    columnContext = autoComplete.suggestColumns.tables.map(
                        (table: any) => {
                            return table.identifierChain.map((identifier: any) => {
                                return identifier.name
                            }).join('.');
                        }
                    )
                }
                completeProvideFunc(completeItems, resolve, customCompletionItemsCreater, {
                    status: 0,
                    model: model,
                    position: position,
                    word: model.getWordAtPosition(position),
                    autoComplete: autoComplete,
                    context: {
                        columnContext: columnContext,
                        tableContext: tableContext,
                        completionContext: CompletionContext
                    }
                });
            } else {
                resolve(completeItems)
            }
        });
    }
});

monaco.languages.registerCompletionItemProvider('dtPython3', {
    triggerCharacters: ['.'],
    provideCompletionItems: function (model: any, position: any, token: any, CompletionContext: any) {
        const currentLanguage = model?._languageIdentifier?.language
        const completeItems = createDependencyProposals();
        return new Promise<any>(async (resolve: any, reject: any) => {
            const completeProvideFunc = _completeProvideFunc[model.id]
            if (completeProvideFunc) {
                const textValue = model.getValue();
                const cursorIndex = model.getOffsetAt(position);
                const dtParser = loadDtParser(currentLanguage);
                let autoComplete = await dtParser.parserSql([textValue.substr(0, cursorIndex), textValue.substr(cursorIndex)]);
                let columnContext: any;
                let tableContext: any;
                let suggestTablesIdentifierChain = get(autoComplete, 'suggestTables.identifierChain', []);
                if (suggestTablesIdentifierChain.length) {
                    tableContext = suggestTablesIdentifierChain[0].name;
                }
                if (autoComplete && autoComplete.suggestColumns && autoComplete.suggestColumns.tables && autoComplete.suggestColumns.tables.length) {
                    columnContext = autoComplete.suggestColumns.tables.map(
                        (table: any) => {
                            return table.identifierChain.map((identifier: any) => {
                                return identifier.name
                            }).join('.');
                        }
                    )
                }
                completeProvideFunc(completeItems, resolve, customCompletionItemsCreater, {
                    status: 0,
                    model: model,
                    position: position,
                    word: model.getWordAtPosition(position),
                    autoComplete: autoComplete,
                    context: {
                        columnContext: columnContext,
                        tableContext: tableContext,
                        completionContext: CompletionContext
                    }
                });
            } else {
                resolve(completeItems)
            }
        });
    }
});

/**
 * 该方法提供一个注册自定义补全函数的接口
 * @param {function} completeProvideFunc
 */
export function registeCompleteItemsProvider (completeProvideFunc: any, _editor: any) {
    const id = _editor.getModel().id;
    _completeProvideFunc[id] = completeProvideFunc;
}
/**
 * 注销自定义补全函数
 */
export function disposeProvider (_editor: any) {
    if (!_editor) {
        return;
    }
    const id = _editor.getModel().id;
    _completeProvideFunc[id] = undefined;
}

export async function onChange (value = '', _editor: any, callback: any) {
    const currentLanguage = _editor?.model?._languageIdentifier?.language

    const dtParser = loadDtParser(currentLanguage);
    const model = _editor.getModel();
    // const cursorIndex = model.getOffsetAt(_editor.getPosition());
    let autoComplete = await dtParser.parserSql(value);

    let syntax = await dtParser.parseSyntax(value.replace(/\r\n/g, '\n'));
    if (syntax && syntax.token != 'EOF') {
        const message = messageCreate(syntax);
        monaco.editor.setModelMarkers(model, model.getModeId(), [{
            startLineNumber: syntax.startLine,
            startColumn: syntax.startCol + 1,
            endLineNumber: syntax.endLine + 1,
            endColumn: syntax.endCol + 1,
            message: `[语法错误！] \n${message}`,
            severity: 8
        }])
        _tmpDecorations = _editor.deltaDecorations(_tmpDecorations, createLineMarker(syntax))
    } else {
        _editor.deltaDecorations(_tmpDecorations, [])
        monaco.editor.setModelMarkers(model, model.getModeId(), [])
    }
    if (callback) {
        callback(autoComplete, syntax);
    }
}

function createLineMarker (syntax: any) {
    return [{
        range: new monaco.Range(syntax.startLine, 1, syntax.endLine, 1),
        options: {
            isWholeLine: true,
            // linesDecorationsClassName: 'dt-monaco-line-error' ,
            className: 'dt-monaco-whole-line-error'
        }
    }]
}

function messageCreate (syntax: any) {
    const { expected, message } = syntax
    let expect = expected || [];
    if (expect.length) {
        return `您可能想输入是${expect.map(
            (item: any) => {
                return ` '${item.text}'`
            }
        ).filter((value: any, index: any) => { return index < 20 }).join(',')}?`
    } else {
        return message || '请检查您的语法!'
    }
}
