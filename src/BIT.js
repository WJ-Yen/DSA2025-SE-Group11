const MAXN = 16;
const MAXNUM = 256;

let a = new Array(MAXN).fill(0);
let BIT = new Array(MAXN + 1).fill(0);
let n = 0;

function inputConverter(inputStr, arr, maxSize) {
    arr.fill(0);
    if (!inputStr || inputStr.trim() === "") return 0;

    let nums = inputStr.trim().split(',');
    if (nums.length > maxSize) {
        alert(`!! Please enter at most ${maxSize} number !!`);
        return -1;
    }

    for (let i = 0; i < nums.length; i++) {
        if (!/^\d+$/.test(nums[i])) {
            alert("!! Please enter only numbers !!");
            return -1;
        }
        let num = parseInt(nums[i]);
        if (num < 0 || num > MAXNUM) {
            alert('!! Please enter the number in 0~${MAXNUM} !!');
            return -1;
        }
        arr[i] = num;
    }

    return nums.length;
}

function printAll(n) {
    console.log("The orig array:");
    console.log(a.slice(0, n).join(' '));

    console.log("The BIT tree:");
    console.log(BIT.slice(1, n + 1).join(' '));
}

function lowbit(x) {
    return x & (-x);
}

function BIT_add(i, delta, BIT, changes) {
    while (i <= n) {
        BIT[i] += delta;
        changes.push([i, BIT[i]]);
        i += lowbit(i);
    }
}

function BIT_sum(i, changes, state) {
    let sum = 0;
    while (i > 0) {
        sum += BIT[i];
        changes.push([i, BIT[i] * state]);
        i -= lowbit(i);
    }
    return sum;
}

export function construct(input) {
    n = inputConverter(input, a, MAXN);
    if (n <= 0) return null;

    BIT.fill(0);

    let changes = [];
    for (let i = 0; i < n; i++) {
        BIT_add(i + 1, a[i], BIT, changes);
    }
    return changes;
}

export function query(input) {
    if (n <= 0) {
        alert("!! Please construct the array first !!");
        return null;
    }

    let op = [];
    if (inputConverter(input, op, 2) <= 0) return null;

    let l = op[0], r = op[1];
    if (!r) {
	alert("!! Please enter at least 2 number !!");
	return null;
    }
    if (l < 1 || l > n || r < 1 || r > n) {
        alert("!! Please enter the number inside the range !!");
        return null;
    }

    if (l > r) [l, r] = [r, l];

    let changes = [];
    BIT_sum(r, changes, 1);
    BIT_sum(l - 1, changes, -1);
    return changes;
}

export function update(input) {
    if (n <= 0) {
        alert("!! Please construct the array first !!");
        return null;
    }

    let op = [];
    if (inputConverter(input, op, 2) <= 0) return null;

    let i = op[0], x = op[1];
    if (!x) {
	alert("!! Please enter at least 2 number !!");
	return null;
    }
    if (i < 1 || i > n || x < 0 || x > MAXNUM) {
        alert("!! Please enter the number inside the range !!");
        return null;
    }

    let changes = [];
    let delta = x - a[i - 1];
    a[i - 1] = x;
    BIT_add(i, delta, BIT, changes);
    return changes;
}

export function get_N()
{
    return n;
}
