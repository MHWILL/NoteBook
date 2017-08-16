var oNav = document.getElementById('nav');
var oShow = oNav.getElementsByTagName('i')[0];
var oBar = document.getElementById('searchBar');
var oHide = oBar.getElementsByTagName('span')[0];
var oAdd = document.getElementById('add');
var oPage2 = document.getElementById('page2');
var oIndex = document.getElementById('index');
var oTxt = oPage2.getElementsByTagName('textarea')[0];
var oBack = oPage2.getElementsByTagName('span')[0];
var oSave = oPage2.getElementsByTagName('span')[1];
var oDele = oPage2.getElementsByTagName('span')[2];
var oNum = oPage2.getElementsByTagName('span')[3];
var oTime = oPage2.getElementsByTagName('time')[0];
var oLists = document.getElementById('lists');
var index = window.localStorage.getItem('num') || 0;
var num = null;
//window.localStorage.clear();
oLists.style.height = document.documentElement.clientHeight-oLists.offsetTop +'px';
if(window.localStorage.getItem('num')) {
	oLists.innerHTML='';
	for(var i = 0; i < index; i++) {
		var oLi = document.createElement('li');
		var oP = document.createElement('p');
		var oSpan = document.createElement('span');
		if(window.localStorage.getItem('addtime' + i) == null) continue;
		oLi.id = i;
		oP.innerHTML = window.localStorage.getItem('content' + i).substring(0, 12);
		oSpan.innerHTML = '今天 ' + window.localStorage.getItem('addtime' + i);
		oLi.appendChild(oP);
		oLi.appendChild(oSpan);
		oLists.appendChild(oLi);
	}
}
if(oLists.childNodes.length == 0){
	oLists.style.lineHeight = oLists.offsetHeight + 'px';
	oLists.innerHTML = '没有数据';
	oLists.className = 'noData';
}else{
	oLists.style.lineHeight='initial';
	oLists.className = '';
}
oLists.addEventListener('click', function(e) {
	var e = e || window.event;
	if(e.target.tagName == 'LI') {
		num = e.target.id;
	} else if(e.target.tagName == 'P' || e.target.tagName == "SPAN") {
		num = e.target.parentNode.id;
	}else{
		return;
	}
	startMove(oIndex, {
		"margin-left": -oIndex.offsetWidth
	}, function() {
		oPage2.style.display = 'block';
		oTxt.value = window.localStorage.getItem('content' + num);
		oTxt.setAttribute('num', num);
		oTime.innerHTML = window.localStorage.getItem('addtime' + num);
		oNum.innerHTML = window.localStorage.getItem('content' + num).length;
		oDele.previousElementSibling.style.display = 'none';
		oDele.style.display = 'block';
	})
}, false);
oTxt.style.minHeight = (document.documentElement.clientHeight - oTxt.offsetTop) + 'px';
//点击返回
oBack.onclick = function() {
	oPage2.style.display = 'none';
	startMove(oIndex, {
		"margin-left": 0
	}, function() {
		oAdd.style.display = 'block';
		window.location.reload();
	})
}
//点击保存、切换删除按钮
oSave.onclick = function() {
	if(num) {
		window.localStorage.setItem('content' + num, oTxt.value);
		window.localStorage.setItem('addtime' + num, getTime());
	} else {
		window.localStorage.setItem('content' + index, oTxt.value);
		window.localStorage.setItem('addtime' + index, getTime());
		oTxt.setAttribute('num', index);
		createList(index);
		index++;
		window.localStorage.setItem('num', index);
	}
	this.style.display = 'none';
	this.nextElementSibling.style.display = 'block';
	oTime.innerHTML = "今天 " + getTime();
}
//点击删除，弹窗确认
oDele.onclick = function() {
	var flag = confirm('确认要删除吗？');
	if(flag) {
		window.localStorage.removeItem('content' + oTxt.getAttribute('num'));
		window.localStorage.removeItem('addtime' + oTxt.getAttribute('num'));
		window.localStorage.removeItem('num' + oTxt.getAttribute('num'));
		oPage2.style.display = 'none';
		startMove(oIndex, {
			"margin-left": 0
		}, function() {
			window.location.reload();
		})
	}
}
//实时现实字数
oTxt.onkeyup = function() {
	oNum.innerHTML = this.value.length;
	if(this.value != window.localStorage.getItem('context' + num)) {
		oDele.style.display = 'none';
		oDele.previousElementSibling.style.display = 'block';
	}
}
//新建文档
oAdd.onclick = function() {
	this.style.display = 'none';
	startMove(oIndex, {
		"margin-left": -oIndex.offsetWidth
	}, function() {
		oPage2.style.display = 'block';
		oTxt.value = '';
		oTime.innerHTML = "今天 " + getTime();
	})
}
//切换搜索条
oShow.onclick = function() {
	oNav.style.display = 'none';
	oBar.style.display = 'flex';
	oBar.getElementsByTagName('input')[0].focus();
}
//切换默认导航
oHide.onclick = function() {
	oNav.style.display = 'flex';
	oBar.style.display = 'none';
}
//获取创建文档的时间
function getTime() {
	var now = new Date();
	var h = now.getHours();
	var m = now.getMinutes();
	if(h < 10) h = '0' + h;
	if(m < 10) m = '0' + m
	return h + ':' + m;
}

function createList(obj) {
	var oLi = document.createElement('li');
	var oP = document.createElement('p');
	var oSpan = document.createElement('span');
	oLi.id = obj;
	oP.innerHTML = window.localStorage.getItem('content' + obj).substring(0, 10);
	oSpan.innerHTML = '今天 ' + window.localStorage.getItem('addtime' + obj);
	oLi.appendChild(oP);
	oLi.appendChild(oSpan);
	oLists.appendChild(oLi);
}