var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var template = require('./lib/template.js');


var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    var title = queryData.id; // 요청받은 쿼리 스트림 중 id값을 title 변수에 할당

    // console.log(url.parse(_url, true));

    if(pathname === '/') { // 홈이면 
        if(queryData.id === undefined) { // fs.readFile 부분을 그대로 복사해 붙여 넣는다.
            fs.readdir('./data', function(error, filelist) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';

                // 위에 선언한 함수 가져다 사용 
                var list = template.list(filelist);
                var html = template.HTML(title, list, 
                    `<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create">create</a>` 
                    );
                
                response.writeHead(200);
                response.end(html); // template 문자열 응답 
                // console.log(__dirname + url); // 웹 브라우저가 요청한 파일의 경로를 콘솔에 출력
                // response.end('egoing : ' + url);
                // response.end(fs.readFileSync(__dirname + _url));
            });
                
        } else { // 홈이 아닐 때 
            fs.readdir('./data', function(error, filelist) {
                // 위에 선언한 함수 가져다 사용 
                var list = templateList(filelist);

                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                    var title = queryData.id; // 쿼리 스트링에서 제목 가져오기
                    
                    // 위에 선언한 함수 가져다 사용 
                    var list = template.list(filelist);
                    var html = template.HTML(title, list, 
                        `<h2>${title}</h2><p>${description}</p>`,
                        `
                        <a href="/create">create</a>
                        <a href="/update?id=${title}">update</a>
                        <form action="delete_process" method="post">
                            <input type="hidden" name="id" value=${title}">
                            <input type="submit" value="delete">
                        </form>
                        `
                    );
                    response.writeHead(200);
                    response.end(html);
            
                });
            });
        } 
    } else if (pathname === '/create') {
        // 이곳에 글 생성 화면을 구현
        fs.readdir('./data', function(error, filelist) {
            var title = 'WEB - create';

            // 위에 선언한 함수 가져다 사용 
            var list = template.list(filelist);
            var html = template.HTML(title, list, 
                `
                <form action="/create_process" method="post">

                    <input type="hidden" name="id" value="${title}>
                    <p><input type="text" name="title" placeholder="제목을 입력하세요" value="${title}"></p>
                    <p>
                        <textarea name="description" placeholder="내용을 입력하세요" value="${title}"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
        
                </form>
            `, '');
            response.writeHead(200);
            response.end(html);
        }); // 괄호 위치가 이상함 (그러나 없으면 에러 발생)

    } else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            var title = post.title;
            var description = post.descripton;
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
        });
    });

    } else if (pathname === '/update') {
        fs.readdir('./data', function(error, filelist) {
            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description) {
                var title = queryData.id; // 쿼리 스트링에서 제목 가져오기
                var list = template.list(filelist);
                var html = template.HTML(title, list, 
                    `
                    <form action="/update_process" method="post">
                        <p><input type="text" name="title" placeholder="title" value=${title}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,   
                    `<a href="/create">create</a> <a href="/update?${title}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            
                });
            });

    } else if (pathname === '/update_process') {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.descripton;
            fs.rename(`data/${id}`, `data/${title}`, function(error) {
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
        });

    } else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', function(data) {
            body = body + data;
        });
        request.on('end', function() {
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, function(error) {
                response.writeHead(302, {Location: `/`});
                response.end();
            })
        });

    } else {
            response.writeHead(404);
            response.end('Not found');
        }
    });

app.listen(3000);