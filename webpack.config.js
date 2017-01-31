module.exports = {
    entry: ['./src/index.js'],
    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'dist/bundle.js'
    },
    module: {
        loaders: [
            {
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-1']
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.js']
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './'
    }
};
