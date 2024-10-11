const siteRoute = require('./site');
const loginRoute = require('./login');
function route(app){
    app.use('/login',loginRoute);
    app.use('/', siteRoute);
}

module.exports = route;