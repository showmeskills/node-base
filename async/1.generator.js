
//类数组转化成数组
//类数组 length, 索引，迭代方法
//Symbol 可以创建一个独一无二的值，而且这个Symbol还可以实现"元编程"可以改变js的原有的实现，底层机制
let likeArray = {
    0:1,
    1:2,
    2:3,
    length:3,
    get [Symbol.toStringTag](){ return "likeArray"}, //get 是defineProperty
    // 实现yield
    // [Symbol.iterator](){
    //     // 要求返回值 而且标识是否迭代完成 {done: false/true, value: 结果}
    //     let that = this; //当前的类数组
    //     let index = 0;
    //     return { //自己模拟了一个迭代器,返回必须是个对象，对象是个迭代器
    //         next(){
    //             return {
    //                 value:that[index],
    //                 done:index++ == that.length, // 如果done 为true 迭代完成; 内部迭代的时候根据内部done 返回结果调用next
    //             }
    //         }
    //     }
    // }
    [Symbol.iterator]: function *(){
        let index = 0;
        let len = this.length;
        
        while(index !== len){
            yield this[index++]; // generator 碰到 yield 就停止
        }
    }
}

//什么时候会调用generator 1. 遍历 for( let .. of ..); 2. [..likeArray] 展开时候
console.log([...likeArray]);
for(let value of likeArray){
    console.log(value,1);
}