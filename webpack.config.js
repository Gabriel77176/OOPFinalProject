const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        admin: './src/admin.js',
        seeddata: './src/seeddata.js',
        login: './src/login.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundles/[name].bundle.js'
    },
    watch: true
}