let { AsyncParallelHook } = require('tapable');
// 异步的钩子（串行）并行，需要等待所有并发的异步事件执行完成后再执行回调

// tap 注册同步方法，tapAsyns 注册异步方法
// 原理，每次有方法执行完都检查一遍计数器，只有技术器跟注册的方法个数一样才算执行完成
class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncParallelHook(['name'])
    }
  }
  tap() {
    this.hooks.arch.tapAsync('react', (name, cb) => {
      setTimeout(() => {
        console.log('react', name);
        cb('出错了'); // BailHook
      }, 2000);
    });
    this.hooks.arch.tapAsync('react', (name, cb) => {
      setTimeout(() => {
        console.log('react', name);
        cb();
      }, 2000);
    });
  }
  start() {
    this.hooks.arch.callAsync('jw', function () {
      console.log('end');
    });
  }
}
let l = new Lesson();
l.tap();
l.start();
