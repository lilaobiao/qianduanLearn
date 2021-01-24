/**
 * 动态链接库
 * react  react-dom 不会经常变动，不用每次都打包
 * 单独打包react  react-dom，直接引入就行
 * 
 * 打包前先打包这里的资源  npx webpack --config webpack.config.react.js
 */ 

let path = require('path');
let webpack = require('webpack');
module.exports = {
  mode: 'development',
  entry: {
    react: ['react', 'react-dom'],
  },
  output: {
    filename: '_dll_[name].js', // 产生的文件名
    path: path.resolve(__dirname, 'dist'),
    library: '_dll_[name]', // _dll_react  把 react 打包后的结果暴露出来，等同于 var _dll_react = React
    //libraryTarget:'var' // commonjs var this umd....
  },
  plugins: [
    // 动态链接库
    new webpack.DllPlugin({ // name == library，用于定位打包资源
      name: '_dll_[name]',
      path: path.resolve(__dirname, 'dist', 'manifest.json') // manifest.json 需要在页面引入 <script src="./manifest.json"></script>
    })
  ]
}