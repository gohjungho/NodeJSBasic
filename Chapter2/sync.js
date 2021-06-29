var fs = require('fs') // 자바, 파이썬의 import와 같은 역할

// 동기식 
// console.log('A')
// var result = fs.readFileSync('sample.txt','utf8');
// console.log(result);
// console.log('C')

// 비동기식 
console.log('A')
fs.readFile('sample.txt','utf8', function(err, result) {
    console.log(result);
});
console.log('C')