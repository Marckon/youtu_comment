function getcurrentPage() {
    var reg = new RegExp("#(.+)");
    var currentpage = window.location.href.match(reg);
    if(currentpage ) return parseInt(currentpage[1] ); else  return null;
}

function page(pagecount, pageindex, navigatecount) {
    //追加分页表模块
    var pagelisthtml = "<div class='pagelist'>";
    pagelisthtml += "<a href='javascript:;' class='previous'><<</a>";
    for (var i = 0; i < pagecount; i++) {
        pagelisthtml += "<a  href=" + '#' + (i + 1) + " class='pagenumber'>" + (i + 1) + "</a>";
    }
    pagelisthtml += "<a href='javascript:;' class='next'>&gt;&gt;</a>";
    pagelisthtml += "</div>";
    $("body").append(pagelisthtml);

    $(".pagenumber").hide();
    $(".pagenumber").eq(0).show();
    $(".pagenumber").eq(pagecount - 1).show();
    // 首页
    if (pageindex == 1) {
        $(".previous").hide();
        for (var i = 0; i < navigatecount-1; i++) {
            $(".pagenumber").eq(i).show();
        }
        $(".pagenumber").eq(navigatecount).after("<span class='dot'>...</span>");
    }
    //尾页
    else if (pageindex == pagecount) {
        $(".next").hide();
        $(".pagenumber").eq(0).after('<span class="dot">...</span>');
        for (var i = 0; i < navigatecount; i++) {
            $(".pagenumber").eq(-i).show();
        }
    }

    // 其他页
    else {
        if (pageindex > navigatecount -1) {
            $(".pagenumber").eq(0).after('<span class="dot">...</span>');
        }
        for (var i = pageindex - ((navigatecount - 1) / 2) - 1; i < pageindex - ((navigatecount - 1) / 2) - 1 + navigatecount; i++) {
            $(".pagenumber").eq(i).show();
        }

        if (pageindex < pagecount-3 ) {
            $(".pagenumber").eq(-1).before('<span class="dot">...</span>');
        }
    }
}


$(function () {
    var pageindex = getcurrentPage();
    var ini_url = window.location.href;
    if (pageindex == null) {
        window.location.href=ini_url+"#1";
    }
    page(20, pageindex, 5);
    if ($(".pagelist")) {
        $(".pagenumber").click(function () {
            window.location.reload();
        });
        $(".pagenumber").eq(pageindex-1).addClass("current");
    }

    if ($(".previous")) {
        $(".previous").click(function () {
            pageindex -= 1;
            var url_arr=new Array(window.location.href.split("#"));
            window.location.replace(url_arr[0]+"#"+pageindex);
        });
    }

    if ($(".next")){
        $(".next").click(function () {
            pageindex += 1;
            var url_arr=new Array(window.location.href.split("#"));
            window.location.replace(url_arr[0]+"#"+pageindex);
        });
    }
});