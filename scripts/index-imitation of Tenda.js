// JavaScript Document

$(
  function () {
    //关闭下拉菜单功能
    $(document).off(".dropdown");
    //关闭transition效果
    //$.support.transition = false;
    //按需求重新添加下拉菜单功能
    $(".dropdown-toggle").dropdown();
    $(document).on("click", ".user-dropdown-toggle", function () {
      $(this).parent().toggleClass("open");
      return false;
    });
    //添加hover事件，触发后调用collapse()函数
    $(document).on("click", ".user-collapse-toggle", function (e) {
      //$.support.transition = true;
      $($(e.target).attr("data-target")).collapse();
      //$(document).
    });
  }
);