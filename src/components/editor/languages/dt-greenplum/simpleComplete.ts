// import * as monaco from 'monaco-editor/esm/vs/editor/edcore.main.js';
import * as monaco from 'monaco-editor';
import { get } from 'lodash';
import { keywordsCompleteItemCreator, functionsCompleteItemCreator, customCompletionItemsCreator } from '../../utils'
import DtWorker from './greenplum.worker';
import { language } from './greenplum'

let _DtParserInstance: any;

class DtParser {
    _DtParser: Worker;
    _eventMap: any;

    constructor () {
        this._DtParser = new DtWorker();
        this._eventMap = {};
        this._DtParser.onmessage = (e) => {
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
                data: Array.from(arg)
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
                data: Array.from(arg)
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

function loadDtParser () {
    if (!_DtParserInstance) {
        _DtParserInstance = new DtParser();
    }
    return _DtParserInstance;
}

let _completeProvideFunc: any = {};
let _tmpDecorations: any = [];

function dtGreenplumWords () {
    return {
        keywords: language.keywords
    }
}

/**
 * 创建固定的补全项，例如：keywords...
 */
function createDependencyProposals () {
    const words: any = dtGreenplumWords();
    const functions: any = [].concat(words.builtinFunctions).concat(words.windowsFunctions).concat(words.innerFunctions).concat(words.otherFunctions).filter(Boolean);
    const keywords: any = [].concat(words.keywords);
    return keywordsCompleteItemCreator(keywords).concat(functionsCompleteItemCreator(functions))
}

monaco.languages.registerCompletionItemProvider('dtGreenPlum', {
    triggerCharacters: ['.'],
    provideCompletionItems: function (model: any, position: any, CompletionContext: any, token: any) {
        const completeItems = createDependencyProposals();
        return new Promise<any>(async (resolve: any, reject: any) => {
            const completeProvideFunc = _completeProvideFunc[model.id]
            if (completeProvideFunc) {
                const textValue = model.getValue();
                const cursorIndex = model.getOffsetAt(position);
                const dtParser = loadDtParser();
                let autoComplete = await dtParser.parserSql([textValue.substr(0, cursorIndex), textValue.substr(cursorIndex)]);
                let columnContext: any;
                let tableContext: any;
                let suggestTablesIdentifierChain = get(autoComplete, 'suggestTables.identifierChain', []);
                if (suggestTablesIdentifierChain.length) {
                    tableContext = suggestTablesIdentifierChain[0].name;
                }
                if (autoComplete.suggestColumns && autoComplete.suggestColumns.tables && autoComplete.suggestColumns.tables.length) {
                    columnContext = autoComplete.suggestColumns.tables.map(
                        (table: any) => {
                            return table.identifierChain.map((identifier: any) => {
                                return identifier.name
                            }).join('.');
                        }
                    )
                }
                const resolveCompleteItems = (completeItems) => (
                    resolve({
                        suggestions: completeItems,
                        incomplete: true
                    })
                )
                completeProvideFunc(completeItems, resolveCompleteItems, customCompletionItemsCreator, {
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
                resolve({
                    suggestions: completeItems,
                    incomplete: true
                })
            }
        });
    }
});

/**
 * 该方法提供一个注册自定义补全函数的接口
 * @param {function} completeProvideFunc
 */
export function registerCompleteItemsProvider (completeProvideFunc: any, _editor: any) {
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
    const dtParser = loadDtParser();
    const model = _editor.getModel();
    let autoComplete = await dtParser.parserSql(value);
    /**
     * The dtsql parser was not compatible with greenplum
     * Syntax parsing is not currently supported
     */
    // let syntax = await dtParser.parseSyntax(value.replace(/\r\n/g, '\n'));
    let syntax = null
    if (syntax && syntax.token != 'EOF') {
        const message = messageCreate(syntax);
        monaco.editor.setModelMarkers(model, model.getLanguageId(), [{
            startLineNumber: syntax.loc.first_line,
            startColumn: syntax.loc.first_column + 1,
            endLineNumber: syntax.loc.last_line,
            endColumn: syntax.loc.last_column + 1,
            message: `[语法错误！] \n${message}`,
            severity: 8
        }])
        _tmpDecorations = _editor.deltaDecorations(_tmpDecorations, createLineMarker(syntax))
    } else {
        _editor.deltaDecorations(_tmpDecorations, [])
        monaco.editor.setModelMarkers(model, model.getLanguageId(), [])
    }
    if (callback) {
        callback(autoComplete, syntax);
    }
}

function createLineMarker (syntax: any) {
    return [{
        range: new monaco.Range(syntax.loc.first_line, 1, syntax.loc.last_line, 1),
        options: {
            isWholeLine: true,
            // linesDecorationsClassName: 'dt-monaco-line-error' ,
            className: 'dt-monaco-whole-line-error'
        }
    }]
}

function messageCreate (syntax: any) {
    let expected = syntax.expected || [];
    if (expected.length) {
        return `您可能想输入是${expected.map(
            (item: any) => {
                return ` '${item.text}'`
            }
        ).filter((value: any, index: any) => { return index < 20 }).join(',')}?`
    } else {
        return '请检查您的语法！'
    }
}
