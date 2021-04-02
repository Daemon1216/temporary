function main() {
  var arr = [8, 2, 6, 3, 1, 5, 7, 4];
  var l = 0;
  var r = arr.length - 1;
  quickSort(arr, l, r);
  console.log('排序后：', arr);
}

// 算法原理：找一个基准值，把比基准值大的移到基准值左边，比基准值小的移到基准值右边，左右数组重复此操作。
function quickSort() {

}

main();