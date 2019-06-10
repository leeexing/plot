/**
* @author zhipeng P 
* @project time: 2016/6/14
*/
//Module3D.js
var Module3D = {name:"Module3D",version:"0.0.0"};

Module3D.Width = 800;
Module3D.Height = 600;

//!3D模块初始化
//!divId: 容器ID
//!width，height:容器的大小
Module3D.Initialize= function(divId,width,height){
	
	if(!Detector.webgl)
	{
		alert("Your Broswer Doesn't Support WEBGL!");
		Detector.addGetGLMessage();
		return false;
	}
	//调用Rendering的初始化函数
	//console.log(Module3D.Rendering);
	var result = Module3D.Rendering.Initialize(divId,width,height);
	result |= Module3D.Event.Initialize();
	
	return result;
};

//!设置窗口大小
//! width & height:窗口大小
Module3D.SetWindowSize = function(width,height){
	Module3D.Rendering.OnWindowSize(width,height);
	return true;
}

Module3D.GetWindowSize = function(){
	
	return Module3D.Rendering.GetWindowSize();
}