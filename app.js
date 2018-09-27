const expressErr = require('express-async-errors');
const cookieParser = require('cookie-parser');
let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let config = require('./config/index');
let walletRouter = require('./routes/wallet');
const app=express();



//日志中间件
app.use(morgan('combined'));
app.use(cookieParser());
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(express.static(path.join(__dirname, 'public')));

// 设置全局响应头, 解决跨域问题
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    /*if (request.getMethod().equals("OPTIONS")) {
        HttpUtil.setResponse(response, HttpStatus.OK.value(), null);
        return;
    }*/
    next();
});

//引入自定义的中间件 给res安装两个方法来对请求响应
app.use(require('./midware/res_midware'));

//钱包路由
app.use('/wallet',walletRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


/*异常处理中间件*/
app.use((error,req,res,next)=>{
    res.fail(error.toString());

});






console.log(config.port);
//console.log(config.db);
//app.listen(config.port, '0.0.0.0');
app.listen(config.port);