/**
 * 基础概念: 堆排序借助完全二叉树
 * 1. 完全二叉树：从左往右，从上到下排列
 * 2. 完全二叉树最后一个父节点的序号 i = n/2 - 1 (n为所有节点个数)
 * 已知：
 * 完全二叉树的性质：若节点序号为 i，则左子节点序号为2*i+1，右子节点序号为2*i+2
 * 证明：
 * ①最后一个父节点只有左子节点，则 n-1 = 2*i+1 => i= n/2 - 1
 * ②最后一个父节点有左右子节点，则 n-1 = 2*i+2 => i= n-1/2 -1 = n/2 - 1(向下取整)
 * 根据推导公式可得，当最后一个节点为左节点时，完全二叉树有偶数个节点；当最后一个节点为右节点时，完全二叉树有奇数个节点。
 */
/**
 * 堆排序：有大顶堆和小顶堆之分，大顶堆的父节点大于等于左右子节点（一般升序用大顶堆，降序用小顶堆）
 * 大顶堆：对于任一节点 arr[i] >= arr[2*i+1] && arr[i] >= arr[2*i+2]
 * 1. 从最后一个父节点开始，从左往右、从下自上遍历，构建大顶堆
 * 2. 根节点与最后一个节点交换，去掉最后一个节点，剩下的数组重复1、2
 */

 function swap(arr, idxL, idxR) {
  var tmp = arr[idxL];
  arr[idxL] = arr[idxR];
  arr[idxR] = tmp;
}

function buildheap(arr) {
  var i = arr.length / 2 - 1;
  // 构建大顶堆
  while(i >= 0) {
    // 调整大顶堆
    heapAdjust(arr, i);
    i--;
  }
}

function heapAdjust(arr, cur) {
  var l = cur * 2 + 1;
  var r = cur * 2 + 2;
  var max = cur;
  if (l < len && arr[cur] < arr[l]) {
    max = l;
  }
  if (r < len && arr[cur] < arr[r]) {
    max = r;
  }
  if (cur != max) {
    swap(arr, cur, max);
    heapAdjust(arr, max); // 每次构建大顶堆时，如果父节点发生交换，子节点需要重新调整
  }
}

function heapSort() {
  var arr = [8, 2, 6, 3, 1, 5, 7, 4];
  len = arr.length - 1;
  buildheap(arr);
  while(len > 0) {
    swap(arr, 0, len--);
    heapAdjust(arr, 0);
  }
  console.log('排序后：', arr);
}

heapSort();