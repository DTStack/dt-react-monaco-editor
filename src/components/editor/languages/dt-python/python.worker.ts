import {ParserPython2} from 'dt-python-parser';

const ctx: Worker = self as any;

console.log('*****dtsql-worker初始化*****')

ctx.onmessage = (e: any) => {
    const message = e.data;
    // console.log('消息来源',message,ParserPython2)
    const { eventId, data = [], type } = message;
        ctx.postMessage({
            eventId: eventId,
            result: ParserPython2(data)
        })

}

console.log('*****dtsql-worker初始化完成*****')
// Trickery to fix TypeScript since this will be done by "worker-loader"
// eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
export default {} as typeof Worker & (new () => Worker);
