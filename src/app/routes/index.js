const loginRoute = require('./login');
const studentRoute = require('./student');
const advisorRoute = require('./advisor');
const adminRoute = require('./admin');
function route(app){  
    app.use('/', loginRoute);
    app.use('/student', studentRoute);
    app.use('/advisor', advisorRoute);
    app.use('/admin', adminRoute);
    
}

module.exports = route;