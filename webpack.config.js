module.exports = {
    entry: __dirname + '/playground/index.jsx',
    output: {
        path: __dirname + '/dist',
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ['transform-class-properties']
                }
            },
            {
                test: /.json$/,
                loader: 'json'
            }
        ]
    },
    node: {
        fs: 'empty',
        module: 'empty',
        'net': 'empty'
    }
};