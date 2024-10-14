const siteRoute = require('./site');
const studentRoute = require('./student');
const advisorRoute = require('./advisor');
const adminRoute = require('./admin');
function route(app){    
    app.use('/', siteRoute);
    app.use('/student', studentRoute);
    app.use('/advisor', advisorRoute);
    app.use('/admin', adminRoute);
}

module.exports = route;