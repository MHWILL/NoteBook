/**
 * @Function 函数功能简述
 * 获取指定元素计算后的样式
 * @DateTime 2017-07-12
 * @param    {[type]}   obj  [对象]
 * @param    {[type]}   attr [属性]
 * @return   {[type]}        [返回属性的值]
 */
function getStyle(obj,attr){
	return obj.currentStyle? obj.currentStyle[attr]:getComputedStyle(obj)[attr];
}

/**
 * @Function 函数功能简述
 * 找到指定父元素下所有指定类名的元素
 * @DateTime 2017-06-30
 * @param    {[type]}   oParent [父元素]
 * @param    {[type]}   sClass  [类名]
 * @return   {[type]}   aResult [返回所有类名的数组]
 */
function getByClass( oParent, sClass ){
	var aEle = oParent.getElementsByTagName('*');
	var i = 0;
	var aResult = [];
	var len = aEle.length;
	for(i=0;i<len;i++){
		if(aEle[i].className == sClass){
			aResult.push(aEle[i]);
		}
	}
	return aResult;
}

/**
 * @Function 函数功能简述
 * 缓冲运动，所有的移动效果
 * width,height,opacity，位置移动等
 * @DateTime 2017-07-12
 * @param    {[type]}   obj  [对象]
 * @param    {[type]}   json [需要改变的属性和值组成的json]
 * @param    {Function} fn   [回调函数]
 * @return   {[type]}        [description]
 */
function startMove(obj,json,fn) {
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		var bStop = true;
		for (var attr in json) {
			var iCur = 0;
			if(attr == 'opacity'){
				iCur = parseInt(parseFloat(getStyle(obj,attr))*100);
			}else{
				iCur = parseInt(getStyle(obj,attr));
			}

			var iSpeed = (json[attr]-iCur)/8;
			iSpeed = iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
			if(iCur!=json[attr]){
				bStop = false;
			}
			if(attr == 'opacity'){
				obj.style.filter = 'alpha(opacity:'+ (iCur+iSpeed) +')';
				obj.style[attr] = (iCur+iSpeed)/100;
			}else{
				obj.style[attr] = iCur+iSpeed +'px';
			}
		}
		if(bStop){
			clearInterval(obj.timer);
			fn&&fn();
		}
	},30)
}
/**
 * @Function 函数功能简述
 * 无缝滚动效果
 * @DateTime 2017-07-11
 * @param    {[type]}   json [传入json参数]
 * json['id']  最外层盒子id名
 * json['dir'] 滚动方向（left/top两个参数）
 * json['iSpeed'] 滚动速度
 * json['prev'] 向上或者向左滚动按钮
 * json['next'] 向下或者向右滚动按钮
 * json['opacity'] 按钮的初始透明度（0~1/0~100）
 * autoPlay 变量 判断json['dir']调用对应的滚动函数
 * autoPlayLeft 左右滚动
 * autoPlayTop 上下滚动
 * iOpacityOld 存取按钮的初始透明度
 * @return   {[type]}        [description]
 */
function scroll(json){
			var oBox = document.getElementById(json['id']);
			var oUl = oBox.getElementsByTagName('ul')[0];
			var aLi = oUl.getElementsByTagName('li');
			var oPrevBtn = document.getElementById(json['prev']) || '';
			var oNextBtn = document.getElementById(json['next']) || '';
			var iSpeed = json['iSpeed'] || 4;
			var iOpacityOld = json['opacity'] || '';
			var timer = null;
			iOpacityOld = iOpacityOld>1? iOpacityOld:parseInt(iOpacityOld*100);
			oUl.innerHTML+=oUl.innerHTML;
			if(json['dir']=='left'){
			  oUl.style.width = aLi.length*aLi[0].offsetWidth+'px';
			}else if(json['dir']=='top'){
			  oUl.style.height = aLi.length*aLi[0].offsetHeight+'px';
			}
			var autoPlay= json['dir']=='left'? autoPlayLeft:autoPlayTop;
			timer=setInterval(autoPlay,30);
			function autoPlayLeft(){
					if(oUl.offsetLeft<=-oUl.offsetWidth/2){
						oUl.style.left = 0;
					}else if(oUl.offsetLeft>=0){
						oUl.style.left = -oUl.offsetWidth/2 +'px';
					}
					oUl.style.left=oUl.offsetLeft+iSpeed+'px';
				}
			function autoPlayTop(){
				if(oUl.offsetTop<=-oUl.offsetHeight/2){
					oUl.style.top = 0;
				}else if(oUl.offsetTop>=0){
					oUl.style.top = -oUl.offsetHeight/2 +'px';
				}
				oUl.style.top=oUl.offsetTop+iSpeed+'px';
			}
			if(oPrevBtn){
				oPrevBtn.onclick=function(){
					iSpeed = -iSpeed;
				}
				oNextBtn.onclick=function(){
					iSpeed = iSpeed;
				}
			}
			oBox.onmouseover=function(){
				clearInterval(timer);
				if(oPrevBtn){
					startMove(oPrevBtn,{opacity:100});
				    startMove(oNextBtn,{opacity:100});
				}
			}
			oBox.onmouseout=function(){
			    timer=setInterval(autoPlay,30);
				if(oPrevBtn){
					startMove(oPrevBtn,{opacity:iOpacityOld});
				    startMove(oNextBtn,{opacity:iOpacityOld});
				}
			}
		}
//绑定事件函数
/**
 * @Function 函数功能简述
 * 模拟Jquery on方法，绑定事件
 * @DateTime 2017-07-12
 * @param    {[type]}   obj   [对象]
 * @param    {[type]}   eName [事件名]
 * @param    {Function} fn    [事件触发的函数]
 * @return   {[type]}         [description]
 */
   function on(obj,eName,fn,bool){
   	if(obj.addEventListener){
   		var bool = bool||false;
   		obj.addEventListener(eName,fn,bool);
   	}else{
   		obj.attachEvent('on'+eName,function(){
   			fn.call(obj);
   		});
   	}
   }
//在对象原型上绑定on属性，对应on方法      error---->所有对象都继承on属性，做循环遍历时会出错
// Object.prototype.on=on;

// function off(obj,eName,fn,bool){
// 	if(obj.addEventListener){
// 		var bool = bool||false;
// 		obj.removeEventListener(eName,fn,bool);
// 	}else{
// 		obj.detachEvent('on'+eName,function(){
// 			fn.call(obj);
// 		});
// 	}
// }
//error---->所有对象都继承on属性，做循环遍历时会出错
// Object.prototype.off=off;
/**
 * @Function 函数功能简述
 * 模拟jquery css方法
 * 通过参数长度判断
 * 只有两个参数则是获取样式
 * 三个参数则是修改样式
 * @DateTime 2017-07-9
 * @param    {[type]}   arguments[0] [对象]
 * @param    {[type]}   arguments[1] [属性]
 * @param    {[type]}   arguments[2] [值]
 */
function css(obj,attr,value){
  if(arguments.length == 2){
      return getStyle(obj,attr);
  }else if(arguments.length == 3){
    obj.style[attr] = value;
  }
}
//在对象原型上绑定css属性，对应css方法
// Object.prototype.css=css;

/**
 * @Function 函数功能简述
 * 抖动效果
 * @DateTime 2017-06-30
 * @param    {[type]}   obj      [抖动对象]
 * @param    {[type]}   dir      [抖动方向]
 * @param    {[type]}   iTarget      [抖动幅度]
 * @param    {[type]}   speed    [抖动速度]
 * @param    {Function} callback [回调函数]
 */
function shake( obj , json, callback ){
	clearInterval(obj.timer);
	var arr = [];
	var num = 0;
	var posi = parseInt(getStyle(obj , json['dir']));
	for( var i=json['iTarget'];i>0;i-=2){
		arr.push(i, -i);
	}
	arr.push(0);
	obj.timer = setInterval(function(){
		obj.style[json['dir']] = posi + arr[num] + 'px';
		num++;
		if(num === arr.length){
			clearInterval(obj.timer);
			callback && callback();
		}
	},30)
}
//碰撞运动
 function bumperMove(obj,json,fn) {
    var iClienH = document.documentElement.clientHeight||document.body.clientHeight;
    var iClienW = document.documentElement.clientWidth||document.body.clientWidth;
    var iSpeedX = json['iSpeedX'];
    var iSpeedY = json['iSpeedY'];
    var iGrav   = json['iGrav'];
      clearInterval(obj.timer);
      obj.timer=setInterval(function(){
      iSpeedY+=iGrav;
      var l=obj.offsetLeft+iSpeedX;
      var t=obj.offsetTop+iSpeedY;
      if(t>=iClienH-obj.offsetHeight||t<=0){
          iSpeedY*=-0.8;
          iSpeedX*=0.8;
          t = t<=0? 0:iClienH-obj.offsetHeight;
      }
      if(l>=iClienW-obj.offsetWidth||l<=0){
        iSpeedX*=-0.8;
        l= l<=0? 0:iClienW-obj.offsetWidth;
      }
      if(Math.abs(iSpeedX)<1){
        iSpeedX=0;
      }
      if(Math.abs(iSpeedY)<1){
        iSpeedY=0;
      }
      if(iSpeedY==0&&iSpeedX==0&&t==iClienH-obj.offsetHeight){
        clearInterval( obj.timer);
      }else{
        obj.style.left=l+'px';
        obj.style.top=t+'px';
      }

      },30)
    }
    //拖拽运动+碰撞运动
    function drag(obj,json){
      obj.onmousedown=function(e){
        var fn=json['fn'];
        var boom=json['boom'];
        var e = e || event;
        var disX = e.clientX - this.offsetLeft;
        var disY= e.clientY - this.offsetTop;
        var iLastX=0;
        var iLastY=0;
        var iSpeedX=0;
        var iSpeedY=0;
        if(obj.setCapture) obj.setCapture();
        document.onmousemove=function(e){
        var e = e || event;
        var iMaxWidth = document.documentElement.clientWidth-obj.offsetWidth;
        var iMaxHeight = document.documentElement.clientHeight-obj.offsetHeight;
        var l=e.clientX - disX;
        var t=e.clientY - disY;
        iSpeedX = l -iLastX;
        iSpeedY = t -iLastY;
        iLastX = l;
        iLastY = t;
          obj.style.left = l + 'px';
          obj.style.top = t + 'px';
          if(obj.offsetLeft<0) obj.style.left = 0;
          else if(obj.offsetLeft>iMaxWidth) obj.style.left = iMaxWidth +'px';
          if(obj.offsetTop<0) obj.style.top = 0;
          else if(obj.offsetTop>iMaxHeight) obj.style.top = iMaxHeight +'px';
        }
        document.onmouseup=function(){
          document.onmousemove=document.onmouseup=null;
          if(obj.setCapture) obj.releaseCapture();
          boom&&bumperMove(obj,{'iSpeedX':iSpeedX,'iSpeedY':iSpeedY,'iGrav':3});
          fn&&fn();
        }
        return false;
      }
    }

