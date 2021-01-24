## Tapable

webpack 本质上是一种事件流的机制，它的工作流就是将各个插件串联起来，而实现这一切的核心就是 Tapable , Tapable 有点类似于 nodejs 的 events 库，核心原理也是依赖于发布订阅模式。