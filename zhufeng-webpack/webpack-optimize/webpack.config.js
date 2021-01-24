let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let webpack = require('webpack');
module.exports = {
  mode: 'production',
  entry: {
    index:'./src/index.js',
  },
  devServer: {
    hot:true, // 启用热更新
    port: 3000,
    open: true, // 打开浏览器窗口
    contentBase: './dist'
  },
  module: {
    noParse: /jquery/, // import jquery from 'jquery' 不去解析jquery中的依赖库，因为jquery库不依赖其他js
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除目录
        include: path.resolve('src'), // 解析目录，只要下面这个即可
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            plugins:[ // 支持 import 动态导入js，懒加载
              '@babel/plugin-syntax-dynamic-import'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    // new webpack.DllReferencePlugin({ // 去找我们打包好的动态文件，react 和 react-dom
    //   manifest: path.resolve(__dirname, 'dist', 'manifest.json')
    // }),

    // 忽略掉某些引入，比如：引入moment的时候，会引入很多./local文件夹下的语言包，
    // 但我们只需要一个，可以在这里忽略掉该文件夹，但这样做的话，所有的语言包都没引入了，
    // 我们需要的语言包得自己引入
    // import moment from 'moment'
    // import 'moment/local/zh-cn' // 加上这句才行。webpack中，没加路径的，都会去node_modules中找包，然后找路劲
    // moment.local('zh-cn')
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),

    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),

    // 跟 devServer 里面的 hot 一起使用，只更新有改变的组件
    new webpack.NamedModulesPlugin(), // 打印更新的模块路径
    new webpack.HotModuleReplacementPlugin() // 热更新插件
  ]
}