### 用 npm init -y 初始化项目


### 在package.json中创建bin

"bin": {
    "zf-pack": "./bin/zf-pack.js"
},



### 在bin目录下的 zf-pack.js 中指定用 node 运行当前代码

#! /usr/bin/env node

bin 目录下的zf-pack.js 最开始的样子是这样的
```
#! /usr/bin/env node

console.log('start')
```

### 在当前目录用 npm 把包连接到全局下，并在全局下生成命令

执行命令：npm link 
输出信息如下，表示zf-pack命令创建成功
added 29 packages from 49 contributors in 5.908s
C:\Users\Administrator\AppData\Roaming\npm\zf-pack -> C:\Users\Administrator\AppData\Roaming\npm\node_modules\zf-pack\bin\zf-pack.js
C:\Users\Administrator\AppData\Roaming\npm\node_modules\zf-pack -> d:\zhufeng-webpack\webpack-diy\zf-pack


### 把全局包映射到本地

执行命令：npm link zf-pack

d:\zhufeng-webpack\webpack-diy\zf-pack\node_modules\zf-pack -> C:\Users\Administrator\AppData\Roaming\npm\node_modules\zf-pack -> d:\zhufeng-webpack\webpack-diy\zf-pack


### 可以用 npx zf-pack 执行打包

执行 npx zf-pack， 输出 start



compiler 的重要工作

保存入口文件路径
保存所有的模块依赖
建立依赖关系
输出