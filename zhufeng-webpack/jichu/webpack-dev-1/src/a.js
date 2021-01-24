module.exports = 'zfpx';

// 高级语法补丁包，需安装@babel/polyfill，比如数组的includes
require('@babel/polyfill');
class B{
  
}

function * gen(params) {
  yield 1;
}
console.log(gen().next());


'aaa'.includes('a');