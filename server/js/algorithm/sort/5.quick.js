function swap(arr, idxL, idxR) {
  var tmp = arr[idxL];
  arr[idxL] = arr[idxR];
  arr[idxR] = tmp;
}

function main() {
  var arr = [8, 2, 6, 3, 1, 5, 7, 4];
  var l = 0;
  var r = arr.length - 1;
  // quickSort1Way(arr, l, r);
  // quickSort2Way(arr, l, r);
  quickSort3Way(arr, l, r);
  console.log('排序后：', arr);
}

// 普通快排：算法原理：找到分界点位置，并把小于基准值的数交换至分界点左侧
function quickSort1Way(arr, l, r) {
  if (l < r) {
    swap(arr, l, Math.floor(Math.random() * (r - l + 1)) + l); // 取随机数为基准值
    var eV = arr[l]; // 基准值
    // 数组分为 eV, < eV（[l, j]）, > eV（[j+1, i]） 三部分，令 i 为当前索引，j 为 <eV 和 >eV 的分界点
    var i = l + 1;
    var j = l;
    while(i <= r) {
      if (arr[i] < eV) {
        swap(arr, i++, ++j); // ++j: j为分界点
      } else {
        i++;
      }
    }
    swap(arr, l, j);
    quickSort1Way(arr, l, j - 1);
    quickSort1Way(arr, j + 1, r);
  }
}

// 双指针快排：算法原理：找一个基准值，把比基准值大的移到基准值左边，比基准值小的移到基准值右边，左右数组重复此操作。每轮结束时，需要找到下一轮的分组下标，把数组拆分。
function quickSort2Way(arr, l, r) {
  // 递归结束条件：左右下标相同
  if (l < r) {
    swap(arr, l, Math.floor(Math.random() * (r - l + 1)) + l); // 取随机数为基准值
    var base = arr[l];
    var i = l;
    var j = r;

    // 循环结束的条件，i = j
    while (i < j) {
      while((arr[j] > base) && i < j) {
        j--;
      }
      while((arr[i] <= base) && i < j) {
        // = 一边取等
        i++;
      }
      if (i < j) {
        swap(arr, i, j);
      }
    }
    swap(arr, l, i); // 每轮结束后，基准值移至中间，一定适用
    quickSort2Way(arr, l, i);
    quickSort2Way(arr, i + 1, r);
  }
}

// 荷兰国旗问题，针对存在大量重复数据的数组排序
// 初始化时，小于区域在l左边一位，大于区域在r的右边一位，当前位置为i=l；当i<基准值时，i与小于区域右边一位交换（小于区域增加一位），i右移继续比较；当等于基准值时，i直接右移；当大于基准值时，i与大于区域左边一位交换（大于区域增加一位），i不移动，因为交换到i的值大小未知，需要进入下一轮循环比较
function quickSort3Way(arr, l, r) {
  if (l < r) {
    swap(arr, l, Math.floor(Math.random() * (r - l + 1)) + l); // 取随机数为基准值
    var eV = arr[l]; // 令中间相同值为arr[l]

    var lt = l - 1; // 小于区域右闭边界
    var gt = r + 1; // 大于区域左闭边界
    var i = l; // i 为当前索引，需要排序
    while(i < gt) {
      if(arr[i] > eV) {
        // 大于区域左边一位与i交换; 因为被交换到的值未判断，因此i不移动
        swap(arr, i, --gt);
      }
      else if(arr[i] < eV) {
        // 小于区域右边一位与i交换，i右移
        swap(arr, ++lt, i++);
      }
      else {
        i++;
      }
    }
    // 遍历完后，递归
    quickSort3Way(arr, l, lt);
    quickSort3Way(arr, gt, r);
  }
}

main();