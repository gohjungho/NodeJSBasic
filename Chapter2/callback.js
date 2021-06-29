// callback 함수 
// function a() {
//     console.log('A');
// }
// a();


// 익명함수 
// var a = function () {
//     console.log('A');
// }
// a();


var a = function () {
    console.log('A');
}

function slowfunc(callback) {
    callback();
}

slowfunc(a);