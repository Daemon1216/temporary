/**
 * 基础概念: 堆排序借助二叉堆，进行堆的排序，构建大顶堆/小顶堆
 * 1. 二叉堆是完全二叉树
 * 2. 完全二叉树：从左往右，从上到下排列
 * 3. 完全二叉树最后一个父节点的序号 i = n/2 - 1 (n为所有节点个数)(向下取整)
 * 父节点序号的证明：
 * 已知：
 * 完全二叉树的性质：若父节点序号为 i，则左子节点序号为2*i+1，右子节点序号为2*i+2
 * 最后一个节点为左节点时，完全二叉树有偶数个节点；最后一个节点为右节点时，完全二叉树有奇数个节点。
 * ①最后一个父节点只有左子节点，则左子节点的序号 = 2*i+1 其中父节点序号 i= n/2 - 1
 * ②最后一个父节点有左右子节点，则右子节点的序号 = 2*i+2 其中父节点序号 i= n-1/2 -1 = n/2 - 1
 */
/**
 * 堆排序：有大顶堆和小顶堆之分，大顶堆的父节点大于等于左右子节点（一般升序用大顶堆，降序用小顶堆）
 * 大顶堆：对于任一节点 arr[i] >= arr[2*i+1] && arr[i] >= arr[2*i+2]
 * 1. 数组存储二叉堆
 * 2. 从最后一个父节点开始，从左往右、从下自上遍历，构建大顶堆
 * 3. 根节点与最后一个节点交换，去掉最后一个节点，剩下的数组重复1、2
 */

 function swap(arr, idxL, idxR) {
  var tmp = arr[idxL];
  arr[idxL] = arr[idxR];
  arr[idxR] = tmp;
}

function buildheap(arr, heapLen) {
  var i = Math.floor(heapLen / 2) - 1;
  // 构建大顶堆
  while(i >= 0) {
    // 调整大顶堆
    heapAdjust(arr, i, heapLen);
    i--;
  }
}

function heapAdjust(arr, cur, heapLen) {
  var l = cur * 2 + 1;
  var r = cur * 2 + 2;
  var max = cur;
  var maxIndex = heapLen - 1; // 注意，最末元素下标 = 长度-1
  if (l < maxIndex && arr[cur] < arr[l]) {
    max = l;
  }
  if (r < maxIndex && arr[cur] < arr[r]) {
    max = r;
  }
  if (cur != max) {
    swap(arr, cur, max);
    heapAdjust(arr, max, heapLen); // 每次构建大顶堆时，如果父节点发生交换，子节点需要重新调整
  }
}

function heapSort() {
  var arr = [8, 2, 6, 3, 1, 5, 7, 4];
  var heapLen = arr.length;
  while(heapLen >= 3) { // 至少3个才需要构建
    buildheap(arr, heapLen); // 构建堆，目的是获取堆遍历的起点父节点
    console.log('AAA')
    swap(arr, 0, --heapLen); // 每一次构建完大顶堆后，需要交换大顶堆的首尾；交换后，需要再次构建大顶堆的数组长度-1，剔除最末元素；每次遍历选择当前堆的最大元素
  }
  console.log('排序后：', arr);
}

heapSort();