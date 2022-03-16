const Koa = require("./koa");

const app = new Koa();


app.use(async (ctx,next)=>{
    ctx.body = '1';
    console.log(1);
    await next();
    ctx.body = '2';
    console.log(4);
});
app.use(async (ctx,next)=>{
    ctx.body = '3';
    console.log(2) 
    new Promise((resolve,reject)=>{
        setTimeout(()=>{resolve()},1000);
    })
    await next();
    ctx.body = '4';
    console.log(5)
});

app.use((ctx,next)=>{
    ctx.body = '5';
    console.log(3) 
    next();
    ctx.body = '6';
    console.log(6)
});


app.listen(3000,()=>console.log("3000 port start"))