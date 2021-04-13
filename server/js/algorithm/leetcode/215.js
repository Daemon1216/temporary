// 找出第k大的元素
function sort(nums, l, r, exactIdx) {
  if (l < r) {
    var lt = l - 1;
    var gt = r + 1;
    var i = l;
    var eV = nums[l];
    swap(nums, l, Math.floor(Math.random() * (r - l) + l));
    // 需要找到等于 nums[i] == exactIdx 的位置
    while(i < gt) {
      if (nums[i] > eV) {
        swap(nums, i, --gt);
      } else if (nums[i] < eV) {
        swap(nums, i++, ++lt);
      } else {
        i++;
      }
    }
    if (exactIdx <= lt) {
      // 左递归
      sort(nums, l, lt, exactIdx);
    } else if ((exactIdx > lt) && (exactIdx < gt)) {
      // 中间数据，结束
    } else {
      // 右递归
      sort(nums, gt, r, exactIdx);
    }
  }
}
var swap = function(nums, idL, idR) {
  var tmp = nums[idL];
  nums[idL] = nums[idR];
  nums[idR] = tmp;
}
var findKthLargest = function(nums, k) {
  var exactIdx = nums.length - k;
  sort(nums, 0, nums.length - 1, exactIdx);
  console.log('第K大的数：', nums[exactIdx]);
  return nums[exactIdx];
};

// 输入: [3,2,1,5,6,4] 和 k = 2
findKthLargest([3,2,1,5,6,4], 2);

// 输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
findKthLargest([3,2,3,1,2,4,5,5,6], 4);
