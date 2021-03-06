var videoComment = {
    // 获取参数
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    //切换评论tab标签
    commentTab: function () {
        var tabs = $('.tabs-order>li');
        tabs.each(function () {
            $(this).click(function () {
                tabs.removeClass('on');
                $(this).addClass('on');
            });
        });
    },
    //获取评论时间
    toTime: function (timeStamp) {
        var date = new Date(parseInt(timeStamp));
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes()].join(':'); // 2015-1-2
    },

    // 创建评论区模块
    createCommentArea: function (itemNo, typeNo, pageSize, pageNum) {
        // 获取评论数据
        $.ajax({
            type: "GET",
            url: "http://106.15.39.78:8888/youtu/front/comment/getComments?itemNo=" + itemNo + "&typeNo=" + typeNo + "&pageSize=" + pageSize + "&pageNum=" + pageNum,
            success: function (data) {
                var comment_list = $(".comment-list");
                var comment_num = data.data.data.length;   // 当前页评论数量
                var total_comments = data.data.total;// 该视频下的总评论
                if (comment_num > 0) {
                    for (var i = 0; i < comment_num; i++) {
                        // 创建评论区
                        var comment = $('<div class="list-item clearfloat" data-id="' + data.data.data[i].id + '">\n' +
                            '                <div class="u-face" >\n' +
                            '                    <a href="space.html?id=' + data.data.data[i].userId + '" target="_blank">\n' +
                            '                        <img src="' + data.data.data[i].userPortrait + '">\n' +
                            '                    </a>\n' +
                            '                </div>\n' +
                            '                <div class="con">\n' +
                            '                    <div class="user clearfloat">\n' +
                            '                        <a href="space.html?id=' + data.data.data[i].userId + '" target="_blank">' + data.data.data[i].username + '</a>\n' +
                            '                        <div class="time">' + videoComment.toTime(data.data.data[i].createdate) + '</div>\n' +
                            '                    </div>\n' +
                            '                    <p class="text" >\n' + data.data.data[i].content +
                            '                    </p>\n' +
                            '            <div class="comment-info " >\n' +
                            '                <span class="floor"> #' + data.data.data[i].floors + '</span>\n' +
                            '                <div class="up"><span>' + data.data.data[i].goodHits + '</span></div>\n' +
                            '                <div class="down"><span>' + data.data.data[i].badHits + '</span></div>\n' +
                            '                <span class="reply ">回复</span>\n' +
                            '            </div>\n' +
                            '                    <div class="comment-send reply-input">\n' +
                            '                        <textarea class="comment-text" placeholder="快来说说你的想法..."></textarea>\n' +
                            '                        <input class="comment-btn" type="button" value="发送">\n' +
                            '                    </div>\n' +
                            '              </div>\n' +
                            '      </div>');
                        $(comment_list).append($(comment));

                        // 该评论回复数
                        var reply_num = data.data.data[i].commentSeconds.length;
                        //创建回复区
                        if (reply_num > 0) {
                            //为回复内容添加@符号

                            $('.text').after('<div class="reply-box" ></div>');
                            var reply_wrapper = $('.reply-box');
                            for (var j = 0; j < reply_num; j++) {
                                var reply = $('   <div class="reply-item reply-border" >\n' +
                                    '                            <div class="reply-con clearfloat">\n' +
                                    '                                <div class="reply-user"><a href="space.html?id=' + data.data.data[i].commentSeconds[j].replyUserId + '" target="_blank">' + data.data.data[i].commentSeconds[j].replyUserName + '</a></div>\n' +
                                    '                                <div class="reply-time">' + videoComment.toTime(data.data.data[i].commentSeconds[j].createdate) + '</div>\n' +
                                    '                            </div>\n' +
                                    '                            <div class="reply-info" >\n' +
                                    '                                <span class="reply ">回复</span>\n' +
                                    '                                <div class="up"><span>' + data.data.data[i].commentSeconds[j].goodHits + '</span></div>\n' +
                                    '                                <div class="down"><span>' + data.data.data[i].commentSeconds[j].badHits + '</span></div>\n' +
                                    '                            </div>\n' +
                                    '                            <p class="reply-text">\n' + data.data.data[i].commentSeconds[j].content +
                                    '                               </p>\n' +
                                    '                        </div>\n'
                                );
                                $(reply_wrapper).append($(reply));
                            }
                        }

                    }
                }
                videoComment.makeReply();
                videoComment.Page('comment-list', total_comments, pageNum, pageSize, 5, itemNo, typeNo);
            }
        });
    },// createCommentArea
    // 回复功能
    makeReply: function () {
        $('.reply').click(function () {
            var reply_type_ele = $(this).parent().prev();
            if ($(reply_type_ele).attr('class') === 'reply-con clearfloat') {
                $('.reply-input').hide();
                $('.reply-input').find('.comment-text').attr('placeholder', '回复@' + $(reply_type_ele).find('.reply-user>a').html());
                $(this).parents().eq(4).find('.reply-input').show();
            }
            else {
                $('.reply-input').hide();
                $('.reply-input').find('.comment-text').attr('placeholder', '请自觉遵守互联网相关的政策法规，发布友善内容');
                $(this).parents().eq(2).find('.reply-input').show();
            }
        });
    },//makereply
    // 分页功能
    Page: function (address, commentLength, pageIndex, eventCount, navigateCount, itemNo, typeNo) {
        // address        添加分页器的地址
        // commentLength  得到评论数量
        // pageIndex      当前页
        // eventCount     每页显示多少个
        // navigateCount  分页显示多少个（页码数字）
        // keyword        搜索关键词

        var overCount = commentLength % eventCount; //剩下的评论
        var pageCount = Math.ceil(commentLength / eventCount);  //共有多少页


        //生成分页并给所在分页的添加current
        function pagehtml(pageCount, pageIndex, navigateCount) {
            var pageListhtml = '<div class="list-page">';
            pageListhtml += '<a href="javascript:;" class="prev">上一页</a>'
            for (var i = 1; i <= pageCount; i++) {
                pageListhtml += '<a href="javascript:;" class="pageNumber">' + i + '</a>'
            }
            pageListhtml += '<a href="javascript:;" class="next">下一页</a>'
            pageListhtml += '</div>'
            $("." + address).append(pageListhtml)
            //给所在分页的添加current
            $(".pageNumber").eq(pageIndex - 1).addClass("current")
            //判断是否为第一页 如果为是隐藏上一页按钮
            if (pageIndex == 1) {
                $(".list-page>.prev").hide();
            }
            //判断是否为最后一页 如果为是隐藏下一页按钮
            if (pageIndex == pageCount) {
                $(".list-page>.next").hide();
            }
            //分页显示并添加...
            if (pageCount > navigateCount + 1) {
                $(".pageNumber").hide();
                if (pageIndex == 1) {// 首页情况
                    for (var i = 0; i < (navigateCount); i++) {
                        $(".pageNumber").eq(i).show();
                    }
                    $(".pageNumber").eq(navigateCount).after('<span class="dian">...</span>');// 在其后追加一个span
                    $(".pageNumber").eq(-1).show();
                } else if (pageIndex == pageCount) {// 尾页情况
                    $(".pageNumber").eq(0).show();
                    $(".pageNumber").eq(0).after('<span class="dian">...</span>');
                    for (var i = pageCount; i > pageCount - (navigateCount + 1); i--) {
                        $(".pageNumber").eq(i + 1).show();
                    }
                } else {// 其他页情况
                    $(".pageNumber").eq(0).show();// 显示第一页页码
                    if (pageIndex > navigateCount - 1) {// 当前页大于显示页数倒数第二个位置
                        $(".pageNumber").eq(0).after('<span class="dian">...</span>');
                    }
                    for (var i = pageIndex - ((navigateCount - 1) / 2) - 1; i < pageIndex - ((navigateCount - 1) / 2) - 1 + navigateCount; i++) {
                        $(".pageNumber").eq(i).show();
                    }
                    $(".pageNumber").eq(-1).show();
                    if (pageIndex < pageCount - 3) {// 当前页小于总页数倒数第三个时
                        $(".pageNumber").eq(-1).before('<span class="dian">...</span>');
                    }

                }
            }
        }


        //执行生成分页并给所在分页的添加current
        pagehtml(pageCount, pageIndex, navigateCount)

        //添加点击跳转页面
        $(".pageNumber").click(function () {
            if ($(this).text() != pageIndex) {
                // window.location.href = ("videolib.html?country=" + Country + "&class=" + Class + "&sort=" + Sort + "&page=" + $(this).text())
                videoComment.createCommentArea(itemNo, typeNo, eventCount, $(this).text());
            }
        });
        $(".list-page>.prev").click(function () {
            // window.location.href = ("videolib.html?country=" + Country + "&class=" + Class + "&sort=" + Sort + "&page=" + (pageIndex - 1))
            videoComment.createCommentArea(itemNo, typeNo, eventCount, pageIndex - 1);


        });
        $(".list-page>.next").click(function () {
            // window.location.href = ("videolib.html?country=" + Country + "&class=" + Class + "&sort=" + Sort + "&page=" + (pageIndex - 0 + 1))
            videoComment.createCommentArea(itemNo, typeNo, eventCount, pageIndex + 1);

        });
    },// page
    // 展开全文功能
    fullText: function (address, replyLength, showNum) {

    }
};// videoComment

$(function () {
        $('.comment-list-load').hide();// 加载完成隐藏loading效果
        videoComment.commentTab();

        var videoId = videoComment.getUrlParam('id');
        videoComment.createCommentArea(videoId, 1, 22, 1);


    }
);
