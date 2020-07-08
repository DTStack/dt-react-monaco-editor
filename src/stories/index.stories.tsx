import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Editor from '../components/editor';

const stories = storiesOf('Editor 编辑器', module);
stories.add('Editor', () => {
    return (
        <div className='story_wrapper'>
            <h2>何时使用</h2>
            <p>页面需使用编辑器时</p>
            <h2>示例</h2>
            <Editor
                language="dtsql"
                options={{ readOnly: false }}
            />
        </div>
    )
}, {
    info: {
        text: `
        代码示例：
        ~~~js
        ~~~
        `
    }
})
