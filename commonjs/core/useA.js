/*
    global
    this

    下面的区别
    module.exports
    exports
    module.exports = exports = {}; 这里不能直接改变exports的引用 exports = "hello world" 这个是错误的写法
    exports.a = "hello world"; 这种方式是可行的;添加属性可以影响exports
    this.a = exports.a;
    {
        commonjs 如果写了module.exports 和 exports.a 那么以module.exports 为准
        exports.a = this.a = "hello world a";
        module.exports = "hello world"; 最终返回module.exports 
    }
    这里最终用的是module.exports
*/


const path = require('path');
const fs = require('fs');
const vm = require('vm');
//这里为什么没有用类;因为node出现的比class早
function Module(id) {
    this.id = id;
    this.exports = {};
}

// 扩展策略模式，区分每个文件的后缀
Module._extensions = {
    '.js'(module) {
        //js 需要我们读取文件内容并且将内容包裹一个函数
        let script = fs.readFileSync(module.id, 'utf-8');
        //vm 中有个编译方法,将其转为函数
        let fn = vm.compileFunction(script,[ //可以获得global上的属性
            'exports',
            'require',
            'module',
            '__filename',
            '__dirname'
        ],{
            filename:module.filename,
            //importModuleDynamically 对于es6模块引入
        });
        let exports = module.exports; // 默认是空对象
        let require = myRequire;
        let filename = module.id;
        let dirname = path.dirname(filename);
        /*
            为什么使用Reflect.apply
            fn.apply = vm.compileFunction(..arg); 因为怕fn 上已经有一个apply
        */
        Reflect.apply(fn,module.exports,[exports,require,module,filename,dirname]); // module.export = 'hello world'
    },
    '.json'(module) {
        let jsonStr = fs.readFileSync(module.id, 'utf-8');
        module.exports = JSON.parse(jsonStr);
    },
    '.ts'(module) {} // 添加策略
}

//创造缓存机制
Module._cache = Object.create(null); //优势创建一个空对象，没有任何原型方法

/**
 * @param id 把id转为绝对路径
 */
Module._resolveFileName = function (id) {
    const filePath = path.resolve(__dirname, id); //尝试依次添加后缀先找js，找不到在找json
    if (fs.existsSync(filePath)) return filePath; // 如何已经写后缀，直接看存不存在
    const exts = Object.keys(Module._extensions); //所有文件扩展名
    for (let i = 0; i < exts.length; i++) {
        let newPath = filePath + exts[i]; //拼接路径
        if (fs.existsSync(newPath)) return newPath; // 返回拼接后的新路径
    }
    throw new Error(`cannot find module ${id}`);
}

Module.prototype.load = function (fileName) {
    let ext = path.extname(fileName); // 获取文件的后缀名
    //console.log(ext,fileName)
    Module._extensions[ext](this); // 根据扩展名加载对应的策略
}


/**
 * @param id 我们需要将id转换成绝对路径,并且尝试添加后缀，为了可以通过路径找到具体的文件
 */
function myRequire(id) {
    let absPath = Module._resolveFileName(id);
    let existModule = Module._cache[absPath];
    //需要做缓存判断,直接返回绝对路径
    if (existModule) return existModule.exports;
    /*
         这里不考虑2种情况
         1.缓存中是否有值
         2.看一下模块是否是原生模块
         只考虑
         如果不是原生模块 直接创建new Module()
    */
    const module = new Module(absPath);
    Module._cache[absPath] = module; //把模块缓存起来
    //有了模块后就对此模块进行加载
    module.load(absPath); // 加载模块就是读文件=> module.exports = 文件内容
    return module.exports; //这里目前是空对象
}

/*
    对于json，而言就是读取文件，将文件内容手动挂载到module.exports上,因为require返回就是module.exports
*/

const a = myRequire('./a');
let result = myRequire('./a'); // 多次引入可以添加缓存
console.log(a)
console.log(result)