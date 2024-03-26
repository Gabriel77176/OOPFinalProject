const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        admin: './src/admin.js',
        seeddata: './src/seeddata.js',
        login: './src/login.js',
        admin_create_account: './src/admin_create_account.js',
        admin_create_module: './src/admin_create_module.js',
        admin_create_class: './src/admin_create_class.js',
        admin_add_teacher_module: './src/admin_add_teacher_module.js',
        admin_add_class_module: './src/admin_add_class_module.js',
        student: './src/student.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundles/[name].bundle.js'
    },
    watch: true
}