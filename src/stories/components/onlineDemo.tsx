import * as React from 'react';
import { Select } from 'antd';
import Editor from '../../components/editor';
import { sqlText, flinkText, python3Text, python2Text, jsonText } from './const'
import GreenPlumEditor from './dtGreenPlumEditor';

const { Option } = Select;
class OnlineDemo extends React.Component<any, any> {
    state: any = {
        language: 'dtGreenPlum'
    }
    onChange = (val: any) => {
        this.setState({
            language: val
        });
    }
    render () {
        const { language } = this.state;
        const dataSource = [
            'dtsql', 'dtflink', 'dtPython2', 'dtPython3', 'json', 'shell', 'dtlog', 'dtGreenPlum'
        ]
        return (
            <>
            <Select
                placeholder="请选择语言种类"
                onChange={(val: any) => this.onChange(val)}
                style={{ width: '200px', marginBottom: 20 }}
                value={language}
            >
                {
                    dataSource.map((item: any) => {
                        return (<Option key={item} value={item}>{item}</Option>)
                    })
                }
            </Select>
            {language === 'dtGreenPlum' && (
                <GreenPlumEditor/>
            )
            }
            {language === 'dtsql' && (
                <Editor
                    value={sqlText}
                    language='dtsql'
                    options={{ readOnly: false }}
                />
            )}
            {language === 'dtflink' && (
                <Editor
                    value={flinkText}
                    language='dtflink'
                    options={{ readOnly: false }}
                />
            )}
            {language === 'dtPython2' && (
                <Editor
                    value={python2Text}
                    language='dtPython2'
                    options={{ readOnly: false }}
                />
            )}
            {language === 'dtPython3' && (
                <Editor
                    value={python3Text}
                    language='dtPython3'
                    options={{ readOnly: false }}
                />
            )}
            {
                language === 'json' && (
                    <Editor
                        value={jsonText}
                        language='json'
                        options={{ readOnly: false }}
                    />
                )
            }
            {language === 'shell' && (
                <Editor
                    value=' shell功能完善中，敬请期待'
                    language='shell'
                    options={{ readOnly: false }}
                />
            )}
            {language === 'dtlog' && (
                <Editor
                    value=' dtlog功能完善中，敬请期待'
                    language='dtlog'
                    options={{ readOnly: false }}
                />
            )}
            </>
        )
    }
}
export default OnlineDemo;
