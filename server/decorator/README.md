### decorator
> 修饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，修饰器能在编译阶段运行代码。也就是说，修饰器本质就是编译时执行的函数。

> Decorator就是一个求值结果为函数的表达式

> 原理是：增加一个修饰类包裹原来的类，包裹的方式一般是通过在将原来的对象作为修饰类的构造函数的参数。

[JavaScript中的装饰器--Decorator](https://juejin.im/post/5ab26c87f265da23866fc80d)
1. 方法装饰器
```
class Math {
  @log
  add(a, b) {
    return a + b;
  }
}

// 当固定传入的三个参数不够用的话
function log(target, name, descriptor) {
  var oldValue = descriptor.value;

  descriptor.value = function() {
    console.log(`Calling ${name} with`, arguments);
    return oldValue.apply(this, arguments);
  };

  return descriptor;
}

const math = new Math();

// passed parameters should get logged now
math.add(2, 4);
```
@log修饰器的作用就是在执行原始的操作之前，执行一次console.log，从而达到输出日志的目的。

---

2. 多个方法装饰器
```
function dec(id){
  console.log('evaluated', id);
  return (target, property, descriptor) => console.log('executed', id);
}

class Example {
    @dec(1)
    @dec(2)
    method(){}
}
// evaluated 1
// evaluated 2
// executed 2
// executed 1
```
如果同一个方法有多个修饰器，会像剥洋葱一样，先从外到内进入，然后由内向外执行。
外层修饰器@dec(1)先进入，但是内层修饰器@dec(2)先执行。

> 通过装饰器,我们完全可以在不改变一个类本身的请况下对一个类的属性进行改写，使得不同类之间可以共享同一类方法

3. 装饰器在编译时执行
```
@eat
class Person {
  constructor() {}
}

function eat(target, key, descriptor) {
  console.log('吃饭');
  console.log(target);
  console.log(key);
  console.log(descriptor);
  target.prototype.act = '我要吃饭';
}

const jack = new Person();
console.log(jack.act);

// 吃饭
// [Function: Person]
// undefined
// undefined
// 我要吃饭
```
代码中会先打印出'吃饭',然后是参数target,其次是参数key,再然后是参数descriptor.最后才是jack的act属性.这是因为装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，装饰器能在编译阶段运行代码。也就是说，装饰器本质就是编译时执行的函数。

4. demo
```
class Test() {
  @decorator1(arg1)
  @decorator2(arg2)
  fun() {

  }
}
decorator1(arg1) {
  console.log('in 1 -> 1')
  return (target, key, descriptor) {
    // descriptor.value = 
    console.log('in 1 -> 2')
  }
}
decorator2() {
  console.log('in 2 -> 1)
  return (target, key, descriptor) {
    console.log('in 2 -> 2')
  }
}
```