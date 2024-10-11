const siteRoute = require('./site');
function route(app){    
    app.use('/', siteRoute);
}

module.exports = route;