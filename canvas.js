function thumbnial(){
	
	//相关常量
	const NAVBUTTON_XOFFSET = 5;
	const NAVBUTTON_YOFFSET = 8;
	const NAVBUTTON_WIDTH = 20;
	const PAINT_INTERVAL = 20;	
	const NAVBUTTON_ARROW_XOFFSET = 5;
	const NAVBUTTON_ARROW_YOFFSET = 15;
	const IDLE_TIME_OUT = 3000;
	const NAVPANEL_HEIGHT = 60;
	const THUMBNAIL_LENGTH = NAVPANEL_HEIGHT - NAVBUTTON_YOFFSET*2;
	const MIN_THUMBNAIL_LENGTH = 10;
	const ARROW_HEIGHT = 10;
	const BORDER_WRAPPER = 2;


	//当前图片的index
	var currentImage=0;

	var navRect;
	var lButtonRect;
	var idleTime = 0;
	var lastPos;
	//导航栏的倍数
	var count=0;
	//总的导航栏倍数
	var count1;
	var loop=null;

	var imageLocations = [
		'2006111642417.jpg',
		'200611145819.jpg',
		'2006111642417.jpg',
		'2006109173628.jpg',
		'2006109173628.jpg',
		'200611145819.jpg',
		'2006111642417.jpg',
		'2006109173628.jpg',
		'2006109173628.jpg',
		'200611145819.jpg',
		'2006111642417.jpg',
		'2006109173628.jpg',
		'2006109173628.jpg',
		'200611145819.jpg',
		'2006111642417.jpg',
		'2006109173628.jpg',
		'2006109173628.jpg',
		'200611145819.jpg',
		'2006111642417.jpg',
		'2006109173628.jpg',
		'2006109173628.jpg',
		'200611145819.jpg',
		'200611145842.jpg',
		'200611145842.jpg',
		'200611145842.jpg',
		'200611145842.jpg',
		'200611145842.jpg',
		'200611145842.jpg',
		'200611145842.jpg'
	];
	var imageCount = imageLocations.length;
	var images = new Array(imageCount);

	var canvas=document.getElementById('canvas');
	var context=canvas.getContext('2d');
	this.load=function(){
		loadImage();
		resize();
		window.onresize=resize;
		//绑定点击事件
		canvas.onclick=onMouseClick;
		canvas.onmousemove = onMouseMove;
	}
	function getTime() {
		return new Date().getTime();
	}

	function updateIdleTime() {
		idleTime = getTime();
		
	}
	function onMouseMove(e){
		lastPos={x:e.clientX,y:e.clientY}
		if(loop)clearInterval(loop)
		updateIdleTime();
		paint();
		loop=setInterval(paint,1000)
	}
	function onMouseClick(e){
		//鼠标位置
		position={x:e.clientX,y:e.clientY};
		//保存位置信息
		lastPos=position;
		//判断是否在左边按钮区域
		if (pointIsInRect(position, lButtonRect)) {
			nextPane(true);
		} else if (pointIsInRect(position, rButtonRect)) {
			nextPane(false);
		} else {
			//获取index的相位置
			var selectedIndex= findSelectImageIndex(position)
			//获取index的绝对位置
			var selectedIndex1 = findSelectImageIndex(position)+maxThumbNailCount*count;

			if (selectedIndex != -1) {

				selectImage(selectedIndex1);
			}
		}
		// updateIdleTime();
	}
	//导航栏的前后页面
	function nextPane(bool){
		if(bool){	
			if(count<=0){
				count=0
			}else{
				count--
			}
		}else{
			if(count<count1){
				count++
			}else{
				count=count1;
			}
		}
		paint();
	}
	//切换图片
	function selectImage(index) {
		currentImage = index;
		paint();
	}
	//获取当前点击的图片的相对i
	function findSelectImageIndex(pos){
		for(var i = 0; i < imgRects.length; i++) {
			if (pointIsInRect(pos, imgRects[i].rect))
				return i ;
		}
		return -1;

	}
	//检查是否在相应的缩略图或按钮内
	function pointIsInRect(point, rect) {
		return (rect.x < point.x && point.x < rect.x + rect.width && 
				rect.y < point.y && point.y < rect.y + rect.height);
	}
	
	//预加载图片
	function loadImage(){
		var img_count=imageLocations.length;
		for(var i=0;i<img_count;i++){
			var img=new Image();
			img.src=imageLocations[i];
			images[i]=img
		}
	}
	function resize(){
		var size=getScreenSize();
		canvas.width=size.width;
		canvas.height=size.height;
		
		paint();
	}
	function paint(){
		context.clearRect(0,0,canvas.width,canvas.height);
		//绘制大图
		paintImg(currentImage);
		//记录鼠标点击时的位置信息
		var paintInfo = {inLeftBtn:false, inRightBtn:false, inThumbIndex: null}

		if (lastPos && navRect && lButtonRect && rButtonRect) {
			if (pointIsInRect(lastPos, navRect)) {
				paintInfo.inLeftBtn = pointIsInRect(lastPos, lButtonRect);
				paintInfo.inRightBtn = pointIsInRect(lastPos, rButtonRect);
				if (!paintInfo.inLeftBtn && !paintInfo.inRightBtn) {
					var index = findSelectImageIndex(lastPos);
					if (index != -1) {
						paintInfo.inThumbIndex = index;
					}
				}
			}
		}
		if(idleTime && getTime() - idleTime <= IDLE_TIME_OUT) {
			paintNavigator(paintInfo);
		}
	}

	function paintNavigator(paintInfo){
		//导航栏的区域
		navRect={
			x:canvas.width*(1-0.8)/2,
			y:canvas.height-60,
			width:canvas.width*0.8,
			height:60
		}
		context.save();
		context.fillStyle="rgba(100, 100, 100, 0.2)";
		context.fillRect(navRect.x,navRect.y,navRect.width,navRect.height);
		context.restore();
		paintLeftButtom(navRect,paintInfo && paintInfo.inLeftBtn?'rgba(100, 100, 100, 0.6)': 'rgb(40, 40, 40)' );
		paintRightButtom(navRect,paintInfo && paintInfo.inRightBtn?'rgba(100, 100, 100, 0.6)': 'rgb(40, 40, 40)');
		paintThumbNails(paintInfo? paintInfo.inThumbIndex:null);
	}
	//缩略图
	function paintThumbNails(index){
		if(index != null) {
			index=index;
		} else {
			index = -1;
		}
		var thumbnail_length = rButtonRect.x - lButtonRect.x - lButtonRect.width;
		//小图片加间隙后的最多个数
		maxThumbNailCount = Math.ceil(thumbnail_length/ (THUMBNAIL_LENGTH + MIN_THUMBNAIL_LENGTH));
		//小图片的偏移量
		offset = (thumbnail_length - THUMBNAIL_LENGTH * maxThumbNailCount) / (maxThumbNailCount + 1);
		count1=Math.floor(imageCount/maxThumbNailCount);
		//实际放的图片个数
		if(imageCount<maxThumbNailCount){

			thumbNailCount=imageCount
		}else{
			if(count==0){
				thumbNailCount=maxThumbNailCount
			}else{
				thumbNailCount=imageCount-maxThumbNailCount*count>maxThumbNailCount?maxThumbNailCount:imageCount-maxThumbNailCount*count;
			}	
		}
		imgRects=new Array(thumbNailCount);
		for(var i=0;i<thumbNailCount;i++){
			var tmp_img=images[i+count*maxThumbNailCount];
			context.save();
			var x=lButtonRect.x+lButtonRect.width+(offset+THUMBNAIL_LENGTH)*i;
			//对原始图片裁剪成小图片
			srcRect = getSlicingSrcRect({width:tmp_img.width, height:tmp_img.height}, {width:THUMBNAIL_LENGTH, height: THUMBNAIL_LENGTH});
			//缩略图信息和位置
			imgRects[i]={
				image:tmp_img,
				rect:{
					x:x+offset,
					y:navRect.y+8,
					width:THUMBNAIL_LENGTH,
					height:THUMBNAIL_LENGTH
				}
			}
			context.translate(x,navRect.y);
			context.drawImage(imgRects[i].image,srcRect.x,srcRect.y,srcRect.width,srcRect.height,offset,index==i?4:8,THUMBNAIL_LENGTH,THUMBNAIL_LENGTH);
			context.restore();
			//放大缩略图
			if(index==i){
				paintHighLightImage(x-(THUMBNAIL_LENGTH/2),srcRect,imgRects[i].image)
			}
		}
	}
	//向上移动的效果
	function paintHighLightImage(x,srcRect,imgRect){
		var scale=imgRect.width==srcRect.width?THUMBNAIL_LENGTH/imgRect.width:THUMBNAIL_LENGTH/imgRect.height;
		scale*=1.5;
		//装缩略图的容器
		var destRect = {
			x:x, 
			y:navRect.y - ARROW_HEIGHT - BORDER_WRAPPER - imgRect.height*scale, 
			width: imgRect.width * scale, 
			height: imgRect.height * scale
		}
		//白色边框
		var wrapperRect = {
			x: destRect.x - BORDER_WRAPPER, 
			y: destRect.y - BORDER_WRAPPER,
			width: destRect.width + BORDER_WRAPPER * 2,
			height: destRect.height + BORDER_WRAPPER * 2
		}

		var arrowWidth = ARROW_HEIGHT * Math.tan(30/180*Math.PI);
		context.save();
		context.fillStyle = 'white';
		context.translate(wrapperRect.x, wrapperRect.y);
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(wrapperRect.width, 0);
		context.lineTo(wrapperRect.width, wrapperRect.height);
		context.lineTo(wrapperRect.width/2 + arrowWidth, wrapperRect.height);
		context.lineTo(wrapperRect.width/2, wrapperRect.height+ARROW_HEIGHT);
		context.lineTo(wrapperRect.width/2 - arrowWidth, wrapperRect.height);
		context.lineTo(0, wrapperRect.height);
		context.lineTo(0, 0);
		context.closePath();
		context.fill();
		context.drawImage(imgRect,BORDER_WRAPPER,BORDER_WRAPPER,destRect.width,destRect.height)
		context.restore()
	}
	//对原始图片进行缩放
	function getSlicingSrcRect(img_obj,rect_obj){
		var img_scale=img_obj.width/img_obj.height;
		var rect_scale=rect_obj.width/rect_obj.height;
		var sRect = {x:0, y:0, width:0, height:0};
		if(img_scale>rect_scale){
			var scale=img_obj.height/rect_obj.height;
			sRect.x=(img_obj.width-rect_obj.width*scale)/2;
			sRect.y=0;
			sRect.width=rect_obj.width*scale;
			sRect.height=img_obj.height;
			return sRect;
		}else{
			var scale=img_obj.width/rect_obj.width;
			sRect.x=0;
			sRect.y=(img_obj.height-rect_obj.height*scale)/2
			sRect.width=img_obj.width;
			sRect.height=rect_obj.height*scale;
			return sRect
		}
	}
	//绘制右边按钮
	function paintRightButtom(navRect,color){
		rButtonRect = {
			x: navRect.x + navRect.width - NAVBUTTON_XOFFSET - lButtonRect.width,
			y: lButtonRect.y,
			width: lButtonRect.width,
			height: lButtonRect.height
		}
		context.save();
		context.fillStyle=color;
		context.fillRect(rButtonRect.x,rButtonRect.y,rButtonRect.width,rButtonRect.height);
		context.save();
		context.fillStyle='rgb(255, 255, 255)';
		context.beginPath()
		context.moveTo(rButtonRect.x + NAVBUTTON_ARROW_XOFFSET, rButtonRect.y + NAVBUTTON_ARROW_YOFFSET);
		context.lineTo(rButtonRect.x + rButtonRect.width - NAVBUTTON_ARROW_XOFFSET, rButtonRect.y + rButtonRect.height/2);
		context.lineTo(rButtonRect.x + NAVBUTTON_ARROW_XOFFSET, rButtonRect.y + rButtonRect.height - NAVBUTTON_ARROW_YOFFSET);
		context.lineTo(rButtonRect.x + NAVBUTTON_ARROW_XOFFSET, rButtonRect.y + NAVBUTTON_ARROW_YOFFSET);
		context.closePath();
		context.fill();
		context.restore();
		context.restore();
	}
	//绘制左边按钮
	function paintLeftButtom(navRect,color){
		lButtonRect={
			x: navRect.x + NAVBUTTON_XOFFSET,
			y: navRect.y + NAVBUTTON_YOFFSET,
			width: NAVBUTTON_WIDTH,
			height: navRect.height - NAVBUTTON_YOFFSET * 2
		}
		context.save();
		context.fillStyle=color;
		context.fillRect(lButtonRect.x,lButtonRect.y,lButtonRect.width,lButtonRect.height);
		context.save();
		context.fillStyle='rgb(255, 255, 255)';
		context.beginPath()
		context.moveTo(lButtonRect.x + NAVBUTTON_ARROW_XOFFSET, lButtonRect.y + lButtonRect.height/2);
		context.lineTo(lButtonRect.x + lButtonRect.width - NAVBUTTON_ARROW_XOFFSET, lButtonRect.y + NAVBUTTON_ARROW_YOFFSET);
		context.lineTo(lButtonRect.x + lButtonRect.width - NAVBUTTON_ARROW_XOFFSET, lButtonRect.y + lButtonRect.height - NAVBUTTON_ARROW_YOFFSET);
		context.lineTo(lButtonRect.x + NAVBUTTON_ARROW_XOFFSET, lButtonRect.y + lButtonRect.height/2);
		context.closePath();
		context.fill();
		context.restore();
		context.restore();
	}
	//绘制大图
	function paintImg(index){
		var image=images[index];
		var show_h=canvas.height;
		var show_w=canvas.width;
		var scale=getScale({width:image.width,height:image.height},{width:show_w,height:show_h})
		var image_h=image.height*scale;
		var image_w=image.width*scale;
		context.drawImage(image, (show_w - image_w)/2, (show_h - image_h)/2, image_w, image_h);
	}
	//对原始图片宽高进行调整
	function getScale(image_obj,show_obj){
		var show_scale=show_obj.width/show_obj.height;
		var image_scale=image_obj.width/image_obj.height;
		if(image_scale<show_scale){
			return  show_obj.height/image_obj.height;
		}else{
			return show_obj.width/image_obj.width ;
		}
	}
	//获取屏幕尺寸
	function getScreenSize(){
		return {width:document.documentElement.clientWidth,height:document.documentElement.clientHeight}
	}
}

window.onload=function(){
	thumb=new thumbnial();
	thumb.load();
}