let fun = (req,res,next)=>{
    res.success=(data)=>{
        res.send({
            code:0,
            data:data,
            massege:"操作成功"
        });
    };
    res.fail=(massege)=>{
        res.send({
            code:-1,
            massege:massege
        });
    };

    next();

};
module.exports=fun;