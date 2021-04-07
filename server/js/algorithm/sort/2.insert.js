function swap(arr, idxL, idxR) {
  var tmp = arr[idxL];
  arr[idxL] = arr[idxR];
  arr[idxR] = tmp;
}

function main() {
  var arr = [8, 2, 6, 3, 1, 5, 7, 4];
  insertSort(arr);
  console.log('排序后：', arr);
}

// 插入排序：外循环每次把当前需要排序的位，插入到已排序数组的应排位置上
function insertSort(arr) {
  for (var i = 1; i < arr.length; i++) { // 第一位默认有序了
    for (var j = 0; j < i; j++) { // [0 ,i - 1] 为有序数组，将 i 插入该有序数组中
      if (arr[i] < arr[j]) {
        swap(arr, i, j);
      }
    }
  }
}

main();