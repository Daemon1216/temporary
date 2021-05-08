// 希尔排序
function swap(arr, idL, idR) {
  var tmp = arr[idL];
  arr[idL] = arr[idR];
  arr[idR] = tmp;
}

function insertHillSort(arr) {
  var gap = Math.floor(arr.length / 2); // 将原始数组每次分为 gap 组，每组有 arr / gap 个元素
  while(gap > 0) {
    // 内部使用插入排序
    for (var i = gap; i < arr.length; i++) { // 每组数据第0位默认有序
      // 稍微区别于普通插入排序的是：由于不清楚第 i 位所属的第0位的下标，所以第二层for循环是从高往低反向遍历
      for (var j = i; j > 0;) { // 第二层for循环，对原始数组的第 i 位所属的组进行插入排序，已排好序的元素是[..., i-gap*2, ... ,i-gap]
        if (arr[j] < arr[j- gap]) {
          swap(arr, j, j- gap);
        }
        j = j - gap;
      }
    }
    gap = Math.floor(gap / 2);
  }
}

function main() {
  var arr = [8, 9, 1, 7, 2, 3, 5, 4, 6, 0];
  insertHillSort(arr);
  console.log('排序后：', arr);
}
main();