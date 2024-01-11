import * as React from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import { defaultOptions } from './config';
import type { MonacoEditorProps } from './types';

class MonacoEditor extends React.Component<MonacoEditorProps> {
    constructor(props) {
        super(props);
    }

    editor: monaco.editor.IStandaloneCodeEditor = null;
    private monacoDom = React.createRef<HTMLDivElement>();
    private __prevent_onChange = false;
    private _changeSubscription: monaco.IDisposable;
    private _selectionSubscription: monaco.IDisposable;
    private _focusSubscription: monaco.IDisposable;
    private _blurSubscription: monaco.IDisposable;
    private _contextSubscription: monaco.IDisposable;

    componentDidMount() {
        this.initMonaco();
        /**
         * @deprecated editorInstanceRef will be removed in a future release
         */
        if (typeof this.props.editorInstanceRef === 'function') {
            this.props.editorInstanceRef(this.editor);
        }
    }

    componentDidUpdate(prevProps) {
        const { language, theme, options, sync } = this.props;
        if (
            this.props.value != null &&
            this.props.value !== this.editor.getValue() &&
            sync
        ) {
            this.__prevent_onChange = true;
            this.editor.updateOptions({ readOnly: false });
            this.editor.pushUndoStop();
            this.editor.executeEdits('sync-value', [
                {
                    range: this.editor.getModel().getFullModelRange(),
                    text: this.props.value,
                    forceMoveMarkers: true,
                },
            ]);
            this.editor.pushUndoStop();
            this.editor.updateOptions({ ...options });
            this.__prevent_onChange = false;
        }
        if (prevProps.language !== language) {
            monaco.editor.setModelLanguage(this.editor.getModel(), language);
        }
        if (prevProps.theme !== theme) {
            monaco.editor.setTheme(theme);
        }
        if (prevProps.options !== options) {
            this.editor.updateOptions({
                ...options,
            });
        }
    }

    componentWillUnmount() {
        this.props.editorWillUnMount?.(this.editor);
        this.destroyMonaco();
    }

    initMonaco() {
        const { value, language, options, theme } = this.props;
        if (!this.monacoDom.current) {
            console.error('Can not get monacoDom element!');
            return;
        }

        this.props.editorWillMount?.();
        const editorOptions: monaco.editor.IStandaloneEditorConstructionOptions =
            {
                ...defaultOptions,
                ...options,
                value,
                language: language || 'sql',
                theme,
            };
        this.editor = monaco.editor.create(
            this.monacoDom.current,
            editorOptions
        );
        this.initEditorEvent();
        this.props.editorDidMount?.(this.editor);
    }

    initEditorEvent() {
        this._changeSubscription = this.editor.onDidChangeModelContent(
            (event) => {
                const { onChange } = this.props;
                const newValue = this.editor.getValue();
                if (!this.__prevent_onChange && this.props.onChange) {
                    onChange(newValue, event);
                }
            }
        );

        this._selectionSubscription = this.editor.onDidChangeCursorSelection(
            (event) => {
                const { onCursorSelection } = this.props;
                const ranges = this.editor.getSelections();
                const model = this.editor.getModel();
                const content: string = ranges.reduce((prev, cur) => {
                    return prev + model.getValueInRange(cur);
                }, '');

                onCursorSelection?.(content, event);
            }
        );

        this._focusSubscription = this.editor.onDidFocusEditorText(() => {
            this.props.onFocus?.(this.editor.getValue());
        });

        this._blurSubscription = this.editor.onDidBlurEditorText(() => {
            this.props.onBlur?.(this.editor.getValue());
        });

        /**
         * Set contextMenu dom position to fixed
         * to avoid the contextMenu being truncated by "overflow: hidden"
         */
        this._contextSubscription = this.editor.onContextMenu((e) => {
            const contextMenuElement = this.editor
                .getDomNode()
                .querySelector<HTMLElement>('.monaco-menu-container');

            if (contextMenuElement) {
                const posY =
                    e.event.posy + contextMenuElement.clientHeight >
                    window.innerHeight
                        ? e.event.posy - contextMenuElement.clientHeight
                        : e.event.posy;

                const posX =
                    e.event.posx + contextMenuElement.clientWidth >
                    window.innerWidth
                        ? e.event.posx - contextMenuElement.clientWidth
                        : e.event.posx;

                contextMenuElement.style.position = 'fixed';
                contextMenuElement.style.top =
                    Math.max(0, Math.floor(posY)) + 'px';
                contextMenuElement.style.left =
                    Math.max(0, Math.floor(posX)) + 'px';
            }
        });
    }

    destroyMonaco() {
        if (this.editor) {
            this.editor?.dispose();
            this._blurSubscription?.dispose();
            this._focusSubscription?.dispose();
            this._changeSubscription?.dispose();
            this._selectionSubscription?.dispose();
            this._contextSubscription?.dispose();
        }
    }

    render() {
        const { className, style } = this.props;
        const renderClass = `react-monaco-editor-container ${className ?? ''}`;
        const renderStyle: React.CSSProperties = {
            height: '100%',
            width: '100%',
            ...(style ?? {}),
        };

        return (
            <div
                className={renderClass}
                style={renderStyle}
                ref={this.monacoDom}
            />
        );
    }
}
export default MonacoEditor;
