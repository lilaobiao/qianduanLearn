

// import React from 'react';
// import {render} from 'react-dom';
// render(<h1>jsx</h1>,window.root); // root是id






// let button = document.createElement('button');
// button.innerHTML = 'hello';


// // vue的懒加 react懒加载
// button.addEventListener('click',function () {
//   // es6 草案中的语法 jsonp实现动态加载文件
//   import('./source.js').then(data=>{
//     console.log(data.default);
//   })
// });
// document.body.appendChild(button);

import str from './source';
console.log(str);
if(module.hot){ // 如果模块支持热更新
  module.hot.accept('./source',()=>{
    console.log('文件更新了')
    // let str = require('./source')
    // console.log(str);
  })
}