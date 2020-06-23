//一般直接写在一个js文件中
layui.use(['form','rate','layer','element','layedit','util'], function(){

    var
        $        = layui.jquery
        ,element = layui.element //Tab的切换功能，切换事件监听等，需要依赖element模块
        ,form    = layui.form
        ,util = layui.util;

    //固定块
    util.fixbar({
        bar2: true
        ,css: {right: 30, bottom: 30}
        ,bgcolor: '#393D49'
        ,click: function(type){
            if(type === 'bar2') {
                window.open("./GeneralFeedBack-helper.html")
            }
        }
    });

    //触发事件
    var active = {
        tabAdd: function(){
            //新增一个Tab项
            element.tabAdd('module1', {
                title: '新选项'+ (Math.random()*1000|0) //用于演示
                ,content: '内容'+ (Math.random()*1000|0)
                ,id: new Date().getTime() //实际使用一般是规定好的id，这里以时间戳模拟下
            })
        }
    };



    $('.site-demo-active').on('click', function(){
        var othis = $(this), type = othis.data('type');
        active[type] ? active[type].call(this, othis) : '';
    });

    $('#setQuestion').on('click',function () {
        var tickHtml='<form class="layui-form" action="" lay-filter="questionTick">' +
            '<div class="layui-form-item">\n' +
            '    <div class="layui-input-block">\n' ;
        for(var i=0;i<questionList.length;i++){
            tickHtml+=('<div style="float: left;width: 100px"><input type="checkbox" name="tick'+i+'" title="'+questionList[i]+'"></div>\n');
        }
        tickHtml+='    </div>' + '  </div>' + '</form>';
        layer.open({
            type: 1
            ,title: "请选择哪些题目属于这个模块？" //不显示标题栏
            ,closeBtn: 0
            ,shade: 0.8
            ,id: 'LAYER_NEWEVAL' //设定一个id，防止重复弹出
            ,btn: ['确定', '取消']
            ,btnAlign: 'c'
            ,moveType: 1 //拖拽模式，0或者1
            ,content:tickHtml
            ,area:'auto'
            ,maxWidth:800
            ,yes: function(layero){
                //新增一个大Tab项
                //addOneBigTab($('#newBigName').val());
                var data = form.val("questionTick");
                console.log(data);
                layer.closeAll();
            }
            ,success:function () {
                form.render();
            }
        });
    })

});