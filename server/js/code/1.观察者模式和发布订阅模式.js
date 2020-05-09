// 1. 观察者模式(全局)
class Event{
  constructor() {
    this._cache = {};
  }
  on(type, fn) {
    // 队列存储观察者注册的回调函数，避免重复存储
    let fns = (this._cache[type] = this._cache[type] || []);
    if (fns.indexOf(fn) === -1) {
      fns.push(fn);
    }
    // return this;
  }
  emit(type, data) {
    let fns = this._cache[type];
    if (Array.isArray(fns) && fns.length) {
      fns.forEach(fn => fn(data));
    }
    // return this;
  }
  off(type, fn) {
    // 取消事件回调
    let fns = this._cache[type];
    if (Array.isArray(fns) && fns.length) {
      if (fn) {
        let index = fns.indexOf(fn);
        if (index > -1) {
          fns.splice(index, 1);
        }
      } else {
        this._cache[type] = [];
      }
    }
    // return this;
  }
}
const _event = new Event();
_event.on('test', param => {
  console.log('test on 1:', param);
})
_event.on('test', param => {
  console.log('test on 2:', param);
})
_event.emit('test', 'hello')
// test on 1: hello
// test on 2: hello
_event.off('test')
// _event.emit('test', 'hi')



// 2. 发布订阅者模式 ? 有啥区别...