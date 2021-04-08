// 找出第k大的元素
function sort(nums, l, r) {
  var lt = l - 1;
  var gt = r + 1;
  var i = l;
  var eV = nums[l];
  // 需要找到等于 nums[i] == k 的位置
  while(i < gt) {
    if (eV > nums[i]) {
      swap(nums, i, --gt);
    } else if (eV < nums[i]) {
      swap(nums, i++, ++lt);
    } else {
      i++;
    }
  }
}
var swap = function(nums, idL, idR) {
  var tmp = nums[idL];
  nums[idL] = nums[idR];
  nums[idR] = tmp;
}
var findKthLargest = function(nums, k) {

};