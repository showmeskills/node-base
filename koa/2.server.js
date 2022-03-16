const Koa = require("./koa");

const app = new Koa();


app.use((ctx)=>{
        ctx.body = 'ok';
});

app.listen(3000,()=>console.log("3000 port start"))