(function() {

    //head-line-list
    $(".head-line-list").slide({mainCell:".bd ul",effect:"leftLoop",vis: 3});

    //slide ����
    $(".pic-show-01").slide({titCell:".hd ul",mainCell:".bd ul",autoPlay:true,autoPage: true, effect:"leftLoop",vis: 1,interTime: 4000});

    //tab
    $("#tab-01").slide({titCell:".hd li", mainCell:".bd", vis: 1});
    $("#tab-02").slide({titCell:".hd li", mainCell:".bd", vis: 1});
    $(".tab-table").slide({titCell:".hd li", mainCell:".bd", vis: 1});

    //����ع�
    $('#wqhg').slide({titCell:".hd ul",mainCell:".bd",vis: 1,autoPlay:true,interTime: 4000,autoPage:true,trigger:"click"});

})();