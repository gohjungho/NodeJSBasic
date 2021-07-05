var express = require('express');
var parseurl = require('parseurl');
var session = require('express-session');
var Filestore = require('session-file-store')(session);
// var indexRouter = require('./routes/index');
// var topicRouter = require('./routes/topic');

var app = express();

// app.use('/', indexRouter);
// app.use('/topic', topicRouter);

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store:new Filestore()
}));

// app.use(function(req, res, next) {
//     if (!req.session.views) {
//         req.session.views = {};
//     }

//     // get the url pathname
//     var pathname = parseurl(req).pathname;

//     // count the views
//     req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

//     next();
// });

// app.get('/foo', function(req, res, next) {
//     res.send('you viewed this page ' + req.session.views['/foo'] + ' times');
// });

// app.get('/bar', function(req, res, next) {
//     res.send('you viewed this page ' + req.session.views['/bar'] + ' times');
// });

app.get('/', function(req, res, next) {
    console.log(req.session);
    if(req.session.num === undefined) {
        req.session.num = 1;
    } else {
        req.session.num = req.session.num + 1;
    }
    res.send(`Views : ${req.session.num}`);
})

app.listen(3000, function() {
    console.log('3000!');
});
