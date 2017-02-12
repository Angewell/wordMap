"use strict";

window.addEventListener("load", function(){
	FastClick.attach(document.body);
},false);


$(function(){
	var $win = $(window),
		$doc = $(document),
		$item = $(".item"),
		count = 0,
		max = 11,
	    $p2_inner = $("#p2_inner"),
		$p2_footer = $("#p2_footer"),
		$resetBtn = $("#resetBtn"),
		$againBtn = $("#againBtn"),
		$itemFixed = $("#itemFixed"),
		$mapBox = $("#mapBox"),
		disX,
		disY,
		originalX,
		originalY,
		$p2_footer_tip = $(".p2_footer_tip"),
		$p2_footer_correct = $(".p2_footer_correct"),
		$tipInfo = $("#tipInfo");

		
	// 开始游戏 
	$("#startBtn").click(function(){
		$(".page").removeClass("on");
		$("#page2").addClass('on');
	});



	$win.on("load",resizeBox).on("resize",resizeBox);


	function resizeBox(){
		$p2_inner.css({
			"margin-top": -($p2_inner.height()/2) + "px"
		});
	}


	// 按下
	$item.on("touchstart mousedown", function(e){
		var $this = $(this),
			offset = $this.offset(),
			evt = e.type == "mousedown" ? e : e.originalEvent.touches[0];

			disX = evt.clientX - offset.left;
			disY = evt.clientY - offset.top;

		if($this.hasClass('fix')){
			return;
		}

		originalX = offset.left;
		originalY = offset.top;

		$this.removeClass('resetPositioin').addClass('fix').css({
			opacity: 0.8,
			top: offset.top + "px",
			left: offset.left + "px",
			"-webkit-transform": "scale(1.05)",
			"transform": "scale(1.05)"
		});

		// 拖动
		$doc.on("touchmove mousemove", function(e){
			e.preventDefault();
			var evt = e.type == "mousemove" ? e : e.originalEvent.touches[0],
				nowX = evt.clientX,
				nowY = evt.clientY;

			$this.css({
				top: nowY - disY + "px",
				left: nowX - disX + "px"
			});
		});
	})

	// 释放
	.on("touchend mouseup", function(e){
		var $this = $(this);

		if($this.hasClass('correct')){
			return;
		}

		// 如果不正确
		if(!isCorrect($this, e)){
			$this.addClass('resetPositioin');
			$this.css({
				top: originalY + "px",
				left: originalX + "px"
			});
			setTimeout(function(){
				$this.removeClass('fix');
			},500);

		// 正确
		}else{
			$this.addClass('correct');
			count++;
			if(count == max){
				$p2_footer_tip.removeClass('show');
				$p2_footer_correct.addClass('show');
			}
		}

		$doc.off("touchmove mousemove");
		$this.css({
			opacity: 1,
			"-webkit-transform": "scale(1)",
			"transform": "scale(1)"
		});
	});


	// 重置/再玩一次
	$("#resetBtn, #againBtn").click(function(){
		reset();
	});

	// 游戏操作说明
	$("#tipBtn").click(function(){
		$tipInfo.show();
	});


	// 重置游戏
	function reset(){
		count = 0;
		$item.removeClass('fix correct').appendTo($(".itemBox"));
		$tipInfo.hide();
		$p2_footer_correct.removeClass('show');
		$p2_footer_tip.addClass('show');
	}


	// 判断是否放对位置
	function isCorrect($this,e){
		var $targets = $("." + $this.data("target")),
			len = $targets.length,
			evt = e.type == "mouseup" ? e : e.originalEvent.changedTouches[0],
			nowX = evt.clientX,
			nowY = evt.clientY;

		for(var i = 0; i < len; i++){
			var $target = $targets.eq(i),
				strict = {
					minX: $target.offset().left,
					maxX: $target.offset().left + $target.width(),
					minY: $target.offset().top,
					maxY: $target.offset().top + $target.height()
				};

			if(nowX >= strict.minX && nowX <= strict.maxX && nowY >= strict.minY && nowY <= strict.maxY){
				var mapBox_offset = $mapBox.offset();

				$this.css({
					top: (nowY - mapBox_offset.top - disY) / $mapBox.height() * 100 + "%",
					left: (nowX -mapBox_offset.left - disX) / $mapBox.width() * 100 + "%"
				}).appendTo($itemFixed);

				console.log(mapBox_offset);
				return true;
			}
		}

		return false;
	}
});