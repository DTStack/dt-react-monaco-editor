/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *-------------------------------------------------------------------------------------------- */

import { registerLanguage } from 'monaco-editor/esm/vs/basic-languages/_.contribution';
import { registeCompleteItemsProvider, disposeProvider, onChange } from './simpleComplete';

declare var monaco: any;
declare var self: any;
// Allow for running under nodejs/requirejs in tests
var _monaco = typeof monaco === 'undefined' ? self.monaco : monaco;

registerLanguage({
    id: 'dtPython2',
    extensions: ['.py', '.rpy', '.pyw', '.cpy', '.gyp', '.gypi'],
    aliases: ['Python', 'py'],
    firstLine: '^#!/.*\\bpython[0-9.-]*\\b',
    loader: function () { return _monaco.Promise.wrap(import('./python')); }
});

registerLanguage({
    id: 'dtPython3',
    extensions: ['.py', '.rpy', '.pyw', '.cpy', '.gyp', '.gypi'],
    aliases: ['Python', 'py'],
    firstLine: '^#!/.*\\bpython[0-9.-]*\\b',
    loader: function () { return _monaco.Promise.wrap(import('./python')); }
});
export { registeCompleteItemsProvider, disposeProvider, onChange };
