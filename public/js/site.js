$(document).ready(function(){
  $("#jupload1").JUpload();
  $("#jupload2").JUpload({customInput:true});
  $("#jupload3").JUpload({customInput:true, fileContainer:$("#messages3")});
  $(".ju-mfi1").JUpload({customInput:true});
  $(".ju-mfi2").JUpload({customInput:true, fileContainer:$(".mfi-msg"), dragSupport:true});
  $("#ju-fu-files").JUpload({customInput:true, fileContainer:$("#m-ju-fu-files"), autoStart:true});
  $("#ju-fu-folder").JUpload({customInput:true, fileContainer:$("#m-ju-fu-folder"), folderUpload:true});
  $("#ju-subc").JUpload({serverUrl:'/fileimport', batchControl:true});
  $('#ju-stnl').JUpload({extFilter:"jpg|jpeg|png", maxSize:2*1024*1024, maxNumberFiles:10, batchControl:true});

  $("a").on("click",function(e){      
    if($(this).attr("href").indexOf("#")>-1){
      e.preventDefault();
      if($(this).closest('.open').length>0){
        e.stopPropagation();
      }
      $("html,body").animate({scrollTop: ($($(this).attr("href")).offset().top-55)}, 500);
    }
  });
  if(window.location.href.indexOf("#")>-1){
    $("html,body").animate({scrollTop: ($(window.location.hash).offset().top-55)}, 500);
    window.location.hash = "";
  }
  $(document).on("click", function(){
    if($("li").hasClass("open")){
      $("li").removeClass("open");
    }
  });
  $("a[href='#examples']").on("click",function(e){
    e.stopPropagation();
    $(this).parent().toggleClass("open");
  });
});