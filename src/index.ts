import Editor from './editor';

export type {
    EditorProps,
    IEditorInstance,
    IEditorOptions,
    IMonarchLanguageConf,
} from './editor';

export type { DiffEditorProps, IDiffEditorInstance } from './diff';

export type {
    ICustomCompletionItem,
    ICustomCompletionItemsCreator,
    ISyntaxContext,
    ICompleteProvideFunc,
} from './utils';

export { language as basicPythonLanguageConf } from './languages/dt-python/python';

export {
    customCompletionItemsCreator,
    commonFileEditDelegator,
    delayFunctionWrap,
} from './utils';

export { default as DiffEditor } from './diff';

export default Editor;
