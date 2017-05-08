// JavaScript Document
/*window.addEventListener("load", function () {
  //scrollTo(0, 5000);
  setTimeout(function () {
    scrollTo(0, 1000);
  }, 300);
  setTimeout(function () {
    scrollTo(0, 1500);
  }, 600);
  //$("#modal-wx-toggle").trigger("click");
});*/
//console.log(console.assert);
$(function () {
  var hovershowDuration = 200, //hover时显示下拉菜单的时间，单位ms
      temp = $(".user-hovershow-toggle"),
      hovershowA = temp[0], //hover时显示下拉菜单的元素
      hovershowB = temp[1], //.
      hovershowedA = $("#hovershow-1")[0], //hover时显示的下拉菜单
      hovershowedB = $("#hovershow-2")[0], //.
      $carouselControl = $(".carousel-control"), //轮播图片的翻页按钮
      $lazyArray = $(".lazy"), //需要延迟加载的图片
      TopButtonVisibility = false, //返回顶部按钮是否可见
      xs = $(window).width() < 768 ? true : false; //现在是不是xs
      
  temp = null;
  
  //关闭轮播
  //$("#carousel").carousel("pause");
  
  //关闭下拉菜单功能
  $(document).off(".dropdown");
  //关闭transition效果
  //$.support.transition = false;
  //设置自定义的图片加载技术
  $(".user-hovershow-toggle").one("mouseover", getGroupLazyImage);
  //按需求重新添加下拉菜单功能
  $(".dropdown-toggle").dropdown();
  $(document).on("click", ".user-dropdown-toggle", function () {
    $(this).parent().toggleClass("open");
    return false;
  });
  //添加导航栏显示、隐藏下拉菜单事件
  $(".user-hovershow-toggle").hover(hoverSlideDown, hoverSlideUp);
  $(".hovershow").on("mouseout", hoverSlideUp);
  //添加应该在开始就加载的图片
  getGroupLazyImage(".lazy-onload", 768, " @2x");
  //给轮播图片的翻页按钮添加显隐动画
  $("#carousel").hover(function () {
    $carouselControl.stop(true).fadeIn(300);
  }, function () {
    $carouselControl.fadeOut(300);
  });
  //给轮播图片设置window的resize事件，当$(window).width()在768上下浮动时，
  //轮播图片需要在@2x和非@2x之间浮动
  $(window).on("resize", function () {
    var viewWidth = $(window).width();
    if (viewWidth >= 768 && xs) {
      getGroupLazyImage("#carousel .lazy-onload");
      xs = false;
    } else if (viewWidth < 768 && !xs) {
      getGroupLazyImage(".lazy-onload", 768, " @2x");
      xs = true;
    }
  });
  //设置图片延迟加载事件
  lazyImagehandler();
  //给返回顶部按钮添加click事件和scroll显隐事件
  $("#top").on("click", function () {
    scrollTo(0, 0);
  });
  $(window).on("scroll", function () {
    var scrollTop = $(window).scrollTop();
    if (scrollTop >= 200 && !TopButtonVisibility) {
      $("#top").stop(true).fadeIn("slow");
      TopButtonVisibility = true;
    } else if (scrollTop < 200 && TopButtonVisibility) {
      $("#top").fadeOut("slow");
      TopButtonVisibility = false;
    }
  });
  //微信、QQ弹窗设置图片延迟加载
  $("#modal-wx-toggle").one("click", getGroupLazyImage);
  $("#modal-qq-toggle").one("click", getGroupLazyImage);

  /************************以下是函数定义********************************/
  /*******************************************************************/
  //实现图片 组 的延迟加载，根据参数找到img的父容器，
  //再根据容器的data-original，按顺序给img的src赋值
  //父容器可以是<img>元素
  //@param1 selector 可选类型为Event、String，根据该值找到img的容器
  //@param2 width Num 可无，默认无。若有，表示当document.offsetWidth < width时，src加后缀
  //@param3 sufsrc String 可无，默认无。若有，表示当document.offsetWidth < width时，src加后缀。须和width同用。
  //@return undefined
  //可直接调用，可被用作事件处理程序
  function getGroupLazyImage (selector, width, sufsrc) {
    var $parent, $img, src, suf, lastIndex;
    //debugger;
    if (typeof selector === "string") {
      $parent = $(selector);
    } else {
      $parent = $($(selector.target).attr("data-target"));
    }
    //如果父容器本身为<img>
    if ($parent.is("img")) {
      $img = $parent;
    } else {
      $img = $parent.find("img");
    }
    
    if (!$img.length) {
      return;
    }
    
    src = $parent.attr("data-original");

    if (width && document.documentElement.clientWidth < width) {
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
  //一键实现图片的延迟加载，包括添加resize、scoll、DOMContentLoaded事件，
  //判断需要加载的图片，加载图片等一系列操作
  //@param None
  //@return undefined
  function lazyImagehandler () {
    $(window).on("resize scroll", getImage);
    getImage();//DOMContentLoaded时运行一次
    //遍历需要延迟加载图片的元素，并按需求加载图片
    //图片加载后，将该元素从加载图片队列中去除
    function getImage () {
      var $delete = $(); //需要删除的$队列
      $lazyArray.each(function () {
        var $this = $(this),
            mask = isInView($this);
        if (mask === 6) {
          return false; //被检测的元素在视口之右下，就不检测了后面的元素了。不鲁棒
        } else if (mask === 0) {
          $this.attr("src", $this.attr("data-original"));
          $delete = $delete.add($this);
        }
      });
      $lazyArray = $lazyArray.not($delete);
      
      if ($lazyArray.length === 0) {
        $(window).off("resize scroll", getImage);
      }
    }
    //判断元素是否在可视范围内
    //@param1 $Element 需要是否在可是范围内的元素
    //@return Number 全部位于视口上边 1
    //                         右边 2
    //                         下边 4
    //                         左边 8
    //                         里面 0
    //PS：js的位运算奇葩得比较慢，采用非位运算
    function isInView ($element) {
      var offsetTop = $element.offset().top,
          offsetLeft = $element.offset().left,
          elementHeight = $element.height(),
          elementWidth = $element.width(),
          $window = $(window),
          height = $window.height(),
          width = $window.width(),
          scrollTop = $window.scrollTop(),
          scrollLeft = $window.scrollLeft(),
          mask = 0;
      //位于上边
      if (offsetTop + elementHeight < scrollTop) {
        mask += 1;
        //位于左边
        if (offsetLeft + elementWidth < scrollLeft) {
          mask += 8;
        }
        //位于右边
        else if (offsetLeft > scrollLeft + width) {
          mask += 2;
        }
      }
      //位于下边
      else if (offsetTop > scrollTop + height) {
        mask += 4;
      }
      
      return mask;
    }
    
  }
  //实现图片的延迟加载
  //实现背景图的延迟加载，将参数对应的元素的data-target找到img的容器，
  //再根据容器的data-original，按顺序给img的src赋值
  //
  /*function getLazyBackgroundImage (selector) {
    if (!selector) {
      return;
    }
    var $parent = $(selector),
        $img = $parent.find("img"),
        src = $parent.attr("data-original-bg"),
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
  }*/
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