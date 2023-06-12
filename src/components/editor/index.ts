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

export { language as basicGreenPlumLanguageConf } from './languages/dt-greenplum/greenplum';
export { language as basicFlinkLanguageConf } from './languages/dt-flink/dtflink';
export { language as basicPythonLanguageConf } from './languages/dt-python/python';
export { language as basicDtSqlLanguageConf } from './languages/dtsql/dtsql';

export {
    customCompletionItemsCreator,
    commonFileEditDelegator,
    delayFunctionWrap,
} from './utils';

export { default as DiffEditor } from './diff';

export default Editor;
