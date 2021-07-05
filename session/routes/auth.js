var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

var authData = {
    email: 'ego@gamil.com',
    password: '111111',
    nickname: 'egoing'
}

router.get('/login', function(requst, response) {
    var title = 'WEB - login';
            var list = template.list(request.list);
            var html = template.HTML(title, list, `
                <form action="/auth/login_process" method="post">
                    <p><input type="text" name="email" placeholder="email"></p>
                    <p><input type="password" name="pwd" placeholder="password"></p>
                    <p>
                        <input type="submit" value="login">
                    </p>
                </form>
            `, '');
            response.writeHead(200);
            response.end(html);
})

router.post('/login_process', function (request, response) {
    var post = request.body;
    var email = post.email;
    var password = post.pwd;
    if(email === authData.email && password === authData.password) {
        response.send('Welcome!');
    } else {
        response.send('Who?');
    }
    // response.redirect(`/topic/${title}`);
})

module.exports = router;
