var arr = [0]
var n = arr.length
var ans = getMissingNo(arr, n)
console.log(ans)

function getMissingNo(arr, n) {
  var i = 0
  while (i < n) {
    var correctpos = arr[i] - 1
    if (arr[i] < n && arr[i] != arr[correctpos]) {
      swap(arr, i, correctpos)
    } else {
      i++
    }
  }
  for (var index = 0; index < arr.length; index++) {
    if (arr[index] != index + 1) {
      return index + 1
    }
  }
  return n
}

function swap(arr, i, correctpos) {
  var temp = arr[i]
  arr[i] = arr[correctpos]
  arr[correctpos] = temp
}

console.log('00-00-01'.split('-').join(''))
console.log(parseInt('00-00-01'.split('-').join('')))
