// function* read(){
//     yield 'vue';
//     yield 'react';
//     yield 'angular';
//     return "123";
// }

// let it = read();
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());
// { value: 'vue', done: false }
// { value: 'react', done: false }
// { value: 'angular', done: false }
// { value: '123', done: true }


// function* read(){
//     let a = yield 'vue'; 
//     console.log(a);
//     let b = yield 'react';
//     console.log(b);
//     let c = yield 'node';
//     console.log(c);
//     return "123";
// }

// let it = read(); // it.next() {value, done} 1. 调用 read 啥都没有
// console.log(it.next()); // 遇到yield就停止时没有赋值 2.第一次调用next是无意的
// console.log(it.next('abc')); // yield 的返回值是调用next的传递的参数，下次next传递参数
// console.log(it.next('ccc')); // yield 的返回值是调用next的传递的参数
//yield 产出是正常产出，传参数是下一次的next给上一次的yield传值
// { value: 'vue', done: false }
// abc
// { value: 'react', done: false }
// ccc
// { value: 'node', done: false }

const fs = require('fs').promises; //这里拿到的所有fs都是promises
const path = require("path");

function* read(){
    let content;
    try{
        let fileName = yield fs.readFile(path.resolve(__dirname,'name.txt'),'utf8');
        content = yield fs.readFile(path.resolve(__dirname,fileName),'utf8');
    }catch(e){
        console.log(e);
    }
    return content;
}

// let it = read();
// let {value,done} = it.next();// value 返回的是一个promise,done 是false 就是第一个yield产出的结果
// if(!done){
//     Promise.resolve(value).then((data)=>{
//         let { value,done } = it.next(data);
//         if(!done){
//             Promise.resolve(value).then((data)=>{
//                 let { value,done } = it.next(data);
//                 console.log(value,done);
//             })
//         }
//     })
// }

//let co = require('co');//co 库,第三方模块
//手写co库 for 循环是同步的发生
function co(it){
    return new Promise((resolve,reject)=>{
        function next(v){ //异步迭代写一个迭代函数递归调用
            let { value,done }=it.next(v);
            if(!done){
                Promise.resolve(value).then(data=>{
                    next(data);
                },()=>{
                    it.throw('异常'); // 在generator 可以通过try catch 进行捕获
                });
            }else{
                resolve(value); // 迭代完毕
            }
        }
        next();
    })
}
co(read()).then(data=>{
    console.log(data);
}).catch((err)=>{
    console.log(err)
})