function swap(arr, idxL, idxR) {
  var tmp = arr[idxL];
  arr[idxL] = arr[idxR];
  arr[idxR] = tmp;
}

function main() {
  var arr = [8, 2, 6, 3, 1, 5, 7, 4];
  selectSort(arr);
  console.log('排序后：', arr);
}

// 选择：小值往前排，每轮遍历找最小值，与当前排序位交换
function selectSort(arr) {
  for (var i = 0; i < arr.length - 1; i++) { // 最后一位默认有序了
    var flag = i;
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[flag] > arr[j]) {
        flag = j;
      }
    }
    swap(arr, i, flag);
  }
}

main();