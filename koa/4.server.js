const Koa = require("./koa/lib/application");

const app = new Koa();


app.use(async (ctx,next)=>{
    console.log(1);
    await next();
    console.log(4);
});
app.use(async (ctx,next)=>{
    console.log(2) 
    new Promise((resolve,reject)=>{
        setTimeout(()=>{resolve()},1000);
    })
    await next();
    console.log(5)
});

app.use((ctx,next)=>{
    console.log(3) 
    next();
    console.log(6)
});


app.listen(3000,()=>console.log("3000 port start"))