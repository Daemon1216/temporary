// 1. new Promise(resolve => resolve(v)) 与 Promise.resolve(v)
// 1.1 Promise.resolve 是定义一个状态为fulfilled的promise，但是没有调用它;
// 1.2 promise调用then的前提是promise的状态为fullfilled;
// 1.3 promise调用then时，then才会被推入微任务队列


// 浏览器会创建一个 PromiseResolveThenableJob 去处理Promise实例，是一个微任务，在下一次循环时执行；
// await 是 await 一个thenable（类 promise），返回它的 fulfilled value

var p = new Promise(resolve => {
  console.log('begin');
  resolve('then');
});

new Promise(resolve => {
  resolve(p)
}).then(res => {
  console.log(res);
});

new Promise(resolve => {
  console.log('1');
  resolve();
}).then(() => {
  console.log('2');
}).then(() => {
  console.log('3');
}).then(() => {
  console.log('4');
});
