
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var bodyParser = require('body-parser');
var compression = require('compression');
var express = require('express'); // express 기능 불러오기
var app = express()
var port = 3001 // 포트번호 지정 
var helmet = require('helmet');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(compression());
app.use(express.static('public'));


app.get('/', function(request, response) { 
    // app.get(path, callback [, callback .. ])
    // 익숙한 함수형태로 변경 
    fs.readdir('./data', function(error, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}
            <img src="/images/hello.jpg" style="width:300px; display:block; margin-top:10px;">
            `,
            `<a href="/create">create</a>`
        );
        response.send(html);
    });
});

app.get('/page/:pageId', function(request, response) { 
    fs.readdir('./data', function(error, filelist) {
        var filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
            var title = request.params.pageId;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
                allowedTags:['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
                `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                `<a href="/create">create</a>
                    <a href="/update/${sanitizedTitle}">update</a>
                    <form action="/delete_process" method="post">
                        <input type="hidden" name="id" value="${sanitizedTitle}">
                        <input type="submit" value="delete">
                    </form>`
            );
            response.send(html);
        });
    });
});

app.get('/create', function(request, response) { 
    fs.readdir('./data', function(error, filelist) {
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.HTML(title, list,
            `
            <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `, ''
        );
        response.send(html);
    });
});

app.post('/create_process', function(request, response) { 
    // var body = '';
    // request.on('data', function(data) {
    //     body = body + data;
    // });
    // request.on('end', function() {
    //     var post = qs.parse(body);

    // body-parser 사용으로 아래 한 줄로 대체
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
        response.writeHead(302, {Location: `/page/${title}`});
        response.end();
    });
    // });
});

app.get('/update/:pageId', function(request, response) { 
    fs.readdir('./data', function(error, filelist) {
        var filteredId = path.parse(request.params.pageId).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
            var title = request.params.pageId;
            var list = template.list(filelist);
            var html = template.HTML(title, list,
                `
                <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update/${title}">update</a>`
            );
            response.send(html);
        });
    });
});

app.post('/update_process', function(request, response) { 
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs. rename(`data/${id}`, `data/${title}`, function(error) {
        fs.writeFile(`data/${title}`, description, 'utf8', function(err) {
            response.writeHead(302, {Location: `/page/${title}`});
            response.end();
        });
    });
});

app.post('/delete_process', function(request, response) { 
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs. unlink(`data/${filteredId}`, function(error) {
        response.redirect('/');
    });
});

app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})