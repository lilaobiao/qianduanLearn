

1、分页计算，就给定的某条(序号index)数据在第几页

const pageNo = Math.ceil((index + 1)/pageSize)


2、数组最大值

Math.max.apply(null,[1,2,3,4,5]) //早期写法
Math.max(1,2,3,4,5)

3、min 到 max 之间的随机整数

Math.round(min + Math.random() * (max - min))

4、判断一个数是否是素数

function is_prime(n){
    if(n <= 1) return false // 0,1不是素数
    // 不需要判断所有小于n的数是否能被n整除，只需要判断小于等于n的平方根的数即可
    const N = Math.floor(Math.sqrt(n)) // N^2 <= n <= (N+1)^2
    let isPrime = true
    for(let i = 2;i <= N; i++){
        if( n % i === 0) // n 能整除 i
        isPrime = false
        break
    }
    return isPrime
}

5、用出入栈的方式判断括号是否完全匹配

function is_balance( str ){
    function match(n,c){ // 这里只判断()和[]
        return ( n === '(' && c === ')' ) || ( n === '[' && c === ']' )
    }

    const [first,...others] = str
    const stack = [first]

    while(others.length > 0){
        const c = stack[stack.length - 1]
        const n = others.shift()
        if(!match(n,c)){
            stack.push(n)
        }else{
            stack.pop()
        }
    }
    return stack.length === 0
}

6、给定一个数组（全是数字）和一个数，判断数组中某一项，或者任意多项的和，是否被给定的数字整除

【相当于判断余数能否整除】solve([7,8,9],7) === solve([0,1,2],7)

function solve(arr, n){
    const s = new Set()
    for(let i = 0; i <= arr.length; i++){
        for(let j = i + 1; j <= arr.length; j++){
            // 任意多个子项的和除以 n 的余数
            const remain = arr.slice(i,j).reduce((x,y) => x+y, 0) % n
            s.add(remain)
        }
    }
    // 只要有一个能整除就行
    return s.has(0)
}

function solve(arr, n){
    const s = new Set([arr.shift() % n])
    while(arr.length > 0){
        const ak = arr.pop()
        s.add(ak)
        s.forEach(t => s.add( (t + ak) % n ))
    }
    // 只要有一个能整除就行
    return s.has(0)
}

7、投射，数组增加或改变字段

const studentsWithGrade = students.map(student => {
    return {
        ...student,
        grade: student.score >= 60 ? '通过' : '不通过'
    }
})

按照 group_id 分组学生

const studentsInGroups = students.reduce(
    (groups, student) => {
        groups[student.group_id] = 
            [ ...(groups[student.group_id] || []), student  ]
        return groups
    },
    {}
)
得到的结果
studentsInGroups = {
    group_id1:[],
    group_id2:[]
    ...
}

8、数组展平
const arr = [1, [2, 3, [4]]]
// 利用数组和字符串相加的特点
evel(`[${ arr + '' }]`)

// 数组展平的生成器实现，有问题
function* flatten(arr){
    for(let i = 0; i < arr.length; i++){
        if(Array.isArray(arr[i])){
            yield * flatten(arr[i])
        }else{
            yield arr[i]
        }
    }
}
console.log([...flatten(arr)])

// ramda库的使用
npm install ramda
const R = require('ramda')
import R from 'ramda'
R.zip([1,2,3],['a','b','c']) // [ [1,'a'],[2,'b'],[3,'c'] ]

9、生成器构造无穷菲波那切数列

Array.from(arraylike,mapfn,thisarg)
    arraylike:想要转换成数组的伪数组对象或可迭代对象
    mapfn:如果指定了该参数，新数组中的每个元素都会执行该回调函数
    thisarg:可选参数，执行回调函数mapfn时的this对象

function* fibonacci(){
    let a = 1
    let b = 1
    yield a;
    yield b;
    while(true){
        const t = b
        b = a + b
        a = t
        yield b
    }
}
const it = fibonacci()
const feb10 = Array.from(Array(10), it.next, it).map(x => x.value) 
console.log(feb10) //[1,1,2,3,5,8,13,21,34,55]

10、generator异步写法

function create_runner(genfn){
    const it = genfn()
    function run(data){
        const itval = it.next(data)
        if(!itval.done){
            itval.value(run)
        }
    }
    return run
}

11、中文排序

['王成成','王峰','江雪','李贵兴'].sort( (a,b) => a.localeCompare(b,'zh'))