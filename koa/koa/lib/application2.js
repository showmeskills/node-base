const http = require('http');

const context = require("./context");
const request = require("./request");
const response = require("./response");

class Application {
    constructor() {
        //this.hanleRequest = this.hanleRequest.bind(this);
        // this.context.__proto__ === context 这样每个应用都扩展每个全新的ctx,req,res; 每个应用都是独立的不会影响
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response);
        this.middlewares = [];
    }
    use(middleware) { // 我们在使用use的时候 希望可以多次注册中间件,到时候可以一个个执行
        //this.fn = middleware;
        this.middlewares.push(middleware);
    }
    compose(ctx){
        // 函数链式调用
        // const dispatch = (i)=>{
        //     //if(this.middlewares.length == i) return Promise.resolve();
        //     //return Promise.resolve(this.middlewares[i](ctx,()=>dispatch(i+1)));
        // }
        // return dispatch(0)
        let fn = this.middlewares.reduce((a,b)=> (ctx) => Promise.resolve(()=>a(b(ctx))));
        return fn (ctx);

    }
    createContext(req, res) {
        // 每次构建都是需要创建一个新的ctx，req，res是基于不同的应用
        let ctx = Object.create(this.context);
        let request = Object.create(this.request);
        let response = Object.create(this.response);

        ctx.request = request; // 这个是koa中封装的属性
        ctx.request.req = ctx.req = req; // 将原生的req放到了封装的request上
        ctx.response = response;
        ctx.response.res = ctx.res = res;
        return ctx;
    }
    hanleRequest = (req, res) => {
        let ctx = this.createContext(req, res);
        res.statusCode = 404; // 默认404
        this.compose(ctx).then(() => {
            let _body = ctx.body;

            if (_body) {
                if (typeof _body === 'string' || Buffer.isBuffer(_body)) {
                    return res.end(_body);
                } else if (typeof _body === 'object') {
                    return res.end(JSON.stringify(_body));
                }
            }else{
                res.end('not found');
            }
        }).catch(err=>{
            
        }); //把多个函数串联在一起
    }
    listen() {
        let server = http.createServer(this.hanleRequest);
        server.listen(...arguments);
    }
}

module.exports = Application;