/**
 * 简易的列表左右滑动切换效果
 * 鼠标事件是关键，因此，一些数值写死在方法中，纯测试用
 */
 
define(function(require, exports, module) {
    var Event = require("/study/201304/addEvent.js");
    var _move = function(ele, to, from) {
        // 动画实现
        // ...
    };
    return {
        index: 0,
        visible: 4,
        init: function(box) {
            // box指滚动的列表容器
            var self = this, 
			length = box.getElementsByTagName("li").length;
            Event.addEvent(box.parentNode, "mousewheel", function(event) {
                 if (event.delta > 0 && self.index > 0) {
                    // 往上滚
                    self.index--;
                 } else if (event.delta < 0 && self.index < length - self.visible) {
                     // 往下
                     self.index++;                     
                 } else {
                    return; 
                 }
                 _move(box, -1 * self.index * 140);    
                 event.preventDefault();
            });
        }
    };
});