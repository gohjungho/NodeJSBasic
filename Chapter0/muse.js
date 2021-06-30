// M = {
//     v: 'v', 
//     f:function() {
//         console.log(this.v);
//     }
// }

// M.f();

var part = require('./mpart.js');
// console.log(part);   // { v: 'v', f: [Function: f] }
part.f();   // v 