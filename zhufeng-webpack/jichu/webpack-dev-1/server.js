// express

let express = require('express');
let app = express();

// 在服务端启动webpack，不存在跨域问题
let webpack = require('webpack');
// 中间件
let middle = require('webpack-dev-middleware');
let config = require('./webpack.config.js');
let compiler = webpack(config);
app.use(middle(compiler));

// localhost:3000/user 访问
app.get('/user',(req,res)=>{
  res.json({name:'珠峰架构1'})
})

app.listen(3000);