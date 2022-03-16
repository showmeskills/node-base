const Koa = require("./koa");

const app = new Koa();


app.use((ctx)=>{
     // console.log(ctx.req.url); // 这个地方不会在使用原生的了 
    // console.log(ctx.request.path)
    // console.log(ctx.request.req.url)

    // 如果我需要对请求扩展 request扩展
    console.log(ctx.path); // 最后用户使用的就是ctx.xxx
});

app.listen(3000,()=>console.log("3000 port start"))