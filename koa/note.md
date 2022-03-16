## 对比express 和 koa
- express 特点源码是es5来编写的 epxress.Router()
- 内部采用的是回调错误处理 app.use((err,req,res,next)=>{})
- express 内置了很多的中间 express.static 对req和rres封装的中间件, express 内置了路由系统(功能多)
- express在req和res上进行封装 实现了对原生 http的扩展

> express的功能太完善了。能不能把一些功能砍掉，只有核心逻辑在核心逻辑的基础上进行扩展。只留一个基本的功能(中间件) -> koa. 回调的方式处理起来不容 -> promise+ async and await koa源码采用了es6来编写 (所有的异步逻辑在koa中都需要包装成promise) koa中干脆实现了一个ctx上下文来进行对req和res的代理 (用户不需要再手动使用原生的api, 这里可以手动去使用req 和 res)


