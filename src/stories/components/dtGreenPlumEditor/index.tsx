import * as React from 'react';
import { Menu } from 'antd';
import Editor, { basicGreenPlumLanguageConf, EditorProps, ICustomCompletionItem } from '../../../components/editor';
import { commonFileEditDelegator } from '../../../components/editor/utils';
import { greenPlumSqlText, currentSchemaTableColumnMap, schemaTableColumnMap } from '../const'

class GreenPlumEditor extends React.Component<any, any> {
    _editor: any;

    /**
     * editor onchange 事件订阅
     * @param newVal
     * @param editorInstance
     */
    handleEditorTxtChange = (newVal: any, editorInstance: any) => {
        // console.log(newVal);
    };

    getCurrentSchemaTables = (): ICustomCompletionItem[] => {
        return currentSchemaTableColumnMap.map((table) => {
            const tableName: string = table[0];
            return {
                name: tableName,
                detail: '当前schema表',
                type: 'Field',
                sortIndex: '2200',
                options: {
                    insertAsSnippet: false,
                    autoBracketsForFunction: false
                }
            };
        });
    };

    getGpFunctionList = (): ICustomCompletionItem[] => {
        return basicGreenPlumLanguageConf.builtinFunctions.map(fnName => {
            return {
                name: fnName,
                detail: 'greenplum内置函数',
                type: 'Function',
                sortIndex: '2200',
                options: {
                    insertAsSnippet: false,
                    autoBracketsForFunction: false
                }
            };
        })
    }

    completeProvider: EditorProps['customCompleteProvider'] = (
        builtInCompleteItems,
        resolve,
        customCompletionItemsCreator,
        syntaxContext
    ) => {
        const { context, autoComplete } = syntaxContext;

        const currentSchemaTableComItems = this.getCurrentSchemaTables();
        const gpFnCompleteList = this.getGpFunctionList()

        let basicCompleteItems = builtInCompleteItems
            .concat(customCompletionItemsCreator(gpFnCompleteList))
            .concat(customCompletionItemsCreator(currentSchemaTableComItems));

        if (context.completionContext.triggerCharacter == '.') {
            basicCompleteItems = []
        }

        if (context.tableContext) {
            const schema = context.tableContext;
            const tableNames = schemaTableColumnMap.filter(map => map[0] === schema)
                .map(([_, tableName]) => tableName)
            console.log(tableNames);
            basicCompleteItems = basicCompleteItems.concat(
                customCompletionItemsCreator(
                    tableNames.map((tableName) => {
                        return [tableName, `${schema}项目表`, '1000', 'Field'];
                    })
                )
            );
            resolve(basicCompleteItems)
            return
        }

        if (autoComplete && autoComplete.locations) {
            const tablesInSql = autoComplete.locations
                .filter(({ type }) => type === 'table')
                .map((location) => location.identifierChain.map((chain) => chain.name));

            const allColumnsCompleteItems: ICustomCompletionItem[] = tablesInSql.reduce(
                (prev: ICustomCompletionItem[], cur) => {
                    const tableName = cur.join('.');
                    const columns = schemaTableColumnMap.find(([schema, table]) => `${schema}.${table}` === tableName)?.[2] ?? []
                    const tmpCompleteItems: ICustomCompletionItem[] = columns.map(
                        (columnName) => {
                            return {
                                name: columnName,
                                detail: `${tableName}表字段`,
                                type: 'Variable',
                                sortIndex: '1100',
                                options: {
                                    insertAsSnippet: false,
                                    autoBracketsForFunction: false
                                }
                            };
                        }
                    );
                    return [...prev, ...tmpCompleteItems];
                },
                []
            );

            let contextColumnCompleteItems: ICustomCompletionItem[] = [];
            if (context.columnContext?.length) {
                const tableName = context.columnContext[0];
                const columns = schemaTableColumnMap.find(([schema, table]) => `${schema}.${table}` === tableName)?.[2] ?? []
                contextColumnCompleteItems = columns.map((columnName) => {
                    return {
                        name: columnName,
                        detail: `${tableName}表字段`,
                        type: 'Variable',
                        sortIndex: '100',
                        options: {
                            insertAsSnippet: false,
                            autoBracketsForFunction: false
                        }
                    };
                });
            }
            if (context.completionContext.triggerCharacter == '.') {
                resolve(customCompletionItemsCreator(contextColumnCompleteItems));
            } else {
                resolve(
                    basicCompleteItems.concat(customCompletionItemsCreator(allColumnsCompleteItems))
                );
            }
            return
        }
        resolve(basicCompleteItems);
    };

    render () {
        return (
            <div>
                <Menu
                    onClick={({ key }) => {
                        commonFileEditDelegator(this._editor)(key);
                    }}
                >
                    <Menu.Item key="find">查找（Cmd/Ctrl）+ F</Menu.Item>
                    <Menu.Item key="replace">替换（Cmd/Ctrl）+ F</Menu.Item>
                    <Menu.Item key="undo">回撤（Cmd/Ctrl）+ Z</Menu.Item>
                    <Menu.Item key="commandPane">命令面板 (F1)</Menu.Item>
                </Menu>
                <Editor
                    value={greenPlumSqlText}
                    language="dtGreenPlum"
                    customCompleteProvider={this.completeProvider}
                    onChange={this.handleEditorTxtChange}
                    editorInstanceRef={(editorIns) => {
                        this._editor = editorIns;
                    }}
                />
            </div>
        );
    }
}

export default GreenPlumEditor;
