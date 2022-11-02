export * from './autoComplete'
export * from './parser-types'
export * from './editorEventUtils'

export function jsonEqual (newJson: any, oldJson: any) {
    if (newJson == oldJson) {
        return true;
    }
    const newStr = JSON.stringify(newJson);
    const oldStr = JSON.stringify(oldJson);
    if (newStr == oldStr) {
        return true;
    }
    return false;
}
