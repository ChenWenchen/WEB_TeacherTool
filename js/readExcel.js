
var studentList = new Array();

var questionList = new Array();

$(document).ready(function(){
    /*
    FileReader共有4种读取方法：
    1.readAsArrayBuffer(file)：将文件读取为ArrayBuffer。
    2.readAsBinaryString(file)：将文件读取为二进制字符串
    3.readAsDataURL(file)：将文件读取为Data URL
    4.readAsText(file, [encoding])：将文件读取为文本，encoding缺省值为'UTF-8'
                 */
    var wb;//读取完成的数据
    var rABS = false; //是否将文件读取为二进制字符串


    function fixdata(data) { //文件流转BinaryString
        var o = "",
            l = 0,
            w = 10240;
        for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
        return o;
    }


    $("#file").change(function(){
        if(!this.files) {
            return;
        }
        var f = this.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            if(rABS) {
                wb = XLSX.read(btoa(fixdata(data)),{
                    type: 'base64'
                });
            } else {
                wb = XLSX.read(data,{
                    type: 'binary'
                });
            }

            // var sheett = wb.Sheets[wb.SheetNames[0]];
            // console.log(sheett);

            var rowObj = XLSX.utils.sheet_to_row_object_array(wb.Sheets[wb.SheetNames[0]])
            //console.log(rowObj);

            for (var p in rowObj[1]){
                //console.log(p);
                questionList.push(p);
            }

            var html1 = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]])
            //console.log(html1);
            $('#demoScoreList').html(html1).css("display","block");

            var obj1 = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
            //console.log(obj1);
            for(var i=0;i<obj1.length;i++){
                for(var p in obj1[i]){

                    var tmpName = obj1[i][p];
                    if(!isNaN(tmpName.charAt(tmpName.length-1))){//去末尾数字
                      tmpName = tmpName.substr(0,tmpName.length-1);
                    }
                    studentList[i]=tmpName;
                    break;
                }
            }
            //document.getElementById("demo").innerHTML= JSON.stringify( XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) );
        };
        if(rABS) {
            reader.readAsArrayBuffer(f);
        } else {
            reader.readAsBinaryString(f);
        }
    })
})