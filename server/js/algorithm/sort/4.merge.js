function main() {
  var arr = [8, 2, 6, 3, 1, 5, 7, 4];
  var l = 0;
  var r = arr.length - 1;
  mergeSort(arr, l, r);
  console.log('排序后：', arr);
}

function sortFun1(arr, l, r, mid) {
  var tmpArr = []; // 临时数组用于缓存[待排序子数组]
  for (var k = l; k <= r; k++) {
    tmpArr[k - l] = arr[k];
  }
  var i = l;
  var j = mid + 1;
  console.log(arr, tmpArr);
  // 按l->r顺序排序
  for (var k = l; k <= r; k++) {
    // [i, mid] [j, r] 两个子数组分别从左到右，比对取小，原数组下标为k的值可以确定；选中小值的子数组下标右移，与另一个数组进入下一次比较取小；当i>mid或j>r，说明当前子数组已处理完，选择另一数组剩下部分。
    if (i > mid) {
      arr[k] = tmpArr[j - l]; // 取右子
      j++;
    } else if (j > r) {
      arr[k] = tmpArr[i - l]; // 取左子
      i++;
    } else if (tmpArr[i - l] > tmpArr[j - l]) {
      arr[k] = tmpArr[j - l];
      j++;
    } else {
      arr[k] = tmpArr[i - l]; // 原数组已被篡改（不同下标的值可能相同），只能从临时数据取k下标的值
      i++;
    }
  }
}

function sortFun2(arr, l, r, mid) {
  var tmpArr = []; // 往临时数据插排好序的值
  var i = l;
  var j = mid + 1;
  var k = 0; // 标记当前临时数组中已赋值下标

  // 第一个while循环，把[l, mid][mid, r]其一已经遍历完，剩下另一子数组剩余部分已排序，直接按序取值
  while(i <= mid && j <= r) {
    tmpArr[k++] = arr[i] > arr[j] ? arr[j++] : arr[i++];
  }
  while(i <= mid) {
    tmpArr[k++] = arr[i++];
  }
  while(j <= r) {
    tmpArr[k++] = arr[j++];
  }
  for(var i = 0; i < tmpArr.length; i++) {
    arr[l + i] = tmpArr[i];
  }
}

// 算法原理：将数组拆成两个子数组，直至每个数组只包含两个元素，然后在数组内部排好序，再合并成已排序数组。
/*
输入：[ 8, 2, 6, 3, 1, 5, 7, 4 ]
[ 8, 2, 6, 3, 1, 5, 7, 4 ] [ 8, 2 ]
[ 2, 8, 6, 3, 1, 5, 7, 4 ] [ 6, 3 ]
[ 2, 8, 3, 6, 1, 5, 7, 4 ] [ 2, 8, 3, 6 ]
[ 2, 3, 6, 8, 1, 5, 7, 4 ] [ 1, 5 ]
[ 2, 3, 6, 8, 1, 5, 7, 4 ] [ 7, 4 ]
[ 2, 3, 6, 8, 1, 5, 4, 7 ] [ 1, 5, 4, 7 ]
[ 2, 3, 6, 8, 1, 4, 5, 7 ] [ 2, 3, 6, 8, 1, 4, 5, 7 ]
输出：[ 1, 2, 3, 4, 5, 6, 7, 8 ]
*/

// 递归写法
function mergeSort(arr, l, r) {
  if (l == r) return
  var mid = l + ((r - l) >> 1);
  // 拆
  mergeSort(arr, l, mid);
  mergeSort(arr, mid + 1, r);
  // 并
  // 并法1. 在原数组上排序
  sortFun1(arr, l, r, mid);

  // 并法2. 临时数组为已排好序的子数组
  // sortFun2(arr, l, r, mid);
}

// 有迭代的写法，待补充

main();