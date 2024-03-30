const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        admin: './src/admin.js',
        seeddata: './src/seeddata.js',
        login: './src/login.js',
        admin_index: './src/admin_index.js',
        admin_classes: './src/admin_classes.js',
        admin_create_account: './src/admin_create_account.js',
        admin_create_student: './src/admin_create_student.js',
        admin_create_lecturer: './src/admin_create_lecturer.js',
        admin_create_module: './src/admin_create_module.js',
        admin_create_class: './src/admin_create_class.js',
        admin_add_teacher_module: './src/admin_add_teacher_module.js',
        admin_add_class_module: './src/admin_add_class_module.js',
        admin_global: './src/admin_global.js',
        admin_lecturers: './src/admin_lecturers.js',
        admin_modules: './src/admin_modules.js',
        global: './src/global.js',
        student: './src/student.js',
        account: './src/account.js',
        lecturer_index: './src/lecturer_index.js',
        lecturer_module: './src/lecturer_module.js',
        lecturer_add_exam: './src/lecturer_add_exam.js',
        lecturer_exam: './src/lecturer_exam.js',
        lecturer_add_course: './src/lecturer_add_course.js',
        lecturer_course: './src/lecturer_course.js',
        lecturer_global: './src/lecturer_global.js',
        student_index: './src/student_index.js',
        student_module: './src/student_module.js',
        student_exam: './src/student_exam.js',
        student_global: './src/student_global.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundles/[name].bundle.js'
    },
    watch: true
}