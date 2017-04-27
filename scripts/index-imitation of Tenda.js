// JavaScript Document

$(function () {
  var hovershowDuration = 300, //hover时显示下拉菜单的时间，单位ms
      temp = $(".user-hovershow-toggle"),
      hovershowA = temp[0], //hover时显示下拉菜单的元素
      hovershowB = temp[1], //.
      hovershowedA = $("#hovershow-1")[0], //hover时显示的下拉菜单
      hovershowedB = $("#hovershow-2")[0]; //.
  temp = null;

  //关闭下拉菜单功能
  $(document).off(".dropdown");
  //关闭transition效果
  $.support.transition = false;
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

  /************************以下是函数定义********************************/
  /*******************************************************************/
  //实现图片延迟加载，根据触发元素的data-target找到img s的容器，
  //再根据容器的data-lazy，按顺序给img的src赋值
  function getLazyImage (e) {
    var $parent = $($(e.target).attr("data-target")),
        $img = $parent.find("img"),
        presrc = $parent.attr("data-lazy");

    $img.each(function (index) {
      this.src = presrc + index + ".png";
    });
  }

  //mouseover触发显示相应的下拉菜单
  function hoverSlideDown (e) {
    var target = e.target;
    
    if (target === hovershowA) {
      $(hovershowedA).slideDown(hovershowDuration);
      return;
    }
    if (target === hovershowB) {
      $(hovershowedB).slideDown(hovershowDuration);
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