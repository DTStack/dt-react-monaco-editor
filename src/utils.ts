import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const commandEvent: any = {
    OPEN_COMMAND_LINE: 'editor.action.quickCommand',
    OPEN_FIND_TOOL: 'actions.find',
    OPEN_REPLACE_TOOL: 'editor.action.startFindReplaceAction',
};

export const commandKeys = {
    find: 'find',
    replace: 'replace',
    commandPane: 'commandPane',
};

/**
 * monaco editor command trigger delegator
 * @param {IStandaloneCodeEditor} editor editor instance
 */
export function commandDelegator(editor: monaco.editor.IStandaloneCodeEditor) {
    return function (key: string) {
        switch (key) {
            case commandKeys.find: {
                editor.trigger('anyString', commandEvent.OPEN_FIND_TOOL, {});
                return;
            }
            case commandKeys.replace: {
                editor.trigger('anyString', commandEvent.OPEN_REPLACE_TOOL, {});
                return;
            }
            case commandKeys.commandPane: {
                editor.focus();
                editor.trigger('anyString', commandEvent.OPEN_COMMAND_LINE, {});
            }
        }
    };
}
