function main() {
  var arr = [8, 2, 6, 3, 1, 5, 7, 4];
  var l = 0;
  var r = arr.length - 1;
  quickSort(arr, l, r);
  console.log('排序后：', arr);
}

function swap(arr, idxL, idxR) {
  var tmp = arr[idxL];
  arr[idxL] = arr[idxR];
  arr[idxR] = tmp;
}

// 双指针快排：算法原理：找一个基准值，把比基准值大的移到基准值左边，比基准值小的移到基准值右边，左右数组重复此操作。每轮结束时，需要找到下一轮的分组下标，把数组拆分。
function quickSort(arr, l, r) {
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
        // = 至少一边取等
        i++;
      }
      if (i < j) {
        swap(arr, i, j);
      }
    }
    swap(arr, l, i); // 每轮结束后，基准值移至中间，一定适用
    quickSort(arr, l, i);
    quickSort(arr, i + 1, r);
  }
}

main();