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
        console.log(`!! Please enter at most ${maxSize} number !!`);
        return -1;
    }

    for (let i = 0; i < nums.length; i++) {
        if (!/^\d+$/.test(nums[i])) {
            console.log("!! Please enter only numbers !!");
            return -1;
        }
        let num = parseInt(nums[i]);
        if (num < 0 || num > MAXNUM) {
            console.log("!! Please enter the number inside the range !!");
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
    while (i <= MAXN) {
        BIT[i] += delta;
        changes.push([i, BIT[i]]);
        i += lowbit(i);
    }
}

function BIT_sum(i, changes, state) {
    let sum = 0;
    while (i > 0) {
        sum += BIT[i];
        changes.push([i, BIT[i]]);
        i -= lowbit(i);
    }
    return sum;
}

function construct(input) {
    n = inputConverter(input, a, MAXN);
    if (n <= 0) return null;

    BIT.fill(0);

    let changes = [];
    for (let i = 0; i < n; i++) {
        BIT_add(i + 1, a[i], BIT, changes);
    }
    return changes;
}

function query(input) {
    if (n <= 0) {
        console.log("!! Please construct the array first !!");
        return null;
    }

    let op = [];
    if (inputConverter(input, op, 2) <= 0) return null;

    let l = op[0], r = op[1];
    if (l < 1 || l > n || r < 1 || r > n) {
        console.log("!! Please enter the number inside the range !!");
        return null;
    }

    if (l > r) [l, r] = [r, l];

    let changes = [];
    BIT_sum(r, changes, 1);
    BIT_sum(l - 1, changes, -1);
    return changes;
}

function update(input) {
    if (n <= 0) {
        console.log("!! Please construct the array first !!");
        return null;
    }

    let op = [];
    if (inputConverter(input, op, 2) <= 0) return null;

    let i = op[0], x = op[1];
    if (i < 1 || i > n || x < 0 || x > MAXNUM) {
        console.log("!! Please enter the number inside the range !!");
        return null;
    }

    let changes = [];
    let delta = x - a[i - 1];
    a[i - 1] = x;
    BIT_add(i, delta, BIT, changes);
    return changes;
}

// 模擬操作介面（可用於 CLI 或瀏覽器開發用戶界面）
function simulate() {
    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function ask(question) {
        return new Promise(resolve => {
            readline.question(question, answer => {
                resolve(answer);
            });
        });
    }

    async function loop() {
        while (true) {
            console.log("\nOperations:");
            console.log("-1 - Exit");
            console.log(" 0 - Construct array");
            console.log(" 1 - Query range sum (l r)");
            console.log(" 2 - Update index (i x)");
            console.log(" 3 - Print current array and BIT\n");

            let op = parseInt(await ask("Enter operation: "));
            let input, changes;

            switch (op) {
                case -1:
                    readline.close();
                    return;
                case 0:
                    input = await ask("Enter numbers in range 0~256 separated by ',' (max 16): ");
                    construct(input);
                    break;
                case 1:
                    input = await ask(`Enter range l,r in 1~${n}: `);
                    changes = query(input);
                    if (changes)
                        for (let [idx, val] of changes)
                            console.log(`${idx} ${val}`);
                    break;
                case 2:
                    input = await ask(`Enter index i (1~${n}) and target x (0~256): `);
                    changes = update(input);
                    if (changes)
                        for (let [idx, val] of changes)
                            console.log(`${idx} ${val}`);
                    break;
                case 3:
                    printAll(n);
                    break;
                default:
                    console.log("Please enter operation among {-1,0,1,2,3}");
            }
        }
    }

    loop();
}

// 啟動模擬器
simulate();

