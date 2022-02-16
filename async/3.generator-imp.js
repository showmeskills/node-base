//while (1) {}  在开发中表示这个代码会走好多次

let regeneratorRuntime = {
    mark(generator){
        return generator;
    },
    wrap(iteratorFn){
        const _context = {
            next:0,
            done:false, // 是否执行完毕
            send:null, // 每次执行后的返回值
            stop(){
                this.done = true;
            }
        }
        return {
            next(value){ // 上一次的yield返回值，是这次调用next传递的参数
                _context.send = value;
                let v = iteratorFn(_context);
                return {
                    v,
                    done:_context.next,
                }
            }
        }
    }
}