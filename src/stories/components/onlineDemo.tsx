import * as React from 'react';
import { Select } from 'antd';
import Editor from '../../components/editor';
const { Option } = Select;
class OnlineDemo extends React.Component<any, any> {
    state: any = {
        language: 'dtsql'
    }
    onChange = (val: any) => {
        this.setState({
            language: val
        });
    }
    render () {
        const { language } = this.state;
        const dataSource = [
            'dtsql', 'dtflink', 'dtPython2', 'dtPython3', 'shell', 'dtlog'
        ]
        return (
            <>
            <Select
                placeholder="请选择语言种类"
                onChange={(val: any) => this.onChange(val)}
                style={{ width: '200px', marginBottom: 20 }}
            >
                {
                    dataSource.map((item: any) => {
                        return (<Option key={item} value={item}>{item}</Option>)
                    })
                }
            </Select>
            {language === 'dtsql' && (
                <Editor
                    value='// dtsql'
                    language='dtsql'
                    options={{ readOnly: false }}
                />
            )}
            {language === 'dtflink' && (
                <Editor
                    value='// dtflink'
                    language='dtflink'
                    options={{ readOnly: false }}
                />
            )}
            {language === 'dtPython2' && (
                <Editor
                    value='// dtPython2'
                    language='dtPython2'
                    options={{ readOnly: false }}
                />
            )}
            {language === 'dtPython3' && (
                <Editor
                    value='// dtPython3'
                    language='dtPython3'
                    options={{ readOnly: false }}
                />
            )}
            {language === 'shell' && (
                <Editor
                    value='// shell'
                    language='shell'
                    options={{ readOnly: false }}
                />
            )}
            {language === 'dtlog' && (
                <Editor
                    value='// dtlog'
                    language='dtlog'
                    options={{ readOnly: false }}
                />
            )}
            </>
        )
    }
}
export default OnlineDemo;
