let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let OptimizeCss = require('optimize-css-assets-webpack-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let webpack = require('webpack');
// cleanWebpackPlugin // 清除文件夹，需要安装
// copyWebpackPlugin // 复制文件夹里的内容，需要安装
// bannerPlugin // 内置
module.exports = {
  optimization:{ // 优化项
    minimizer:[
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true 
      }),
      new OptimizeCss()
    ]
  },
  mode: 'development', 
  entry: './src/index.js',
  output: {
    filename: 'bundle.js', 
    path: path.resolve(__dirname, 'build'),
    // publicPath:'http://www.zhufengpeixun.cn' // 如果这里指定了路径，页面所有引入（css,js.css等）的地方都会加上
  },
  // watch: true,
  // watchOptions:{
  //   poll:60, // 每秒查询更新多少次
  //   aggreementTimeout:100 // 延迟多久后刷新
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename:'css/main.css'
    }),
    // new webpack.BannerPlugin('created by liguixing')
    // ,new cleanWebpackPlugin(['./dist'])
    // ,new copyWebpackPlugin([
    //   {from: 'doc', to: './'} // doc文件夹下的拷贝到 ./dist文件夹
    // ])
    // ,new webpack.ProvidePlugin({ // 在每个模块注入$，需要安装了jquery，但是不能通过window.$获取
    //   $:'jquery'
    // })
  ],
  sourceMap: true, // 
  // externals: { 
  //   /*当html中已经通过script标签引入了jquery，
  //   但是代码中又有 import $ from 'jquery' 的语句，
  //   我们不想打包的时候再打包jquery，就可以定义jquery为外部引入，便不会再打包了*/ 
  //   jquery: "$"
  // },
  module: { 
    rules: [ // loader 默认是从后往前执行的
      { // 解决html中根据相对路径引入图片的问题
        test:/\.html$/,
        use:'html-withimg-loader'
      },
      {
        test:/\.(png|jpg|gif)$/,
        // 做一个限制 当我们的图片 小于多少k的时候 用base64 来转化
        // 否则用file-loader产生真实的图片
        use:{
          loader: 'url-loader',
          options:{
            limit:20, // 当小于多少K的时候，用base64
            outputPath:'/img/', // 输出路径，页面上的引用路径自己会变
            // publicPath:'http://www.zhufengpeixun.cn' // 如果指定了这个,css或js中的地址也会加上这个
          }
        }
      },
      // loader 分几种，pre：前面执行的loader,  normal：正常的loader， post：后面执行的loader
      // 还有一种内联 loader
      // { // 内联loader
      //   test:require.resolve('jquery'),
      //   use:'expose-loader?$'
      // },
       
      // {
      //   test:/\.js$/, // 用eslint进行代码检查，需要安装 eslint eslint-loader,且添加.eslintrc.json
      //   use:{
      //     loader:'eslint-loader',
      //     options:{
      //       enforce:'pre' // 强制把代码检查放在其他loader之前执行，post 放到后面
      //     }
      //   }
      // },
      {
        test:/\.js$/, // normal 普通的loader
        use:{
          loader:'babel-loader',
          options:{ // 用babel-loader 需要把es6-es5
            presets:[
              '@babel/preset-env'
            ],
            plugins:[
              ["@babel/plugin-proposal-decorators", { "legacy": true }], // 用于转化注解
              ["@babel/plugin-proposal-class-properties", { "loose": true }], // 用于转化类语法
              /*开发依赖，运行更高级的语法，打包后的代码需要依赖@babel/runtime，npm install  @babel/runtime --save*/
              "@babel/plugin-transform-runtime" 
            ]
          }
        },
        include:path.resolve(__dirname,'src'), // 包含目录
        exclude:/node_modules/ // 排除目录
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', 
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  }
  ,devServer:{ // 代理
    port: 8080, // 端口
    inline: true,// 默认 true, 状态条，服务的开启模式
    lazy: false, // 懒编译，没访问到的不编译
    overlay: true, // 默认true，错误信息是否显示黑色遮罩，默认console 控制台
    historyApiFallback: {
      rewrites: [
        {
          from: /^\/([-~]+)/, // 路径错误时的地址
          to: function(context){ // 跳转地址
            // context 表示的是正则匹配对象
            return './' + context.match[1]+ '.html'
          }
        }
      ]
    },
    // let xhr = new XMLHttpRequest()
    // 钩子函数，可用于自己mock数据
    before(app){ // 传入的app就是server实例，接口没有被代理
      app.get('/user',(req,res)=>{ // xhr.open('GET','/user',true)
        res.json({name:'自己mock的数据'})
      })
    },
    proxy:{
      // '/api':'http://localhost:3000/' // 请求：xhr.open('GET','/api/user',true)=>  访问的真实地址：http://localhost:3000/api/user
      // './api':{ // 可能后端的接口没有api这一级，我们需要替换
      //   target:'http://localhost:3000/',
      //   changeOrigin: true,
      //   pathRewrite:{'./api':''} // 请求：xhr.open('GET','/api/user',true) => 访问的真实地址：http://localhost:3000/user
      // }

      // 类似以下配置可直接访问百度资源而不存在跨越，模拟本地请求为target
      '/':{ // 可能后端的接口没有api这一级，我们需要替换
        target:'https://www.baidu.com/',
        changeOrigin: true,
        pathRewrite:{'^/api':'https://api.baidu.com/'} // 某部分单独定义
      }
    },
    // 热更新和热部署
    // 不刷新页面更新
    hot:true, // 只有这个时，会刷新页面更新
    hotonly: true // 有了这个后，不刷新页面更新
  }
}



// webpack-dev-server --open