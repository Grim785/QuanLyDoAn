const studentRoute = require('./student');
const advisorRoute = require('./advisor');
const adminRoute = require('./admin');
const loginRoute = require('./login');
function route(app){  
    app.use('/student', studentRoute);
    app.use('/advisor', advisorRoute);
    app.use('/admin', adminRoute);
    app.use('/', loginRoute);
    
}

module.exports = route;