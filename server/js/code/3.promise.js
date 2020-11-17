// 1. Promise 使用
const testPromise = new Promise((resolve, reject) => {
  console.time('flag');
  setTimeout(() => {
    console.timeEnd('flag');
    resolve('success'); // 1s后执行
  }, 1000)
});
testPromise.then(res => console.log('resolve:', res), rej => console.log('reject:', rej));

// promise调用流程（事件订阅监听模式）：
// promise构造方法接收一个executor()
// executor同步执行，内部的异步任务被放入宏/微任务队列
// then同步执行，收集注册回调方法
// executor函数中的异步方法执行完后触发then的回调方法

// 2. 简单的事件监听模式实现promise
// version 1:
class MySimple {
  constructor(executor) {
    this._resolve;
    this._reject;

    const resolve = val => this._resolve && this._resolve(val) || (() => {})
    const reject = val => this._reject && this._reject(val) || (() => {})

    executor(resolve, reject);
  }

  then(_resolveFn, _rejectFn) {
    this._resolve = _resolveFn;
    this._reject = _rejectFn;
  }
}
const testSimple = new MySimple(resolve => {
  setTimeout(() => { resolve('ttt') }, 500)
})
testSimple.then(res => console.log('simple 1:', res))
testSimple.then(res => console.log('simple 2:', res))

// version 2
class MyPromise {
  constructor(executor) {
    this._resolveList = [];
    this._rejectList = [];

    const _resolve = val => {
      while(this._resolveList.length) {
        const fn = this._resolveList.shift();
        fn(val);
      }
    }

    const _reject = val => {
      while(this._rejectList.length) {
        const fn = this._rejectList.shift();
        fn(val);
      }
    }

    executor(_resolve, _reject)
  }

  then(_resolveFn, _rejectFn) {
    this._resolveList.push(_resolveFn); // 为何需要用数组?
    this._rejectList.push(_rejectFn);
  }
}
const testMy = new MyPromise((resolve, reject) => {
  console.time('f');
  setTimeout(() => {
    console.timeEnd('f');
    resolve('test')
  }, 1000)
});
testMy.then(val => console.log('my 1:', val), err => console.log('err', err));
testMy.then(val => console.log('my 2:', val), err => console.log('err', err));

// 1. MySimple相比MyPromise的缺点是：then只能注册一个回调，最后一个回调总是覆盖前面的回调
// 2. MyPromise与MySimple存在的问题：如果executor内部是同步的函数，then的函数将无法被调用到：因为是同步函数，在then收集之前，executor已经resolve了(executor用setTimeout包一层)

// 3. Promise A+ 规范
// 3.1. Promise状态包含 Pending Fulfilled Rejected
// 3.2. 同一个promise可以执行多次then方法，即收集多个回调
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise {
  constructor(executor) {
    this._resolveList = [];
    this._rejectList = [];
    this._status = PENDING;

    const _resolve = val => {
      if (this._status !== PENDING) return;
      this._status = FULFILLED;
      while(this._resolveList.length) {
        const fn = this._resolveList.shift();
        fn(val);
      }
    }

    const _reject = val => {
      if (this._status !== PENDING) return;
      this._status = REJECTED;
      while(this._rejectList.length) {
        const fn = this._rejectList.shift();
        fn(val);
      }
    }

    executor(_resolve, _reject)
  }

  then(_resolveFn, _rejectFn) {
    this._resolveList.push(_resolveFn); // 数组解决同一个promise多次then调用的问题
    this._rejectList.push(_rejectFn);
  }
}

// 4. then的链式调用
var p1 = new Promise(resolve => resolve('hello'))
p1.then(res => { 
  console.log('1', res);
  return new Promise(resolve => {
    setTimeout(() => {resolve(11)}, 2000)
  });
}).then(res => console.log('res:', res))
p1.then(res => {
  console.log('2', res);
  return 22;
}).then(res => console.log('res:', res))

// 4.1 then 方法return Promise
// 4.2 then顺序执行：需要前一个then方法状态变更后(pending->fulfilled,pending->rejected)再注册下一个then方法
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise {
  constructor(executor) {
    this._resolveList = [];
    this._rejectList = [];
    this._status = PENDING;

    const _resolve = val => {
      if (this._status !== PENDING) return;
      this._status = FULFILLED;
      while(this._resolveList.length) {
        const fn = this._resolveList.shift();
        fn(val);
      }
    }

    const _reject = val => {
      if (this._status !== PENDING) return;
      this._status = REJECTED;
      while(this._rejectList.length) {
        const fn = this._rejectList.shift();
        fn(val);
      }
    }

    executor(_resolve, _reject)
  }

  then(_resolveFn, _rejectFn) {
    // 下一个堆栈的resolve
    return new MyPromise((resolve, reject) => {
      const wrapResolveFn = val => {
        try {
          const temp = _resolveFn(val);
          // 如果当前的then执行结果是return MyPromise(有异步操作)，则需要等待当前_resolveFn方法的状态变更，下一个then才执行
          temp instanceof MyPromise ? temp.then(resolve, reject) : resolve(temp); // 异步then
        } catch (err) {
          reject(err); // reject给下一个then
        }
      };
      this._resolveList.push(wrapResolveFn);

      const wrapRejectFn = val => {
        try {
          const temp = _rejectFn(val);
          temp instanceof MyPromise ? temp.then(resolve, reject) : reject(temp);
        } catch (err) {
          reject(err);
        }
      };
      this._rejectList.push(wrapRejectFn);
    })
  }
}

var p1 = new MyPromise(resolve => {
  console.time('a')
  setTimeout(() => { resolve(1); console.timeEnd('a') }, 1000)
})
p1.then(res => { 
  console.log('then 1:', res);
  console.time('b')
  return new MyPromise(resolve => {
    setTimeout(() => { resolve(2); console.timeEnd('b'); }, 2000)
  });
}).then(res => console.log('then 2:', res));

// 5. async 和 await