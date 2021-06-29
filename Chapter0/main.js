var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body) {
    // html의 내용을 템플릿 리터럴로 작성 
    return `
    <!doctype html>
    <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            ${body}
        </body>
    </html>
    `;
}

function templateList(filelist) {
    var list = '<ul>';
    var i = 0;
    while (i < filelist.length) {
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
    }
    list = list + '</ul>';
    return list;
}


var app = http.createServer(function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url,true).pathname;
    var title = queryData.id; // 요청받은 쿼리 스트림 중 id값을 title 변수에 할당

    // console.log(url.parse(_url, true));

    if(pathname === '/') { // 홈이면 
        if(queryData.id === undefined) { // fs.readFile 부분을 그대로 복사해 붙여 넣는다.
            fs.readdir('./data', function(error, filelist) {
                var title = 'Welcome';
                var description = 'Hello, Node.js';

                // 위에 선언한 함수 가져다 사용 
                var list = templateList(filelist);
                var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
                
                response.writeHead(200);
                response.end(template); // template 문자열 응답 
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
                    var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
                    response.writeHead(200);
                    response.end(template);
            
                });
            });
        }
    } else {
            response.writeHead(404);
            response.end('Not found');
        }
    });

app.listen(3000);