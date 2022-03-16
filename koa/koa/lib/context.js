const request = require("./request");
const context = {
    // get url(){
    //     //this = ctx
    //     return this.request.url;
    // },
    // get path(){
    //     return this.request.path;
    // },
};

function defineGetter(proto, target, key){
    proto.__defineGetter__(key,function(){
        // 这里的this 不是proto; this.__proto__.__proto__ = proto
        return this[target][key];

    })
}

function defineSetter(proto, target, key){
    proto.__defineSetter__(key,function(value){
        this[target][key] = value;

    })
}


defineGetter(context,'request','url');
defineGetter(context,'request','path');
defineGetter(context,'request','method');


defineSetter(context,'response','body')
// 这里优化代码


module.exports = context