var isMob = /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i.test(navigator.userAgent);
var isIE = navigator.appName ==  "Microsoft Internet Explorer" && parseInt(navigator.appVersion.split( ";" )[1].replace(/[ ]/g,  "" ).replace( "MSIE" , "" )) <= 9;
var windowH = $(window).height();
// 处理url
var pageUrl = window.location.href;
var urlIndex = pageUrl.lastIndexOf("\/");
var afterUrl = pageUrl.substring(0, urlIndex + 1);
$(function(){
    $("[alt=\"封面\"]").hide();// 封面图片不显示
    var mediaSign = $("#f-media-sign").length;
    // 如果有"f-media-sign"元素，播放器移动至其位置
    if(mediaSign > 0){
        $("#f-media-sign br").remove();
        $("#f-media-sign").append($(".m-player-box"));
    };
    // 地址
    var mediaSrc = $.trim($("#MultiAttachPh").text());
    // 封面
    var cover = "";
    $("#posterWrap div").each(function() {
        var $this = $(this);
        if($.trim($this.text()) == "封面") {
            cover = $this.find("img").attr("src");
        } else {
            return;
        };
    });
    if(!isIE) {
        var playType = mediaSrc.substring(mediaSrc.length - 3);
        // 播放视频
        if(mediaSrc !="" && playType == "mp4") {
            // 视频调用
            var myPlayer = videojs("my-video", {
                sources: [{
                    src: mediaSrc,
                    type: "video/mp4",
                }],
                // 设置封面  
                poster: cover,
                language: "zh-CN",
                autoplay: false,
                controls: true,
                playbackRates: [0.75, 1, 1.5, 2],
                controlBar: {
                    volumePanel: {
                        inline: false, //竖向显示音量
                    }
                },
                fluid: true,
                seekBar: false
            }, function(){
                // 元数据加载后判断视频比例是横屏还是竖屏，并显示
                myPlayer.on('loadedmetadata', function() {
                    $(".m-player-box").css({"visibility" : "visible","height":"auto","margin-bottom":"20px"});
                    var playerWidth = myPlayer.videoWidth();
                    var playerHeight = myPlayer.videoHeight();
                    if(playerHeight > playerWidth){
                        // 计算视频比例
                        var playerRatio = Number((playerWidth / playerHeight).toFixed(4));
                        // 计算视频宽度420时的高度
                        var newHeight = parseInt(420 / playerRatio);
                        if(windowH < newHeight){
                            // 当可视高度小于视频高度时
                            var newWidth = parseInt(windowH * playerRatio) - 50;
                            // 最小宽度220
                            newWidth <= 220 ? newWidth = 220 : newWidth = newWidth;
                            $(".m-player-box").css({"width" : newWidth});
                        } else {
                            $(".m-player-box").css({"width" : "420px"});
                        };
                    };
                });
                // 纠正音量和进度按钮样式
                $(".vjs-volume-level").append("<style>.vjs-slider-vertical .vjs-volume-level:before{left: -.5em;}.video-js .vjs-play-progress:before{top:-.5em}.video-js .vjs-progress-control:hover .vjs-play-progress:before{top:-.35em}</style>");
                // 手机直接显示
                if(isMob) {
                    $(".m-player-box").css({"visibility" : "visible","height":"auto","margin-bottom":"20px"});
                };
            });
        } else if(mediaSrc !="" && playType == "mp3") {
            // 去除播放器中间默认的播放按钮
            $(".video-js").addClass("vjs-has-started");
            // 修改样式
            $(".m-player-box").addClass("m-audio-box");
            var myPlayer = videojs("my-video", {
                sources: [{
                    src: afterUrl + mediaSrc,
                    type: "audio/mp3",
                }],
                language: "zh-CN",
                autoplay: false,
                controls: true,
                controlBar: {
                    fullscreenToggle:false
                },
                fluid: true,
                seekBar: false,
            }, function () {
                // 自定义方法：设置控制栏始终显示
                function controlBarIsShow (options) {
                    if(options){
                        // 通过获取控制栏显示隐藏的状态设置控制栏
                        this.on('userinactive', function () {
                            this.userActive(true);
                        });
                    }else{return};
                };
                // 元数据加载后显示
                myPlayer.on('loadedmetadata', function() {
                    $(".m-player-box").css({"visibility" : "visible","height":"auto","margin-bottom":"20px"});
                });
                // 手机直接显示
                if(isMob) {
                    $(".m-player-box").css({"visibility" : "visible","height":"auto","margin-bottom":"20px"});
                };
                // 默认音量
                myPlayer.volume(0.6);
                // 音频直播控制栏常在
                videojs.registerPlugin('controlBarIsShow', controlBarIsShow);
                this.controlBarIsShow(true);
                // 纠正音量和进度按钮样式
                $(".vjs-volume-level").append("<style>.vjs-slider-horizontal .vjs-volume-level:before{top:-.4em;}.video-js .vjs-play-progress:before{top:-.4em}.video-js .vjs-progress-control:hover .vjs-play-progress:before{top:-.3em}</style>");
                // 切换音频并跟谁
                $("#mainText a").on("click",function(e) {
                    e.preventDefault();
                    $(this).parent().before($(".m-player-box"));
                    var href = $(this).attr("href");
                    if(href.indexOf(".mp3") > -1) {
                        myPlayer.reset();
                        var newSrc = {
                            src: href,
                            type: "audio/mp3"
                        };
                        myPlayer.src(newSrc);
                        myPlayer.load(href);
                        myPlayer.play();
                    } else {
                        window.open(href);
                    };
                });
            });
        } else if(mediaSrc == "") {
            $(".m-player-box").remove();
        };
    } else if(isIE && mediaSrc != "") {
        $(".m-player-box").css({"visibility" : "visible"});
        $(".m-player-box").show().addClass("s-isIE").html("您的浏览器版本过低，请用IE9以上、Chrome、火狐等高版本浏览器浏览本站");
    };
});