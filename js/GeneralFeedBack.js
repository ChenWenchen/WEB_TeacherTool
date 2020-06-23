$(document).ready(function(){
    //enable复制按钮
    var clipboard = new ClipboardJS('.btn');
    
	//合成结果
    $("#GenerateReport").on('click',function () {
		//获取模板内容
        var repTpl = document.getElementById("reportTpl").value;
		//清空结果区域
        document.getElementById("reportResult").innerHTML="";
		//遍历打分table
        var trs = Array.from(document.getElementsByClassName("studentTr"));
		//遍历table每行（每个学生一行）
        trs.forEach(function (item,index) {
			//复制模板
            var repTplCpy = repTpl;
            //children数组是行中所有td构成的数组，children[0]是放名字的td
            var children = Array.from(item.children);
            var name = children[0].firstChild.textContent
            repTplCpy=repTplCpy.replace(/【姓名】/g,name);
            repTplCpy=repTplCpy.replace(/【姓名2】/g,name.substr(name.length-2,name.length));
			//遍历该行所有打分器
            for(var i=1;i<children.length;i++){
                var ra = children[i].firstChild.getAttribute("rating");
                if(ra!=0){
                    repTplCpy=repTplCpy.replace("【评价"+i+"】",arrWords[i-1][wordsTags[i-1][ra-1]]);
                }
            }
            var htmll = "<div class='rDiv'><textarea style='overflow:scroll; width:100px; height:150px' id='Name"+index+"' type='text’ class='outcome'>";
            htmll += children[0].firstChild.textContent;
            htmll += "</textarea><button class='btn' data-clipboard-action='copy' data-clipboard-target='#Name"+index+"'> 复制</button><textarea style='overflow:scroll; width:350px; height:150px' id='Report"+index+"' type='text’ class=‘outcome'>";
            htmll += repTplCpy;
            htmll += "</textarea><button class='btn' data-clipboard-action='copy' data-clipboard-target='#Report"+index+"'> 复制</button></div>";
			//插入结果区域
            $("#reportResult").append(htmll);
        })
    })
});
var BigId = 0 ;
var SmallId = 3;

var WordsObj = new Object();//JSON

var arrBig = new Array();//一维数组装评价项目名字

var arrWords = new Array();//对象数组，每个对象是一个评价项目，对象中的key为等级名，val为对应评价话术

var wordsTags = new Array();//二维数组，存评价话术

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
        addSmallTab: function(){
		    var dad = $(this).attr("mydad");
			layer.open({
				type: 1
				,title: "新建的评价等级叫做？" //不显示标题栏
				,closeBtn: 0
				,shade: 0.8
				,id: 'LAYER_NEWEVALLEVEL' //设定一个id，防止重复弹出
				,btn: ['确定', '取消']
				,btnAlign: 'c'
				,content:
					  '<input type="text" id="newSmallName" autocomplete="off" placeholder="请输入新增评价等级" class="layui-input">'
				,yes: function(layero){
					//新增一个小Tab项
					addOneSmallTab($('#newSmallName').val(),dad,SmallId);
					layer.closeAll();
				  }
			  });
        }
  };

  $('.site-demo-active').on('click', function(){
        var othis = $(this), type = othis.data('type');
        active[type] ? active[type].call(this, othis) : '';
    });

  $('#BigTabAddBnt').click(function () {
      layer.open({
          type: 1
          ,title: "新建的评价项目叫做？" //不显示标题栏
          ,closeBtn: 0
          ,shade: 0.8
          ,id: 'LAYER_NEWEVAL' //设定一个id，防止重复弹出
          ,btn: ['确定', '取消']
          ,btnAlign: 'c'
          ,moveType: 0 //拖拽模式，0或者1
          ,content: '<input type="text" id="newBigName" autocomplete="off" placeholder="请输入新评价项目名称" class="layui-input">\n'
          ,yes: function(layero){
              //新增一个大Tab项
              addOneBigTab($('#newBigName').val());
              layer.closeAll();
          }
      });
  });

  //新建大Tab
  function addOneBigTab(tabName){
    element.tabAdd('BigTab', {
        title: tabName
        ,content:
            '\t\t\t\t\t\t<div class="layui-tab layui-tab-card" lay-filter="demoBig'+BigId+'" lay-allowclose="true">\n' +
            '\t\t\t\t\t\t\t<ul class="layui-tab-title">\n' +
            '\t\t\t\t\t\t\t\t<li lay-id="small0" class="layui-this" >'+tabName+'不好</li>\n' +
            '\t\t\t\t\t\t\t\t<li lay-id="small1">'+tabName+'一般</li>\n' +
            '\t\t\t\t\t\t\t\t<li lay-id="small2">'+tabName+'很好</li>\n' +
            '\t\t\t\t\t\t\t</ul>\n' +
            '\t\t\t\t\t\t\t<div class="layui-tab-content">\n' +
            '\t\t\t\t\t\t\t\t<div class="layui-tab-item layui-show">\n' +
            '\t\t\t\t\t\t\t\t\t<!-------------------设置术语的表单------------------>\n' +
            '\t\t\t\t\t\t\t\t\t\t\t\t<input type="text" smallword="不好" name="wordsBig'+BigId+'-0'+'" autocomplete="off" placeholder="请输入'+tabName+'不好的话术" class="layui-input kidBig'+BigId+'">\n' +
            '\t\t\t\t\t\t\t\t\t<!-------------------设置术语的表单------------------>\n' +
            '\t\t\t\t\t\t\t\t</div>\n' +
            '\t\t\t\t\t\t\t\t<div class="layui-tab-item">\n' +
            '\t\t\t\t\t\t\t\t\t\t\t\t<input type="text" smallword="一般" name="wordsBig'+BigId+'-1'+'" autocomplete="off" placeholder="请输入'+tabName+'一般的话术" class="layui-input kidBig'+BigId+'">\n' +
            '\t\t\t\t\t\t\t\t</div>\n' +
            '\t\t\t\t\t\t\t\t<div class="layui-tab-item">\n' +
            '\t\t\t\t\t\t\t\t\t\t\t\t<input type="text" smallword="很好" name="wordsBig'+BigId+'-2'+'" autocomplete="off" placeholder="请输入'+tabName+'很好的话术" class="layui-input kidBig'+BigId+'">\n' +
            '\t\t\t\t\t\t\t\t</div>\n' +
            '\t\t\t\t\t\t\t</div>\n' +
            '<div style="text-align: right ;margin:0 10px 10px;"><button dadWord="'+tabName+'" mydad="Big'+ BigId +'" class="SmallTabAddBnt  layui-btn-primary layui-btn-sm site-demo-active" data-type="addSmallTab" >\n' +
            '\t\t\t\t\t\t\t<i class="layui-icon">&#xe61f;</i> "'+tabName+'"评价等级\n' +
            '\t\t\t\t\t\t</button></div>\n'+
            '\t\t\t\t\t\t</div>'
        ,id: 'Big'+BigId
    })
	//绑定新建的BigTab中的新增按钮
    $('.site-demo-active').on('click', function(){
        var othis = $(this), type = othis.data('type');
        active[type] ? active[type].call(this, othis) : '';
    });
	//绑定新BigTab中的默认的input的Change监听
	$("input[name*='wordsBig']").off('change').on('change',function(){updateWordsObj();})
	//激活新建的BigTab
	$('[lay-id='+'Big'+BigId+']').click();
	//BigTab计数增加
	BigId++;
  }

  //新建小Tab
  function addOneSmallTab(newName,dad,SmallId){
      element.tabAdd('demo'+dad, {
            title: newName
            ,content: '<input type="text" smallword='+newName+' name="words'+dad+'-'+SmallId+
              '" autocomplete="off" placeholder="请输入'+newName+'的话术" class="layui-input kid'+dad+'">'
            ,id: 'small'+SmallId
      })
	  //绑定新增的input的Change监听
	  $("[name*='wordsBig']").off('change').on('change',function(){updateWordsObj();})
	  //激活新建小tab
      $("[lay-id=small"+SmallId+"]").click();
      SmallId++;
  };

  //"填好了"
  layui.$('#GetWordsBnt').on('click', function(){
		updateWordsObj();
		renderRaters();
        layer.msg('请下滑到第三步打分吧', {
          time: 1000,
        });
  });

  //导入已有模板
  layui.$('#ImportTpl').on('click',function (){
      layer.open({
          type: 1
          ,title: "导入已有的话术模板" //不显示标题栏
          ,closeBtn: 0
          ,shade: 0.8
          ,id: 'LAYER_NEWEVAL' //设定一个id，防止重复弹出
          ,btn: ['确定', '取消']
          ,btnAlign: 'c'
          ,content: '<input type="text" id="renewTpl" autocomplete="off" placeholder="请输入模板结构" class="layui-input">\n'
          ,yes: function(layero){
              //新增一个大Tab项
              var tpl = $('#renewTpl').val();
              try{
                  WordsObj = JSON.parse(tpl);
              }catch (e) {
				  console.log(e);
                  layer.msg('输入的模板结构不合规范，请重新导入或重新制定评价规则', {
                      time: 3000});
                  return;
              }
              if(tpl=="{}"){
                  layer.closeAll();
                  layer.msg('未输入内容', {
                      time: 1000});
                  return;
              }
              DIYWordsObj(tpl);
              renderRaters();
              layer.closeAll();
              layer.msg('请下滑到第三步打分吧', {
                  time: 2000});
          }
      });
  });

  //保存已填话术
  layui.$('#SaveTpl').on('click',function (){
	updateWordsObj();
	layer.open({
		type: 1
		,title: '复制保存下列文字，可用于下次快速导入' //不显示标题栏
		,closeBtn: 1
		,shade: 0.8
		,id: 'LAYER_COPYTIPS' //设定一个id，防止重复弹出
		,content: '<div id="jsonTpl" style="margin: 10px">'+JSON.stringify(WordsObj)+
			"</div><div style=\"margin: 10px;text-align: center\"><button class='btn' data-clipboard-action='copy' data-clipboard-target='#jsonTpl'> 复制</button></div>"
	});
  });

  //初始化两个评价项目
  addOneBigTab("上课状态") ;
  addOneBigTab("作业情况") ;
  $("[lay-id='Big1']").click();
  $("[lay-id='Big0']").click();

});

function renderRaters() {

    document.getElementById("raterArea").innerHTML="";
    layui.use(['rate'], function(){
        var myrate=layui.rate;
        var html="";

        //表头（第一行）
        var raterHead = "<tr><th style='"+"font:20px' class='studentName'>姓名</th>";
        for(var j = 0; j<arrBig.length; j++){
            raterHead += ("<th>"+arrBig[j]+"</th>");
        }
        raterHead += "</tr>";

        //每人一行
        for(var i = 0;i<studentList.length;i++){
            html += ("<tr class='studentTr'><td><span class='studentName'>"+studentList[i]+"</span></td>");
            for(var j = 0; j<arrBig.length; j++){
                html += ("<td><div class='myRaters' id='rater"+i+"-"+j+"'></div></td>");
            }
            html += ("</tr>")
        }

        var tab = document.getElementById('raterArea');
        tab.innerHTML = raterHead + html;

        for(var i = 0;i<studentList.length;i++){
            for(var j =0; j<arrBig.length; j++){
                var raterID = "#rater"+i+"-"+j;
                var starN = Object.keys(arrWords[j]).length;
                wordsTags[j]=Object.keys(arrWords[j]);
                myrate.render({
                    elem:raterID,
                    length:starN,
                    text:true,
                    setText: function(value){
                        thisID=this.elem[0].id

                        var n = thisID[thisID.length-1]
                        this.span.text( wordsTags[n][value-1] || ( value + "星"));

                        var thisR = document.getElementById(thisID);
                        thisR.setAttribute("rating",value);
                    }
                })
            }
        }
    });
}

//通过所有input的内容更新WordsObj、arrBig、arrWords
function updateWordsObj(){
	//重写这些变量
	WordsObj = new Object()
	arrBig = new Array();
	arrWords = new Array();
    //获取每一个大tab中独有的add按钮
	forms = Array.from(document.getElementsByClassName("SmallTabAddBnt"));
	forms.forEach(function(item,index){
		
		//该大tab标题
		var bigword = item.attributes['dadWord'].value;
		//构造obj{不好：“xxx”，一般：“xxx”，很好：”xxxxxx“}
		var objtmp = new Object();
		//用add按钮返回寻找对应的大tab
		var dad = item.attributes['mydad'].value;
		//获取该大tab下的所有输入框
		var allsmallInput = Array.from(document.getElementsByClassName("kid"+dad));
		allsmallInput.forEach(function (item,index) {
			var s = item.attributes['smallword'].value;
			objtmp[s]=item.value;
		})
	
		//数组记录
		arrBig[index]=bigword;//普通字符串数组
		arrWords[index]=objtmp;//对象数组
		//json对象记录
		WordsObj[bigword]=objtmp;
	});
}


function DIYWordsObj(str){
    //重写这些变量
    WordsObj = JSON.parse(str);
    arrBig = new Array();
    arrWords = new Array();
    for(var p in WordsObj){
        arrBig.push(p);
        var tmpObj = new Object();
        for (var pp in WordsObj[p]){
            tmpObj[pp]=WordsObj[p][pp];
        }
        arrWords.push(tmpObj);
    }
}
