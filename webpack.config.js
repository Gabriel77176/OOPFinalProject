const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        script: './src/script.js',
        admin: './src/admin.js',
        seeddata: './src/seeddata.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundles/[name].bundle.js'
    },
    watch: true
}