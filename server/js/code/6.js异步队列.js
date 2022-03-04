const queue = () => {
  const list = []; // 队列
  let index = 0; // 游标

  // next 方法
  const next = () => {
    if (index >= list.length - 1) return;

    // 游标 + 1
    const cur = list[++index];
    cur(next);
  };

  // 添加任务
  const add = (...fn) => {
    list.push(...fn);
  };

  // 执行
  const run = (...args) => {
    const cur = list[index];
    typeof cur === "function" && cur(next);
  };

  // 返回一个对象
  return {
    add,
    run,
  };
};

// 生成异步任务
const async = (x) => {
  return (next) => {
    // 传入 next 函数
    setTimeout(() => {
      console.log(x);
      next(); // 异步任务完成调用
    }, 1000);
  };
};

const q = queue();
const funs = "123456".split("").map((x) => async(x));
q.add(...funs);
q.run(); // 1, 2, 3, 4, 5, 6 隔一秒一个。
