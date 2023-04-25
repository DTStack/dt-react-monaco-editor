// import * as monaco from 'monaco-editor/esm/vs/editor/edcore.main.js';
import * as monaco from 'monaco-editor';
import FlinkWorker from './dtflink.worker';
import { language } from './dtflink'
import { keywordsCompleteItemCreator, functionsCompleteItemCreator, customCompletionItemsCreator } from '../../utils'

let _completeProvideFunc: any = {};
let _tmpDecorations: any = [];
let _DtParserInstance: any;

class FlinkParser {
    _parser: any;
    _eventMap: any;

    constructor () {
        this._parser = new FlinkWorker();
        this._eventMap = {};
        this._parser.onmessage = (e: any) => {
            const data = e.data;
            const eventId = data.eventId;
            if (this._eventMap[eventId]) {
                this._eventMap[eventId].resolve(data.result)
                this._eventMap[eventId] = null;
            }
        }
    }
    parseSyntax () {
        const arg = arguments;
        const eventId = this._createId();
        return new Promise((resolve: any, reject: any) => {
            this._parser.postMessage({
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
        _DtParserInstance = new FlinkParser();
    }
    return _DtParserInstance;
}

function dtsqlWords (): {
    builtinFunctions?: string[];
    windowsFunctions?: string[];
    innerFunctions?: string[];
    otherFunctions?: string[];
    keywords?: string[]; } {
    return {
        keywords: language.keywords
    }
}

function createDependencyProposals () {
    const words = dtsqlWords();
    const functions: any = [].concat(words.builtinFunctions).concat(words.windowsFunctions).concat(words.innerFunctions).concat(words.otherFunctions).filter(Boolean);
    const keywords: any = [].concat(words.keywords);
    return keywordsCompleteItemCreator(keywords).concat(functionsCompleteItemCreator(functions))
}

monaco.languages.registerCompletionItemProvider('dtflink', {
    triggerCharacters: ['.'],
    provideCompletionItems: function (model: any, position: any, completionContext: any, token: any) {
        const completeItems = createDependencyProposals();
        return new Promise<any>(async (resolve: any, reject: any) => {
            const completeProvideFunc = _completeProvideFunc[model.id]
            if (completeProvideFunc) {
                const resolveCompleteItems = (completeItems) => (
                    resolve({
                        suggestions: completeItems
                    })
                )
                completeProvideFunc(completeItems, resolveCompleteItems, customCompletionItemsCreator, {
                    status: 0,
                    model: model,
                    position: position,
                    word: model.getWordAtPosition(position),
                    context: {
                        completionContext: completionContext
                    }
                });
            } else {
                resolve({
                    suggestions: completeItems
                })
            }
        });
    }
});
export async function onChange (value = '', _editor: monaco.editor.IStandaloneCodeEditor, callback: any, disableParseSqOnChange?: boolean) {
    const dtParser = loadDtParser();
    const model = _editor.getModel();
    // const cursorIndex = model.getOffsetAt(_editor.getPosition());
    let syntax = await dtParser.parseSyntax(value.replace(/\r\n/g, '\n'));
    if (syntax) {
        const message = syntax.errorMsg;
        let begin = _editor.getModel().getPositionAt(syntax.token.start);
        let end = _editor.getModel().getPositionAt(syntax.token.stop);
        monaco.editor.setModelMarkers(model, model.getLanguageId(), [{
            startLineNumber: begin.lineNumber,
            startColumn: begin.column,
            endLineNumber: end.lineNumber,
            endColumn: end.column + 1,
            message: `[语法错误！] \n${message}`,
            severity: 8
        }])
        _tmpDecorations = _editor.deltaDecorations(_tmpDecorations, createLineMarker(begin, end))
    } else {
        _editor.deltaDecorations(_tmpDecorations, [])
        monaco.editor.setModelMarkers(model, model.getLanguageId(), [])
    }
    if (callback) {
        callback(syntax);
    }
}

function createLineMarker (begin: monaco.Position, end: monaco.Position) {
    return [{
        range: new monaco.Range(begin.lineNumber, 1, end.lineNumber, 1),
        options: {
            isWholeLine: true,
            // linesDecorationsClassName: 'dt-monaco-line-error' ,
            className: 'dt-monaco-whole-line-error'
        }
    }]
}
export function registerCompleteItemsProvider (completeProvideFunc: any, _editor: any) {
    const id = _editor.getModel().id;
    _completeProvideFunc[id] = completeProvideFunc;
}
export function disposeProvider (_editor: any) {
    if (!_editor) {
        return;
    }
    const id = _editor.getModel().id;
    _completeProvideFunc[id] = undefined;
}
