const studentRoute = require('./student');
const advisorRoute = require('./advisor');
const adminRoute = require('./admin');
const projectRoute = require('./project');
const siteRoute = require('./site');
function route(app){  
    app.use('/student', studentRoute);
    app.use('/advisor', advisorRoute);
    app.use('/admin', adminRoute);
    app.use('/project', projectRoute);
    app.use('/', siteRoute);
    
}

module.exports = route;