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
        student_index: './src/student_index.js',
        student_module: './src/student_module.js',
        student_exam: './src/student_exam.js',
        global: './src/global.js',
        student: './src/student.js',
        account: './src/account.js',
        lecturer_index: './src/lecturer_index.js',
        lecturer_module: './src/lecturer_module.js',
        lecturer_add_exam: './src/lecturer_add_exam.js',
        lecturer_exam: './src/lecturer_exam.js',
        lecturer_add_course: './src/lecturer_add_course.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundles/[name].bundle.js'
    },
    watch: true
}