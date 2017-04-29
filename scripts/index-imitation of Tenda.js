// JavaScript Document

$(function () {
  var hovershowDuration = 200, //hover时显示下拉菜单的时间，单位ms
      temp = $(".user-hovershow-toggle"),
      hovershowA = temp[0], //hover时显示下拉菜单的元素
      hovershowB = temp[1], //.
      hovershowedA = $("#hovershow-1")[0], //hover时显示的下拉菜单
      hovershowedB = $("#hovershow-2")[0], //.
      carouselControl = $(".carousel-control"); //轮播图片的翻页按钮
      
  temp = null;
  
  //关闭轮播
  $("#carousel").carousel("pause");
  
  //关闭下拉菜单功能
  $(document).off(".dropdown");
  //关闭transition效果
  //$.support.transition = false;
  //设置自定义的图片加载技术
  $(".user-hovershow-toggle").one("mouseover", getLazyImage);
  //按需求重新添加下拉菜单功能
  $(".dropdown-toggle").dropdown();
  $(document).on("click", ".user-dropdown-toggle", function () {
    $(this).parent().toggleClass("open");
    return false;
  });
  //添加mouseover事件，显示下拉菜单
  $(document).on("mouseover", ".user-hovershow-toggle", hoverSlideDown);
  //添加mouseout事件，隐藏下拉菜单
  $(document).on("mouseout", ".user-hovershow-toggle", hoverSlideUp);
  $(document).on("mouseout", ".hovershow", hoverSlideUp);
  //添加应该在开始就加载的图片
  getLazyImage(".lazy-bg-onload", 768, " @2x");
  //给轮播图片的翻页按钮添加显隐动画
  $("#carousel").hover(function () {
    carouselControl.stop(true).fadeIn(300);
  }, function () {
    carouselControl.fadeOut(300);
  });

  /************************以下是函数定义********************************/
  /*******************************************************************/
  //实现图片延迟加载，根据参数找到img的容器，
  //再根据容器的data-lazy，按顺序给img的src赋值、
  //@param1 selector 可选类型为Event、String，根据该值找到img的容器
  //@param2 width Num 可无，默认无。若有，表示当document.offsetWidth < width时，src加后缀
  //@param3 sufsrc String 可无，默认无。若有，表示当document.offsetWidth < width时，src加后缀。须和width同用。
  //可直接调用，可被用作事件处理程序
  function getLazyImage (selector, width, sufsrc) {
    var $parent, $img, src, suf, lastIndex;
    
    if (typeof selector === "string") {
      $parent = $(selector);
    } else {
      $parent = $($(selector.target).attr("data-target"));
    }
    
    $img = $parent.find("img");
    if (!$img.length) {
      return;
    }
    
    src = $parent.attr("data-lazy");
    
    if (width && document.documentElement.offsetWidth < width) {
      lastIndex = src.lastIndexOf(".");
      suf = src.substring(lastIndex);
      src = src.substring(0, lastIndex);
      src += sufsrc + suf;
    }
    
    if (src.match(/\?/)) {
      $img.each(function (index) {
        this.src = src.replace(/\?/, index);
      });
      return;
    }
    $img.each(function () {
      this.src = src;
    });
    
  }
  //实现背景图的延迟加载，将参数对应的元素的data-target找到img的容器，
  //再根据容器的data-lazy，按顺序给img的src赋值
  //
  function getLazyBackgroundImage (selector) {
    if (!selector) {
      return;
    }
    var $parent = $(selector),
        $img = $parent.find("img"),
        src = $parent.attr("data-lazy-bg"),
        width = document.offsetWidth,
        lastIndex, presrc, sufsrc;
    
    if (width < 768) {
      lastIndex = src.lastIndexOf(".");
      presrc = src.substring(0, lastIndex);
      sufsrc = src.substring(lastIndex);
      src = presrc + " @2x" + sufsrc;
    }

    $img.each(function () {
      $(this).css("backgroundImage", src);
    });
  }
  //mouseover触发显示相应的下拉菜单
  function hoverSlideDown (e) {
    var target = e.target;
    
    if (target === hovershowA) {
      $(hovershowedA).stop(true).slideDown(hovershowDuration);
      return;
    }
    if (target === hovershowB) {
      $(hovershowedB).stop(true).slideDown(hovershowDuration);
      return;
    }
  }
  //mouseout触发显示相应的下拉菜单
  function hoverSlideUp (e) {
    var currentTarget = e.currentTarget,
        relatedTarget = e.relatedTarget;
    
    //如果鼠标移动到了hovershowedA或hovershowedB上，不触发任何事件
    if ($(relatedTarget).closest(".hovershow")[0]) {
      return;
    }
    //鼠标从hovershowA移出
    if (currentTarget === hovershowA) {
      $(hovershowedA).slideUp(hovershowDuration);
    }
    //鼠标从hovershowB移出
    if (currentTarget === hovershowB) {
      $(hovershowedB).slideUp(hovershowDuration);
    }
    //鼠标从hovershowedA移出
    if (currentTarget === hovershowedA) {
      if (relatedTarget === hovershowA) {
        return;
      }
      $(hovershowedA).slideUp(hovershowDuration);
      return;
    }
    //鼠标从hovershowedB移出
    if (currentTarget === hovershowedB) {
      if (relatedTarget === hovershowB) {
        return;
      }
      $(hovershowedB).slideUp(hovershowDuration);
      return;
    }
  }

});