// webpack打包我们的图片
// 1) 在js中创建图片来引入
// file-loader 默认会在内部生成一张图片 到build目录下
// 把生成的图片的名字返回回来
import './index.css';
import logo from './logo.png'; // 把图片引入，返回的结果是一个新的图片地址
let image = new Image();
console.log(logo)
image.src = logo; // 就是一个普通的字符串
document.body.appendChild(image);
// 2) 在css引入 backgroun('url')
// 3) <img src="" alt=""/>


// pre 前面执行的loader  normal 普通loader  内联loader  后置 postloader


// 1) expose-loader 暴漏到window上， 暴露全局的loader  内联的loader
// import $ from 'jquery'; // 这样引入的jquery通过window.$访问不到
// import $ from 'expose-loader?$!jquery';  // 通过内联 loader, 可访问到window.$


// 2) providePlugin 给每个模块提供一个$
// import $ from 'jquery'; // 每个模块都要引入，变得麻烦，如何才能不引入
// console.log($); // 在每个模块中注入 $对象




// 3) 引入不打包


// let str = require('./a.js');

// console.log(str+'1');

// require('./index.css');

// require('./index.less');

// let fn = () =>{
//   console.log('log')
// }
// fn();

// @log
// class A{ // new A() a = 1
//   a = 1;
// }
// let a = new A();
// console.log(a.a);

// function log(target) {
//   console.log(target);
// }


// import logo from './logo.png' // 返回的是一个新的地址
// console.log(logo)
// let IMG = new Image()
// IMG.src = logo