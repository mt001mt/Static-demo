// JavaScript Document

$(
  function () {
    //关闭下拉菜单功能
    $(document).off(".dropdown");
    //按需求重新添加下拉菜单功能
    $(".dropdown-toggle").dropdown();
    $(document).on("click", ".user-dropdown-toggle", function () {
      $(this).parent().toggleClass("open");
      return false;
    });
  }
);