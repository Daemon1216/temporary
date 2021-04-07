function swap(arr, idxL, idxR) {
  var tmp = arr[idxL];
  arr[idxL] = arr[idxR];
  arr[idxR] = tmp;
}

function main() {
  var arr = [8, 2, 6, 3, 1, 5, 7, 4];
  bubbleSort(arr);
  console.log('排序后：', arr);
}

// 冒泡：大值往后排，内循环不断把大值交换到后面
function bubbleSort(arr) {
  for(var i = 0; i < arr.length - 1; i++) {
    for (var j = i + 1; j < arr.length; j++) { // 比较到最后一位
      if (arr[i] > arr[j]) {
        swap(arr, i, j);
      }
    }
  } 
}

main();