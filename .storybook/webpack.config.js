
const webpack = require('webpack');
const path = require('path');
const ROOT_PATH = path.resolve(__dirname, '../');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const monacoConfig = require('./monacoConfig');
module.exports = async ({ config, mode }) => {
    config.module.rules.push({
        test: /\.worker.[jt]s$/,
        exclude: [
            path.resolve(ROOT_PATH, "node_modules")
        ],
        use: {
            loader: 'worker-loader',
            options: {
                name: '[name]:[hash:8].js',// 打包后chunk的名称
                inline: true, // 开启内联模式,免得爆缺少标签或者跨域的错误
            }
        }
    }, {
        test: /\.(ts|tsx)$/,
        loader: require.resolve('babel-loader'),
        options: {
            presets: [['react-app', { flow: false, typescript: true }]],
            plugins: [
                ['import', { libraryName: "antd", style: true }]
            ]
        }
    }, {
        test: /\.stories\.(j|t)sx?$/,
        loaders: [require.resolve('@storybook/addon-storysource/loader')],
        enforce: 'pre',
    }, {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../'),
    }, {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', {
            loader: "less-loader",
            options: {
                javascriptEnabled: true
            }
        }],
        include: [/[\\/]node_modules[\\/].*antd/],
    }, {
        test: /\.(jpg|png|gif)$/,
        loader: ["file-loader", "url-loader?limit=100000"]
    }, {
        test: /\.(eot|woff|svg|ttf|woff2|gif|appcache|webp)(\?|$)/,
        loader: [
            "file-loader?name=[name].[ext]",
            "url-loader?limit=100000"
        ]
    });
    config.entry.app= './src/index.tsx';
    // config.entry['editor.worker']= 'monaco-editor/esm/vs/editor/editor.worker.js';
    // config.entry['json.worker']= 'monaco-editor/esm/vs/language/json/json.worker';
    // config.entry['css.worker']= 'monaco-editor/esm/vs/language/css/css.worker';
    // config.entry['html.worker']= 'monaco-editor/esm/vs/language/html/html.worker';
    // config.entry['ts.worker']= 'monaco-editor/esm/vs/language/typescript/ts.worker';
    config.output.globalObject = 'self';
    config.resolve = {
        modules: ["node_modules"],
        extensions: [".ts", ".tsx", ".js", ".jsx", ".scss", ".css"], //后缀名自动补全
        alias: {}
    },
    config.node = {
        fs: 'empty',
        module: "empty",
    };
    config.plugins.push(
        new webpack.HashedModuleIdsPlugin(),
        new webpack.ContextReplacementPlugin(
        /monaco-editor(\\|\/)esm(\\|\/)vs(\\|\/)editor(\\|\/)common(\\|\/)services/,
        __dirname
        ),
        new MonacoWebpackPlugin({
            features: monacoConfig.features,
            languages: monacoConfig.languages
        })
    );
    // Return the altered config
    return config;
};