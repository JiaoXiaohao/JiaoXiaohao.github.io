// 防抖全局计时器
let TT = null;    //time用来控制事件的触发
// 防抖函数:fn->逻辑 time->防抖时间
function debounce(fn, time) {
    if (TT !== null) clearTimeout(TT);
    TT = setTimeout(fn, time);
}
// 发现有时会和当前页面重复，加一个判断 randomPost.js
function randomPost() {
    fetch('/baidusitemap.xml').then(res => res.text()).then(str => (new window.DOMParser()).parseFromString(str, "text/xml")).then(data => {
        let ls = data.querySelectorAll('url loc');
        while (true) {
            let url = ls[Math.floor(Math.random() * ls.length)].innerHTML;
            if (location.href == url) continue;
            location.href = url;
            return;
        }
    })
}
// 分享本页
function share_() {
    // 获取当前页面的标题
    let title = document.title;
    // 获取当前页面的绝对路径
    let url = location.href;
    // 获取当前页面的描述内容
    let description = document.querySelector('meta[name="description"]').getAttribute('content');
    // 复制到剪贴板
    let text = `${title}\n${description}\n${url}`;
    // 创建一个textarea标签
    let textarea = document.createElement('textarea');
    // 设置textarea的内容为需要复制的内容
    textarea.value = text;
    // 将textarea标签添加到body中
    document.body.appendChild(textarea);
    // 选中textarea中的内容
    textarea.select();
    // 执行复制命令
    document.execCommand('copy');
    // 将textarea标签移除
    textarea.remove();
    try {
        new Vue({
            data: function () {
                this.$notify({
                    title: "成功复制分享信息🎉",
                    message: "您现在可以通过粘贴直接跟小伙伴分享了！",
                    position: 'top-left',
                    offset: 50,
                    showClose: true,
                    type: "success",
                    duration: 5000
                });
                // return { visible: false }
            }
        })
    } catch (err) {
        console.error('复制失败！', err);
    }
}
// 防抖
function share() {
    debounce(share_, 300);
}

//动态标题 title.js
var OriginTitile = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        //离开当前页面时标签显示内容
        document.title = '你快回来~~~';
        clearTimeout(titleTime);
    } else {
        //返回当前页面时标签显示内容
        document.title = '欢迎回来~~~';
        //两秒后变回正常标题
        titleTime = setTimeout(function () {
            document.title = OriginTitile;
        }, 2000);
    }
});
// 樱花飘落bynote.cn
// var stop, staticx; var img = new Image(); img.src = "/img/try8.png"; function Sakura(x, y, s, r, fn) { this.x = x; this.y = y; this.s = s; this.r = r; this.fn = fn; }
// Sakura.prototype.draw = function (cxt) {
//     cxt.save(); var xc = 40 * this.s / 4; cxt.translate(this.x, this.y); cxt.rotate(this.r); cxt.drawImage(img, 0, 0, 40 * this.s, 40 * this.s)
//     cxt.restore();
// }
// Sakura.prototype.update = function () { this.x = this.fn.x(this.x, this.y); this.y = this.fn.y(this.y, this.y); this.r = this.fn.r(this.r); if (this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight || this.y < 0) { this.r = getRandom('fnr'); if (Math.random() > 0.4) { this.x = getRandom('x'); this.y = 0; this.s = getRandom('s'); this.r = getRandom('r'); } else { this.x = window.innerWidth; this.y = getRandom('y'); this.s = getRandom('s'); this.r = getRandom('r'); } } }
// SakuraList = function () { this.list = []; }
// SakuraList.prototype.push = function (sakura) { this.list.push(sakura); }
// SakuraList.prototype.update = function () { for (var i = 0, len = this.list.length; i < len; i++) { this.list[i].update(); } }
// SakuraList.prototype.draw = function (cxt) { for (var i = 0, len = this.list.length; i < len; i++) { this.list[i].draw(cxt); } }
// SakuraList.prototype.get = function (i) { return this.list[i]; }
// SakuraList.prototype.size = function () { return this.list.length; }
// function getRandom(option) {
//     var ret, random; switch (option) {
//         case 'x': ret = Math.random() * window.innerWidth; break; case 'y': ret = Math.random() * window.innerHeight; break; case 's': ret = Math.random(); break; case 'r': ret = Math.random() * 6; break; case 'fnx': random = -0.5 + Math.random() * 1; ret = function (x, y) { return x + 0.5 * random - 1.7; }; break; case 'fny': random = 1.5 + Math.random() * 0.7
//             ret = function (x, y) { return y + random; }; break; case 'fnr': random = Math.random() * 0.03; ret = function (r) { return r + random; }; break;
//     }
//     return ret;
// }
// function startSakura() {
//     requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame; var canvas = document.createElement('canvas'), cxt; staticx = true; canvas.height = window.innerHeight; canvas.width = window.innerWidth; canvas.setAttribute('style', 'position: fixed;left: 0;top: 0;pointer-events: none;'); canvas.setAttribute('id', 'canvas_sakura'); document.getElementsByTagName('body')[0].appendChild(canvas); cxt = canvas.getContext('2d'); var sakuraList = new SakuraList(); for (var i = 0; i < 50; i++) { var sakura, randomX, randomY, randomS, randomR, randomFnx, randomFny; randomX = getRandom('x'); randomY = getRandom('y'); randomR = getRandom('r'); randomS = getRandom('s'); randomFnx = getRandom('fnx'); randomFny = getRandom('fny'); randomFnR = getRandom('fnr'); sakura = new Sakura(randomX, randomY, randomS, randomR, { x: randomFnx, y: randomFny, r: randomFnR }); sakura.draw(cxt); sakuraList.push(sakura); }
//     stop = requestAnimationFrame(function () { cxt.clearRect(0, 0, canvas.width, canvas.height); sakuraList.update(); sakuraList.draw(cxt); stop = requestAnimationFrame(arguments.callee); })
// }
// window.onresize = function () { var canvasSnow = document.getElementById('canvas_snow'); }
// img.onload = function () { startSakura(); }
// function stopp() { if (staticx) { var child = document.getElementById("canvas_sakura"); child.parentNode.removeChild(child); window.cancelAnimationFrame(stop); staticx = false; } else { startSakura(); } }

// universe.js
function dark() { window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; var n, e, i, h, t = .05, s = document.getElementById("universe"), o = !0, a = "180,184,240", r = "226,225,142", d = "226,225,224", c = []; function f() { n = window.innerWidth, e = window.innerHeight, i = .216 * n, s.setAttribute("width", n), s.setAttribute("height", e) } function u() { h.clearRect(0, 0, n, e); for (var t = c.length, i = 0; i < t; i++) { var s = c[i]; s.move(), s.fadeIn(), s.fadeOut(), s.draw() } } function y() { this.reset = function () { this.giant = m(3), this.comet = !this.giant && !o && m(10), this.x = l(0, n - 10), this.y = l(0, e), this.r = l(1.1, 2.6), this.dx = l(t, 6 * t) + (this.comet + 1 - 1) * t * l(50, 120) + 2 * t, this.dy = -l(t, 6 * t) - (this.comet + 1 - 1) * t * l(50, 120), this.fadingOut = null, this.fadingIn = !0, this.opacity = 0, this.opacityTresh = l(.2, 1 - .4 * (this.comet + 1 - 1)), this.do = l(5e-4, .002) + .001 * (this.comet + 1 - 1) }, this.fadeIn = function () { this.fadingIn && (this.fadingIn = !(this.opacity > this.opacityTresh), this.opacity += this.do) }, this.fadeOut = function () { this.fadingOut && (this.fadingOut = !(this.opacity < 0), this.opacity -= this.do / 2, (this.x > n || this.y < 0) && (this.fadingOut = !1, this.reset())) }, this.draw = function () { if (h.beginPath(), this.giant) h.fillStyle = "rgba(" + a + "," + this.opacity + ")", h.arc(this.x, this.y, 2, 0, 2 * Math.PI, !1); else if (this.comet) { h.fillStyle = "rgba(" + d + "," + this.opacity + ")", h.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, !1); for (var t = 0; t < 30; t++)h.fillStyle = "rgba(" + d + "," + (this.opacity - this.opacity / 20 * t) + ")", h.rect(this.x - this.dx / 4 * t, this.y - this.dy / 4 * t - 2, 2, 2), h.fill() } else h.fillStyle = "rgba(" + r + "," + this.opacity + ")", h.rect(this.x, this.y, this.r, this.r); h.closePath(), h.fill() }, this.move = function () { this.x += this.dx, this.y += this.dy, !1 === this.fadingOut && this.reset(), (this.x > n - n / 4 || this.y < 0) && (this.fadingOut = !0) }, setTimeout(function () { o = !1 }, 50) } function m(t) { return Math.floor(1e3 * Math.random()) + 1 < 10 * t } function l(t, i) { return Math.random() * (i - t) + t } f(), window.addEventListener("resize", f, !1), function () { h = s.getContext("2d"); for (var t = 0; t < i; t++)c[t] = new y, c[t].reset(); u() }(), function t() { document.getElementsByTagName('html')[0].getAttribute('data-theme') == 'dark' && u(), window.requestAnimationFrame(t) }() };
dark()
// sun_moon.js
function switchNightMode() {
    document.querySelector('body').insertAdjacentHTML('beforeend', '<div class="Cuteen_DarkSky"><div class="Cuteen_DarkPlanet"><div id="sun"></div><div id="moon"></div></div></div>'),
        setTimeout(function () {
            document.querySelector('body').classList.contains('DarkMode') ? (document.querySelector('body').classList.remove('DarkMode'), localStorage.setItem('isDark', '0'), document.getElementById('modeicon').setAttribute('xlink:href', '#icon-moon')) : (document.querySelector('body').classList.add('DarkMode'), localStorage.setItem('isDark', '1'), document.getElementById('modeicon').setAttribute('xlink:href', '#icon-sun')),
                setTimeout(function () {
                    document.getElementsByClassName('Cuteen_DarkSky')[0].style.transition = 'opacity 3s';
                    document.getElementsByClassName('Cuteen_DarkSky')[0].style.opacity = '0';
                    setTimeout(function () {
                        document.getElementsByClassName('Cuteen_DarkSky')[0].remove();
                    }, 1e3);
                }, 2e3)
        })
    const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    if (nowMode === 'light') {
        // 先设置太阳月亮透明度
        document.getElementById("sun").style.opacity = "1";
        document.getElementById("moon").style.opacity = "0";
        setTimeout(function () {
            document.getElementById("sun").style.opacity = "0";
            document.getElementById("moon").style.opacity = "1";
        }, 1000);

        activateDarkMode()
        saveToLocal.set('theme', 'dark', 2)
        // GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
        document.getElementById('modeicon').setAttribute('xlink:href', '#icon-sun')
        // 延时弹窗提醒
        setTimeout(() => {
            new Vue({
                data: function () {
                    this.$notify({
                        title: "关灯啦🌙",
                        message: "当前已成功切换至夜间模式！",
                        position: 'top-left',
                        offset: 50,
                        showClose: true,
                        type: "success",
                        duration: 5000
                    });
                }
            })
        }, 2000)
    } else {
        // 先设置太阳月亮透明度
        document.getElementById("sun").style.opacity = "0";
        document.getElementById("moon").style.opacity = "1";
        setTimeout(function () {
            document.getElementById("sun").style.opacity = "1";
            document.getElementById("moon").style.opacity = "0";
        }, 1000);

        activateLightMode()
        saveToLocal.set('theme', 'light', 2)
        document.querySelector('body').classList.add('DarkMode'), document.getElementById('modeicon').setAttribute('xlink:href', '#icon-moon')
        setTimeout(() => {
            new Vue({
                data: function () {
                    this.$notify({
                        title: "开灯啦🌞",
                        message: "当前已成功切换至白天模式！",
                        position: 'top-left',
                        offset: 50,
                        showClose: true,
                        type: "success",
                        duration: 5000
                    });
                }
            })
        }, 2000)
    }
    // handle some cases
    typeof utterancesTheme === 'function' && utterancesTheme()
    typeof FB === 'object' && window.loadFBComment()
    window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200)
}
// cat.js
if (document.body.clientWidth > 992) {
    function getBasicInfo() {
        /* 窗口高度 */
        var ViewH = $(window).height();
        /* document高度 */
        var DocH = $("body")[0].scrollHeight;
        /* 滚动的高度 */
        var ScrollTop = $(window).scrollTop();
        /* 可滚动的高度 */
        var S_V = DocH - ViewH;
        var Band_H = ScrollTop / (DocH - ViewH) * 100;
        return {
            ViewH: ViewH,
            DocH: DocH,
            ScrollTop: ScrollTop,
            Band_H: Band_H,
            S_V: S_V
        }
    };
    function show(basicInfo) {
        if (basicInfo.ScrollTop > 0.001) {
            $(".neko").css('display', 'block');
        } else {
            $(".neko").css('display', 'none');
        }
    }
    (function ($) {
        $.fn.nekoScroll = function (option) {
            var defaultSetting = {
                top: '0',
                scroWidth: 6 + 'px',
                z_index: 9999,
                zoom: 0.9,
                borderRadius: 5 + 'px',
                right: 60 + 'px',
                // 这里可以换为你喜欢的图片，例如我就换为了雪人，但是要抠图
                nekoImg: "https://bu.dusays.com/2022/07/20/62d812db74be9.png",
                hoverMsg: "喵喵喵~",
                color: "#6f42c1",
                during: 500,
                blog_body: "body",
            };
            var setting = $.extend(defaultSetting, option);
            var getThis = this.prop("className") !== "" ? "." + this.prop("className") : this.prop("id") !== "" ? "#" +
                this.prop("id") : this.prop("nodeName");
            if ($(".neko").length == 0) {
                this.after("<div class=\"neko\" id=" + setting.nekoname + " data-msg=\"" + setting.hoverMsg + "\"></div>");
            }
            let basicInfo = getBasicInfo();
            $(getThis)
                .css({
                    'position': 'fixed',
                    'width': setting.scroWidth,
                    'top': setting.top,
                    'height': basicInfo.Band_H * setting.zoom * basicInfo.ViewH * 0.01 + 'px',
                    'z-index': setting.z_index,
                    'background-color': setting.bgcolor,
                    "border-radius": setting.borderRadius,
                    'right': setting.right,
                    'background-image': 'url(' + setting.scImg + ')',
                    'background-image': '-webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%, transparent)', 'border-radius': '2em',
                    'background-size': 'contain'
                });
            $("#" + setting.nekoname)
                .css({
                    'position': 'fixed',
                    'top': basicInfo.Band_H * setting.zoom * basicInfo.ViewH * 0.01 - 50 + 'px',
                    'z-index': setting.z_index * 10,
                    'right': setting.right,
                    'background-image': 'url(' + setting.nekoImg + ')',
                });
            show(getBasicInfo());
            $(window)
                .scroll(function () {
                    let basicInfo = getBasicInfo();
                    show(basicInfo);
                    $(getThis)
                        .css({
                            'position': 'fixed',
                            'width': setting.scroWidth,
                            'top': setting.top,
                            'height': basicInfo.Band_H * setting.zoom * basicInfo.ViewH * 0.01 + 'px',
                            'z-index': setting.z_index,
                            'background-color': setting.bgcolor,
                            "border-radius": setting.borderRadius,
                            'right': setting.right,
                            'background-image': 'url(' + setting.scImg + ')',
                            'background-image': '-webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%, transparent)', 'border-radius': '2em',
                            'background-size': 'contain'
                        });
                    $("#" + setting.nekoname)
                        .css({
                            'position': 'fixed',
                            'top': basicInfo.Band_H * setting.zoom * basicInfo.ViewH * 0.01 - 50 + 'px',
                            'z-index': setting.z_index * 10,
                            'right': setting.right,
                            'background-image': 'url(' + setting.nekoImg + ')',
                        });
                    if (basicInfo.ScrollTop == basicInfo.S_V) {
                        $("#" + setting.nekoname)
                            .addClass("showMsg")
                    } else {
                        $("#" + setting.nekoname)
                            .removeClass("showMsg");
                        $("#" + setting.nekoname)
                            .attr("data-msg", setting.hoverMsg);
                    }
                });
            this.click(function (e) {
                btf.scrollToDest(0, 500)
            });
            $("#" + setting.nekoname)
                .click(function () {
                    btf.scrollToDest(0, 500)
                });
            return this;
        }
    })(jQuery);

    $(document).ready(function () {
        //部分自定义
        $("#myscoll").nekoScroll({
            bgcolor: 'rgb(0 0 0 / .5)', //背景颜色，没有绳子背景图片时有效
            borderRadius: '2em',
            zoom: 0.9
        }
        );
        //自定义（去掉以下注释，并注释掉其他的查看效果）
        /*
        $("#myscoll").nekoScroll({
            nekoname:'neko1', //nekoname，相当于id
            nekoImg:'img/猫咪.png', //neko的背景图片
            scImg:"img/绳1.png", //绳子的背景图片
            bgcolor:'#1e90ff', //背景颜色，没有绳子背景图片时有效
            zoom:0.9, //绳子长度的缩放值
            hoverMsg:'你好~喵', //鼠标浮动到neko上方的对话框信息
            right:'100px', //距离页面右边的距离
            fontFamily:'楷体', //对话框字体
            fontSize:'14px', //对话框字体的大小
            color:'#1e90ff', //对话框字体颜色
            scroWidth:'8px', //绳子的宽度
            z_index:100, //不用解释了吧
            during:1200, //从顶部到底部滑动的时长
        });
        */
    })
}
// txmap.js
const _0x4a00 = ['aW5mbw==', '5qGC5p6X5bGx5rC055Sy5aSp5LiL44CC', '6LS15bee55yB', 'PHNwYW4+5pma5LiK5aW9PC9zcGFuPu+8jOWknOeUn+a0u+WXqOi1t+adpe+8gQ==', 'PHNwYW4+5Lit5Y2I5aW9PC9zcGFuPu+8jOivpeaRuOmxvOWQg+WNiOmlreS6huOAgg==', '5rmW5YyX55yB', '5aSn5ryg5a2k54Of55u077yM6ZW/5rKz6JC95pel5ZyG44CC', '6buR6b6Z5rGf55yB', 'PHNwYW4+5LiK5Y2I5aW9PC9zcGFuPu+8jOS4gOaXpeS5i+iuoeWcqOS6juaZqO+8gQ==', 'Z2V0', '5rSb6Ziz5biC', 'YWpheA==', 'bmF0aW9u', 'dGVzdA==', 'd2VsY29tZS1pbmZv', 'cGpheDpjb21wbGV0ZQ==', 'dGFibGU=', 'QU5oT2Y=', '546J6b6Z6aOe6Iie5LqR57yg57uV77yM5LiH5Lue5Yaw5bed55u06IC45aSp44CC', 'dHlwZQ==', 'ZGVidWc=', 'd2Fybg==', 'Z2V0SG91cnM=', '5aSp5rSl5biC', 'bG5n', 'ZXJyb3I=', '5LiK5rW35biC', 'cmV0dXJuIChmdW5jdGlvbigpIA==', '5bm/5Lic55yB', '55SY6IKD55yB', '5Y+w5rm+55yB', 'Y2l0eQ==', '5LiK5pyJ5aSp5aCC77yM5LiL5pyJ6IuP5p2t44CC', 'TGV0IHVzIGxpdmUgaW4gcGVhY2Uh', '5rC45a6a6LS85pyJ5q6L55WZ5Zyw6ay85ZqO77yM6L+O5Ye75YWJ6Z2e5bKB546J44CC', 'XihbXiBdKyggK1teIF0rKSspK1teIF19', '6IyF5Y+w77yM5a2m55Sf77yM5YaN5aGeMjAw44CC', 'aHR0cHM6Ly9hcGlzLm1hcC5xcS5jb20vd3MvbG9jYXRpb24vdjEvaXA=', 'ZGlzdHJpY3Q=', 'cmV0dXJuIC8iICsgdGhpcyArICIv', 'bGVuZ3Ro', '56aP5bu655yB', 'PHNwYW4+5LiL5Y2I5aW9PC9zcGFuPu+8jOaHkuaHkuWcsOedoeS4quWNiOinieWQp++8gQ==', '5aSc5rex5LqG77yM5pep54K55LyR5oGv77yM5bCR54as5aSc44CC', '5rGf6KW/55yB', 'cm91bmQ=', 'cHJvdmluY2U=', 'SUlLUFI=', '6K6y5q6155u45aOw5ZCn44CC', '5bGx6KW/55yB', 'SHl0Q2Q=', '6ICB5p2/5p2l5Lik5pak56aP5bu65Lq644CC', 'dXJs', '6JC96Zye5LiO5a2k6bmc6b2Q6aOe77yM56eL5rC05YWx6ZW/5aSp5LiA6Imy44CC', '6YGl5pyb6b2Q5bee5Lmd54K554Of77yM5LiA5rOT5rW35rC05p2v5Lit5rO744CC', '5bim5oiR5Y675L2g55qE5Zu95a626YCb6YCb5ZCn44CC', 'PC9zcGFuPu+8jCA=', '6aaZ5riv54m55Yir6KGM5pS/5Yy6', 'Y29uc3RydWN0b3I=', '54mb6IKJ5bmy5ZKM6ICB6YW45aW26YO95aW95aW95ZCD44CC', '5p2l56KX54Ot5bmy6Z2i77yB', '5YaF6JKZ5Y+k6Ieq5rK75Yy6', 'VmZvRWM=', 'bGF0', '5LyX5omA5ZGo55+l77yM5Lit5Zu95Y+q5pyJ5Lik5Liq5Z+O5biC44CC', '6Lq65Zyo6Iyr6Iyr6I2J5Y6f5LiK77yM5Luw5pyb6JOd5aSp44CC', '5bGx5Lic55yB', '5ZCJ5p6X55yB', 'ZGF0YQ==', '6L+Z5piv5oiR5oy65oOz5Y6755qE5Z+O5biC5ZWm44CC', '576M56yb5L2V6aG75oCo5p2o5p+z77yM5pil6aOO5LiN5bqm546J6Zeo5YWz44CC', '5oiR5oOz5ZCD54Ok6bih5p6277yB', 'SVB2NiDlpKrplb/kuobvvIzkuI3mg7PmmL7npLrwn5iE', 'TUdnUnE=', 'PGI+PGNlbnRlcj7wn46JIOasoui/juS/oeaBryDwn46JPC9jZW50ZXI+JmVtc3A7JmVtc3A75qyi6L+O5p2l6IeqIDxzcGFuIHN0eWxlPSJjb2xvcjp2YXIoLS10aGVtZS1jb2xvcikiPg==', '5p2l5Lu96IeK5a2Q6Z2i5Yqg6aaN44CC', '5rKz5YyX55yB', '5bmy5LqG6L+Z55O25LyP54m55Yqg77yB', 'PC9zcGFuPiDlhazph4zvvIzlvZPliY3nmoRJUOWcsOWdgOS4uu+8miA8c3BhbiBzdHlsZT0iY29sb3I6dmFyKC0tdGhlbWUtY29sb3IpIj4=', 'YXBwbHk=', 'c3lqd3I=', '5bGV5byA5Z2Q5YW36ZW/5LiJ5bC677yM5bey5Y2g5bGx5rKz5LqU55m+5L2Z44CC', 'PC9iPg==', '6IuP5bee5biC', '5LiA6LW35Y675aSn5aCh56SB5ZCn77yB', 'e30uY29uc3RydWN0b3IoInJldHVybiB0aGlzIikoICk=', 'PHNwYW4+5aSV6Ziz5peg6ZmQ5aW977yBPC9zcGFuPg==', 'c2FYdHk=', '5YyX5Lqs5biC', '5L+E572X5pav', 'b25sb2Fk', '5bq35bq35bed5aa55a2Q44CC', '5oCn5oSf6I235a6Y77yM5Zyo57q/5Y+R54mM44CC', 'Y29uc29sZQ==', '5bim5oiR5Y675L2g55qE5Z+O5biC6YCb6YCb5ZCn77yB', 'bG9n', 'R3Zlek4=', '44KI44KN44GX44GP77yM5LiA6LW35Y6755yL5qix6Iqx5ZCX', '54q25YWD6ZiB5bCx5piv5Lic5YyX54On54Ok5LmL546L44CC', '5Y2X5Lqs5biC', 'cmVzdWx0', 'ZGF0YVR5cGU=', 'ZXhjZXB0aW9u', '5bOw5bOw5pyJ5aWH55+z77yM55+z55+z5oyf5LuZ5rCU44CC5bWW5bKI5bGx55qE6Iqx5b6I576O5ZOm77yB', '5b6I5Zac5qyi5ZOI5bCU5ruo5aSn5Ymn6Zmi44CC', 'Z2V0RWxlbWVudEJ5SWQ=', '5oiR5Zyo6L+Z5aS077yM5aSn6ZmG5Zyo6YKj5aS044CC', 'VFJlSHg=', '5oOz5ZCM5L2g5LiA6LW35aSc5LmY5Lym5pWm55y8', '5ou+6LW35LiA54mH5p6r5Y+26LWg5LqI5L2g', '5Zub5bed55yB', '5bm/6KW/5aOu5peP6Ieq5rK75Yy6', '5rWZ5rGf55yB', 'c3VjY2Vzcw==', 'aW5uZXJIVE1M', '5aSp6IuN6IuN77yM6YeO6Iyr6Iyr77yM6aOO5ZC56I2J5L2O6KeB54mb576K44CC', '6JqM5Z+g5L2P5LqG77yM6Iqc5rmW6LW36aOe44CC', '5bGx5Yq/5beN5beN5oiQ5aOB5Z6S77yM5aSp5LiL6ZuE5YWz44CC6ZOB6ams6YeR5oiI55Sx5q2k5ZCR77yM5peg6ZmQ5rGf5bGx44CC', 'PHNwYW4+5LiJ54K55Yeg5ZWmPC9zcGFuPu+8jOS4gOi1t+mlruiMtuWRgO+8gQ==', 'anNvbnA=', '5LqR5Y2X55yB', '5r6z6Zeo54m55Yir6KGM5pS/5Yy6', '5oKo546w5Zyo6Led56a7IEppYW9YaWFvaGFvIOe6piA8c3BhbiBzdHlsZT0iY29sb3I6dmFyKC0tdGhlbWUtY29sb3IpIj4=', 'cURKVVo=', 'bG9jYXRpb24=', 'Qydlc3QgTGEgVmll', 'cVpuZnA=', 'Z3Nod3A=', '6YOR5bee5biC', '5byA5bCB5biC', 'dHJhY2U=', 'YWRfaW5mbw==', '6Z2S5rW355yB', '5pyd6KeC5pel5Ye66YCQ55m95rWq77yM5aSV55yL5LqR6LW35pS26Zye5YWJ44CC', '5rKz5Y2X55yB', '6am86ZOD5Y+k6YGT5Lid57u46Lev77yM6IOh6ams54q56Ze75ZSQ5rGJ6aOO44CC', 'PC9zcGFuPiDnmoTlsI/kvJnkvLTvvIw=']; (function (_0x3394c3, _0x4a007b) { const _0xf95aa9 = function (_0x2bd964) { while (--_0x2bd964) { _0x3394c3['push'](_0x3394c3['shift']()); } }; const _0x2711a8 = function () { const _0x172e94 = { 'data': { 'key': 'cookie', 'value': 'timeout' }, 'setCookie': function (_0x2e532c, _0x16b0be, _0x392c9e, _0x358c23) { _0x358c23 = _0x358c23 || {}; let _0x3e1f13 = _0x16b0be + '=' + _0x392c9e; let _0x4504cf = 0x0; for (let _0x25f05d = 0x0, _0x5dd9fe = _0x2e532c['length']; _0x25f05d < _0x5dd9fe; _0x25f05d++) { const _0x525b9c = _0x2e532c[_0x25f05d]; _0x3e1f13 += ';\x20' + _0x525b9c; const _0xbe0598 = _0x2e532c[_0x525b9c]; _0x2e532c['push'](_0xbe0598); _0x5dd9fe = _0x2e532c['length']; if (_0xbe0598 !== !![]) { _0x3e1f13 += '=' + _0xbe0598; } } _0x358c23['cookie'] = _0x3e1f13; }, 'removeCookie': function () { return 'dev'; }, 'getCookie': function (_0x5d0f3e, _0x22be5a) { _0x5d0f3e = _0x5d0f3e || function (_0x1b14fe) { return _0x1b14fe; }; const _0x2c5cb3 = _0x5d0f3e(new RegExp('(?:^|;\x20)' + _0x22be5a['replace'](/([.$?*|{}()[]\/+^])/g, '$1') + '=([^;]*)')); const _0xe383c1 = function (_0xea0c36, _0x56959c) { _0xea0c36(++_0x56959c); }; _0xe383c1(_0xf95aa9, _0x4a007b); return _0x2c5cb3 ? decodeURIComponent(_0x2c5cb3[0x1]) : undefined; } }; const _0x3b431d = function () { const _0x9ada19 = new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}'); return _0x9ada19['test'](_0x172e94['removeCookie']['toString']()); }; _0x172e94['updateCookie'] = _0x3b431d; let _0xb2a3c8 = ''; const _0x16a8f3 = _0x172e94['updateCookie'](); if (!_0x16a8f3) { _0x172e94['setCookie'](['*'], 'counter', 0x1); } else if (_0x16a8f3) { _0xb2a3c8 = _0x172e94['getCookie'](null, 'counter'); } else { _0x172e94['removeCookie'](); } }; _0x2711a8(); }(_0x4a00, 0x13c)); const _0xf95a = function (_0x3394c3, _0x4a007b) { _0x3394c3 = _0x3394c3 - 0x0; let _0xf95aa9 = _0x4a00[_0x3394c3]; if (_0xf95a['Efavik'] === undefined) { (function () { const _0x2bd964 = function () { let _0xb2a3c8; try { _0xb2a3c8 = Function('return\x20(function()\x20' + '{}.constructor(\x22return\x20this\x22)(\x20)' + ');')(); } catch (_0x16a8f3) { _0xb2a3c8 = window; } return _0xb2a3c8; }; const _0x172e94 = _0x2bd964(); const _0x3b431d = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='; _0x172e94['atob'] || (_0x172e94['atob'] = function (_0x2e532c) { const _0x16b0be = String(_0x2e532c)['replace'](/=+$/, ''); let _0x392c9e = ''; for (let _0x358c23 = 0x0, _0x3e1f13, _0x4504cf, _0x25f05d = 0x0; _0x4504cf = _0x16b0be['charAt'](_0x25f05d++); ~_0x4504cf && (_0x3e1f13 = _0x358c23 % 0x4 ? _0x3e1f13 * 0x40 + _0x4504cf : _0x4504cf, _0x358c23++ % 0x4) ? _0x392c9e += String['fromCharCode'](0xff & _0x3e1f13 >> (-0x2 * _0x358c23 & 0x6)) : 0x0) { _0x4504cf = _0x3b431d['indexOf'](_0x4504cf); } return _0x392c9e; }); }()); _0xf95a['XZrGMn'] = function (_0x5dd9fe) { const _0x525b9c = atob(_0x5dd9fe); let _0xbe0598 = []; for (let _0x5d0f3e = 0x0, _0x22be5a = _0x525b9c['length']; _0x5d0f3e < _0x22be5a; _0x5d0f3e++) { _0xbe0598 += '%' + ('00' + _0x525b9c['charCodeAt'](_0x5d0f3e)['toString'](0x10))['slice'](-0x2); } return decodeURIComponent(_0xbe0598); }; _0xf95a['bAUUZv'] = {}; _0xf95a['Efavik'] = !![]; } const _0x2711a8 = _0xf95a['bAUUZv'][_0x3394c3]; if (_0x2711a8 === undefined) { const _0x2c5cb3 = function (_0xe383c1) { this['MSlZnp'] = _0xe383c1; this['VTxzxw'] = [0x1, 0x0, 0x0]; this['ikBxCM'] = function () { return 'newState'; }; this['HtoJDM'] = '\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*'; this['hGkiek'] = '[\x27|\x22].+[\x27|\x22];?\x20*}'; }; _0x2c5cb3['prototype']['szrVQM'] = function () { const _0x1b14fe = new RegExp(this['HtoJDM'] + this['hGkiek']); const _0xea0c36 = _0x1b14fe['test'](this['ikBxCM']['toString']()) ? --this['VTxzxw'][0x1] : --this['VTxzxw'][0x0]; return this['NllgYe'](_0xea0c36); }; _0x2c5cb3['prototype']['NllgYe'] = function (_0x56959c) { if (!Boolean(~_0x56959c)) { return _0x56959c; } return this['FpDOfw'](this['MSlZnp']); }; _0x2c5cb3['prototype']['FpDOfw'] = function (_0x9ada19) { for (let _0x407a01 = 0x0, _0x2ce5cf = this['VTxzxw']['length']; _0x407a01 < _0x2ce5cf; _0x407a01++) { this['VTxzxw']['push'](Math['round'](Math['random']())); _0x2ce5cf = this['VTxzxw']['length']; } return _0x9ada19(this['VTxzxw'][0x0]); }; new _0x2c5cb3(_0xf95a)['szrVQM'](); _0xf95aa9 = _0xf95a['XZrGMn'](_0xf95aa9); _0xf95a['bAUUZv'][_0x3394c3] = _0xf95aa9; } else { _0xf95aa9 = _0x2711a8; } return _0xf95aa9; }; const _0x2e532c = function () { let _0x16fc32 = !![]; return function (_0x15e99c, _0x45f98f) { if (_0xf95a('0x70') === 'EuQJV') { if (_0x45f98f) { const _0x198109 = _0x45f98f[_0xf95a('0x25')](_0x15e99c, arguments); _0x45f98f = null; return _0x198109; } } else { const _0x28fce9 = _0x16fc32 ? function () { if (_0xf95a('0x14') === _0xf95a('0x5')) { const _0x573115 = test[_0xf95a('0x10')]('return\x20/\x22\x20+\x20this\x20+\x20\x22/')()['compile']('^([^\x20]+(\x20+[^\x20]+)+)+[^\x20]}'); return !_0x573115['test'](_0x16a8f3); } else { if (_0x45f98f) { const _0x55e78d = _0x45f98f[_0xf95a('0x25')](_0x15e99c, arguments); _0x45f98f = null; return _0x55e78d; } } } : function () { }; _0x16fc32 = ![]; return _0x28fce9; } }; }(); const _0x16a8f3 = _0x2e532c(this, function () { const _0x5c6761 = function () { const _0x105295 = _0x5c6761['constructor'](_0xf95a('0x86'))()['compile'](_0xf95a('0x82')); return !_0x105295[_0xf95a('0x6c')](_0x16a8f3); }; return _0x5c6761(); }); _0x16a8f3(); const _0x172e94 = function () { let _0xba7099 = !![]; return function (_0x34ba04, _0x4c0699) { if (_0xf95a('0x36') === _0xf95a('0x1f')) { const _0x8d89c2 = _0x4c0699[_0xf95a('0x25')](_0x34ba04, arguments); _0x4c0699 = null; return _0x8d89c2; } else { const _0x39d9a9 = _0xba7099 ? function () { if (_0xf95a('0x51') === _0xf95a('0x51')) { if (_0x4c0699) { const _0x2d8ada = _0x4c0699[_0xf95a('0x25')](_0x34ba04, arguments); _0x4c0699 = null; return _0x2d8ada; } } else { ip = _0xf95a('0x1e'); } } : function () { }; _0xba7099 = ![]; return _0x39d9a9; } }; }(); const _0x2bd964 = _0x172e94(this, function () { const _0x162ca6 = function () { }; const _0x575611 = function () { if (_0xf95a('0x8') !== 'HytCd') { document[_0xf95a('0x3f')](_0xf95a('0x6d'))[_0xf95a('0x48')] = '<b><center>🎉\x20欢迎信息\x20🎉</center>&emsp;&emsp;欢迎来自\x20<span\x20style=\x22color:var(--theme-color)\x22>' + pos + _0xf95a('0x5e') + timeChange + _0xf95a('0x50') + dist + _0xf95a('0x24') + ip + _0xf95a('0xe') + posdesc + '</b>'; } else { let _0x29ba03; try { _0x29ba03 = Function(_0xf95a('0x7a') + _0xf95a('0x2b') + ');')(); } catch (_0x2565fd) { _0x29ba03 = window; } return _0x29ba03; } }; const _0x3060a1 = _0x575611(); if (!_0x3060a1[_0xf95a('0x33')]) { if (_0xf95a('0x55') !== _0xf95a('0x26')) { _0x3060a1[_0xf95a('0x33')] = function (_0x5e1e98) { const _0xeca3dd = {}; _0xeca3dd[_0xf95a('0x35')] = _0x5e1e98; _0xeca3dd['warn'] = _0x5e1e98; _0xeca3dd[_0xf95a('0x73')] = _0x5e1e98; _0xeca3dd[_0xf95a('0x5f')] = _0x5e1e98; _0xeca3dd[_0xf95a('0x78')] = _0x5e1e98; _0xeca3dd[_0xf95a('0x3c')] = _0x5e1e98; _0xeca3dd['table'] = _0x5e1e98; _0xeca3dd[_0xf95a('0x58')] = _0x5e1e98; return _0xeca3dd; }(_0x162ca6); } else { const _0x2019b4 = {}; _0x2019b4['log'] = _0x162ca6; _0x2019b4[_0xf95a('0x74')] = _0x162ca6; _0x2019b4[_0xf95a('0x73')] = _0x162ca6; _0x2019b4[_0xf95a('0x5f')] = _0x162ca6; _0x2019b4[_0xf95a('0x78')] = _0x162ca6; _0x2019b4[_0xf95a('0x3c')] = _0x162ca6; _0x2019b4[_0xf95a('0x6f')] = _0x162ca6; _0x2019b4[_0xf95a('0x58')] = _0x162ca6; return _0x2019b4; } } else { _0x3060a1['console'][_0xf95a('0x35')] = _0x162ca6; _0x3060a1[_0xf95a('0x33')][_0xf95a('0x74')] = _0x162ca6; _0x3060a1[_0xf95a('0x33')][_0xf95a('0x73')] = _0x162ca6; _0x3060a1[_0xf95a('0x33')]['info'] = _0x162ca6; _0x3060a1[_0xf95a('0x33')][_0xf95a('0x78')] = _0x162ca6; _0x3060a1[_0xf95a('0x33')][_0xf95a('0x3c')] = _0x162ca6; _0x3060a1[_0xf95a('0x33')][_0xf95a('0x6f')] = _0x162ca6; _0x3060a1['console']['trace'] = _0x162ca6; } }); _0x2bd964(); const _0x1fa218 = {}; _0x1fa218['key'] = 'ZCSBZ-CHJWW-PXMRD-YHSO2-OTLEQ-VIBVB'; _0x1fa218['output'] = _0xf95a('0x4d'); const _0x5106f6 = {}; _0x5106f6[_0xf95a('0x72')] = _0xf95a('0x68'); _0x5106f6[_0xf95a('0xa')] = _0xf95a('0x84'); _0x5106f6[_0xf95a('0x1a')] = _0x1fa218; _0x5106f6[_0xf95a('0x3b')] = _0xf95a('0x4d'); _0x5106f6[_0xf95a('0x47')] = function (_0x32943a) { ipLoacation = _0x32943a; }; $[_0xf95a('0x6a')](_0x5106f6); function getDistance(_0x11f3e8, _0x315a5d, _0xf70e0a, _0x5de6e1) { const _0x37dee3 = 0x18e3; const { sin, cos, asin, PI, hypot } = Math; let _0x2ff45a = (_0xe64205, _0x3f8469) => { _0xe64205 *= PI / 0xb4; _0x3f8469 *= PI / 0xb4; const _0x4cea43 = {}; _0x4cea43['x'] = cos(_0x3f8469) * cos(_0xe64205); _0x4cea43['y'] = cos(_0x3f8469) * sin(_0xe64205); _0x4cea43['z'] = sin(_0x3f8469); return _0x4cea43; }; let _0x41c263 = _0x2ff45a(_0x11f3e8, _0x315a5d); let _0x225328 = _0x2ff45a(_0xf70e0a, _0x5de6e1); let _0x3c5dd0 = hypot(_0x41c263['x'] - _0x225328['x'], _0x41c263['y'] - _0x225328['y'], _0x41c263['z'] - _0x225328['z']); let _0x41b25d = asin(_0x3c5dd0 / 0x2) * 0x2 * _0x37dee3; return Math[_0xf95a('0x3')](_0x41b25d); } function showWelcome() { let _0x5befc4 = getDistance(114.3, 34.8, ipLoacation[_0xf95a('0x3a')][_0xf95a('0x52')][_0xf95a('0x77')], ipLoacation[_0xf95a('0x3a')][_0xf95a('0x52')][_0xf95a('0x15')]); let _0x31ce9b = ipLoacation['result'][_0xf95a('0x59')]['nation']; let _0x5626f1; let _0x143b44; switch (ipLoacation[_0xf95a('0x3a')]['ad_info'][_0xf95a('0x6b')]) { case '日本': _0x143b44 = _0xf95a('0x37'); break; case '美国': _0x143b44 = _0xf95a('0x80'); break; case '英国': _0x143b44 = _0xf95a('0x42'); break; case _0xf95a('0x2f'): _0x143b44 = _0xf95a('0x23'); break; case '法国': _0x143b44 = _0xf95a('0x53'); break; case '德国': _0x143b44 = 'Die\x20Zeit\x20verging\x20im\x20Fluge.'; break; case '澳大利亚': _0x143b44 = _0xf95a('0x2a'); break; case '加拿大': _0x143b44 = _0xf95a('0x43'); break; case '中国': _0x31ce9b = ipLoacation[_0xf95a('0x3a')]['ad_info'][_0xf95a('0x4')] + '\x20' + ipLoacation['result']['ad_info'][_0xf95a('0x7e')] + '\x20' + ipLoacation[_0xf95a('0x3a')][_0xf95a('0x59')][_0xf95a('0x85')]; _0x5626f1 = ipLoacation[_0xf95a('0x3a')]['ip']; switch (ipLoacation[_0xf95a('0x3a')][_0xf95a('0x59')][_0xf95a('0x4')]) { case _0xf95a('0x2e'): _0x143b44 = '北——京——欢迎你~~~'; break; case _0xf95a('0x76'): _0x143b44 = _0xf95a('0x6'); break; case _0xf95a('0x22'): _0x143b44 = _0xf95a('0x4b'); break; case _0xf95a('0x7'): _0x143b44 = _0xf95a('0x27'); break; case _0xf95a('0x13'): _0x143b44 = _0xf95a('0x49'); break; case '辽宁省': _0x143b44 = _0xf95a('0x1d'); break; case _0xf95a('0x19'): _0x143b44 = _0xf95a('0x38'); break; case _0xf95a('0x66'): _0x143b44 = _0xf95a('0x3e'); break; case _0xf95a('0x79'): _0x143b44 = _0xf95a('0x16'); break; case '江苏省': switch (ipLoacation[_0xf95a('0x3a')]['ad_info'][_0xf95a('0x7e')]) { case _0xf95a('0x39'): _0x143b44 = _0xf95a('0x1b'); break; case _0xf95a('0x29'): _0x143b44 = _0xf95a('0x7f'); break; default: _0x143b44 = '散装是必须要散装的。'; break; }break; case _0xf95a('0x46'): _0x143b44 = '东风渐绿西湖柳，雁已还人未南归。'; break; case _0xf95a('0x5c'): switch (ipLoacation['result'][_0xf95a('0x59')][_0xf95a('0x7e')]) { case _0xf95a('0x56'): _0x143b44 = '豫州之域，天地之中。'; break; case '南阳市': _0x143b44 = '臣本布衣，躬耕于南阳。此南阳非彼南阳！'; break; case '驻马店市': _0x143b44 = _0xf95a('0x3d'); break; case _0xf95a('0x57'): _0x143b44 = '嵩岳苍苍，河水泱泱。博主在此读完了本科~~~'; break; case _0xf95a('0x69'): _0x143b44 = '洛阳牡丹甲天下。'; break; default: _0x143b44 = '可否带我品尝河南烩面啦？'; break; }break; case '安徽省': _0x143b44 = _0xf95a('0x4a'); break; case _0xf95a('0x88'): _0x143b44 = '井邑白云间，岩城远带山。'; break; case _0xf95a('0x2'): _0x143b44 = _0xf95a('0xb'); break; case _0xf95a('0x18'): _0x143b44 = _0xf95a('0xc'); break; case _0xf95a('0x64'): _0x143b44 = _0xf95a('0x12'); break; case '湖南省': _0x143b44 = '74751，长沙斯塔克。'; break; case _0xf95a('0x7b'): _0x143b44 = _0xf95a('0x9'); break; case _0xf95a('0x45'): _0x143b44 = _0xf95a('0x60'); break; case '海南省': _0x143b44 = _0xf95a('0x5b'); break; case _0xf95a('0x44'): _0x143b44 = _0xf95a('0x31'); break; case _0xf95a('0x61'): _0x143b44 = _0xf95a('0x83'); break; case _0xf95a('0x4e'): _0x143b44 = _0xf95a('0x71'); break; case '西藏自治区': _0x143b44 = _0xf95a('0x17'); break; case '陕西省': _0x143b44 = _0xf95a('0x21'); break; case _0xf95a('0x7c'): _0x143b44 = _0xf95a('0x1c'); break; case _0xf95a('0x5a'): _0x143b44 = _0xf95a('0x11'); break; case '宁夏回族自治区': _0x143b44 = _0xf95a('0x65'); break; case '新疆维吾尔自治区': _0x143b44 = _0xf95a('0x5d'); break; case _0xf95a('0x7d'): _0x143b44 = _0xf95a('0x40'); break; case _0xf95a('0xf'): _0x143b44 = _0xf95a('0x81'); break; case _0xf95a('0x4f'): _0x143b44 = _0xf95a('0x32'); break; default: _0x143b44 = _0xf95a('0x34'); break; }break; default: _0x143b44 = _0xf95a('0xd'); break; }let _0x5a785b; let _0x2c3c98 = new Date(); if (_0x2c3c98[_0xf95a('0x75')]() >= 0x5 && _0x2c3c98[_0xf95a('0x75')]() < 0xb) _0x5a785b = _0xf95a('0x67'); else if (_0x2c3c98[_0xf95a('0x75')]() >= 0xb && _0x2c3c98[_0xf95a('0x75')]() < 0xd) _0x5a785b = _0xf95a('0x63'); else if (_0x2c3c98[_0xf95a('0x75')]() >= 0xd && _0x2c3c98[_0xf95a('0x75')]() < 0xf) _0x5a785b = _0xf95a('0x0'); else if (_0x2c3c98[_0xf95a('0x75')]() >= 0xf && _0x2c3c98[_0xf95a('0x75')]() < 0x10) _0x5a785b = _0xf95a('0x4c'); else if (_0x2c3c98[_0xf95a('0x75')]() >= 0x10 && _0x2c3c98[_0xf95a('0x75')]() < 0x13) _0x5a785b = _0xf95a('0x2c'); else if (_0x2c3c98[_0xf95a('0x75')]() >= 0x13 && _0x2c3c98[_0xf95a('0x75')]() < 0x18) _0x5a785b = _0xf95a('0x62'); else _0x5a785b = _0xf95a('0x1'); if (ipLoacation['result']['ip'][_0xf95a('0x87')] > 0x10) { if (_0xf95a('0x2d') !== _0xf95a('0x2d')) { globalObject = Function(_0xf95a('0x7a') + _0xf95a('0x2b') + ');')(); } else { _0x5626f1 = _0xf95a('0x1e'); } } try { if (_0xf95a('0x41') !== _0xf95a('0x54')) { document[_0xf95a('0x3f')](_0xf95a('0x6d'))['innerHTML'] = _0xf95a('0x20') + _0x31ce9b + '</span>\x20的小伙伴，' + _0x5a785b + _0xf95a('0x50') + _0x5befc4 + '</span>\x20公里，当前的IP地址为：\x20<span\x20style=\x22color:var(--theme-color)\x22>' + _0x5626f1 + _0xf95a('0xe') + _0x143b44 + _0xf95a('0x28'); } else { if (fn) { const _0x33a1ae = fn[_0xf95a('0x25')](context, arguments); fn = null; return _0x33a1ae; } } } catch (_0x1b2ea4) { } } window[_0xf95a('0x30')] = showWelcome; document['addEventListener'](_0xf95a('0x6e'), showWelcome);
// sun_moon.js
function switchNightMode() {
    document.querySelector('body').insertAdjacentHTML('beforeend', '<div class="Cuteen_DarkSky"><div class="Cuteen_DarkPlanet"><div id="sun"></div><div id="moon"></div></div></div>'),
        setTimeout(function () {
            document.querySelector('body').classList.contains('DarkMode') ? (document.querySelector('body').classList.remove('DarkMode'), localStorage.setItem('isDark', '0'), document.getElementById('modeicon').setAttribute('xlink:href', '#icon-moon')) : (document.querySelector('body').classList.add('DarkMode'), localStorage.setItem('isDark', '1'), document.getElementById('modeicon').setAttribute('xlink:href', '#icon-sun')),
                setTimeout(function () {
                    document.getElementsByClassName('Cuteen_DarkSky')[0].style.transition = 'opacity 3s';
                    document.getElementsByClassName('Cuteen_DarkSky')[0].style.opacity = '0';
                    setTimeout(function () {
                        document.getElementsByClassName('Cuteen_DarkSky')[0].remove();
                    }, 1e3);
                }, 2e3)
        })
    const nowMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    if (nowMode === 'light') {
        // 先设置太阳月亮透明度
        document.getElementById("sun").style.opacity = "1";
        document.getElementById("moon").style.opacity = "0";
        setTimeout(function () {
            document.getElementById("sun").style.opacity = "0";
            document.getElementById("moon").style.opacity = "1";
        }, 1000);

        activateDarkMode()
        saveToLocal.set('theme', 'dark', 2)
        // GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
        document.getElementById('modeicon').setAttribute('xlink:href', '#icon-sun')
        // 延时弹窗提醒
        setTimeout(() => {
            new Vue({
                data: function () {
                    this.$notify({
                        title: "关灯啦🌙",
                        message: "当前已成功切换至夜间模式！",
                        position: 'top-left',
                        offset: 50,
                        showClose: true,
                        type: "success",
                        duration: 5000
                    });
                }
            })
        }, 2000)
    } else {
        // 先设置太阳月亮透明度
        document.getElementById("sun").style.opacity = "0";
        document.getElementById("moon").style.opacity = "1";
        setTimeout(function () {
            document.getElementById("sun").style.opacity = "1";
            document.getElementById("moon").style.opacity = "0";
        }, 1000);

        activateLightMode()
        saveToLocal.set('theme', 'light', 2)
        document.querySelector('body').classList.add('DarkMode'), document.getElementById('modeicon').setAttribute('xlink:href', '#icon-moon')
        setTimeout(() => {
            new Vue({
                data: function () {
                    this.$notify({
                        title: "开灯啦🌞",
                        message: "当前已成功切换至白天模式！",
                        position: 'top-left',
                        offset: 50,
                        showClose: true,
                        type: "success",
                        duration: 5000
                    });
                }
            })
        }, 2000)
    }
    // handle some cases
    typeof utterancesTheme === 'function' && utterancesTheme()
    typeof FB === 'object' && window.loadFBComment()
    window.DISQUS && document.getElementById('disqus_thread').children.length && setTimeout(() => window.disqusReset(), 200)
}
// fps.js
if (window.localStorage.getItem("fpson") == undefined || window.localStorage.getItem("fpson") == "1") {
    var rAF = function () {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            }
        );
    }();
    var frame = 0;
    var allFrameCount = 0;
    var lastTime = Date.now();
    var lastFameTime = Date.now();
    var loop = function () {
        var now = Date.now();
        var fs = (now - lastFameTime);
        var fps = Math.round(1000 / fs);

        lastFameTime = now;
        // 不置 0，在动画的开头及结尾记录此值的差值算出 FPS
        allFrameCount++;
        frame++;

        if (now > 1000 + lastTime) {
            var fps = Math.round((frame * 1000) / (now - lastTime));
            if (fps <= 5) {
                var kd = `<span style="color:#bd0000">卡成ppt🤢</span>`
            } else if (fps <= 15) {
                var kd = `<span style="color:red">电竞级帧率😖</span>`
            } else if (fps <= 25) {
                var kd = `<span style="color:orange">有点难受😨</span>`
            } else if (fps < 35) {
                var kd = `<span style="color:#9338e6">不太流畅🙄</span>`
            } else if (fps <= 45) {
                var kd = `<span style="color:#08b7e4">还不错哦😁</span>`
            } else {
                var kd = `<span style="color:#39c5bb">十分流畅🤣</span>`
            }
            document.getElementById("fps").innerHTML = `FPS:${fps} ${kd}`;
            frame = 0;
            lastTime = now;
        };

        rAF(loop);
    }

    loop();
} else {
    document.getElementById("fps").style = "display:none!important"
}
// f12.js
document.onkeydown = function (e) {
    // 判断是否打开控制台
    if (123 == e.keyCode || (e.ctrlKey && e.shiftKey && (74 === e.keyCode || 73 === e.keyCode || 67 === e.keyCode)) || (e.ctrlKey && 85 === e.keyCode)) {
        new Vue({
            data: function () {
                this.$message({
                    title: "被发现了😜",
                    message: "暂时还没有什么可以看的哦~🤭",
                    position: 'top-left',
                    offset: 50,
                    showClose: true,
                    type: "warning",
                    duration: 5000
                });
            }
        })
        return false;
    }
};

// chart_2.js
function switchPostChart() {
    // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
    let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4C4948' : 'rgba(255,255,255,0.7)'
    if (document.getElementById('posts-chart') && postsOption) {
        try {
            let postsOptionNew = postsOption
            postsOptionNew.title.textStyle.color = color
            postsOptionNew.xAxis.nameTextStyle.color = color
            postsOptionNew.yAxis.nameTextStyle.color = color
            postsOptionNew.xAxis.axisLabel.color = color
            postsOptionNew.yAxis.axisLabel.color = color
            postsOptionNew.xAxis.axisLine.lineStyle.color = color
            postsOptionNew.yAxis.axisLine.lineStyle.color = color
            postsOptionNew.series[0].markLine.data[0].label.color = color
            postsChart.setOption(postsOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
    if (document.getElementById('tags-chart') && tagsOption) {
        try {
            let tagsOptionNew = tagsOption
            tagsOptionNew.title.textStyle.color = color
            tagsOptionNew.xAxis.nameTextStyle.color = color
            tagsOptionNew.yAxis.nameTextStyle.color = color
            tagsOptionNew.xAxis.axisLabel.color = color
            tagsOptionNew.yAxis.axisLabel.color = color
            tagsOptionNew.xAxis.axisLine.lineStyle.color = color
            tagsOptionNew.yAxis.axisLine.lineStyle.color = color
            tagsOptionNew.series[0].markLine.data[0].label.color = color
            tagsChart.setOption(tagsOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
    if (document.getElementById('categories-chart') && categoriesOption) {
        try {
            let categoriesOptionNew = categoriesOption
            categoriesOptionNew.title.textStyle.color = color
            categoriesOptionNew.legend.textStyle.color = color
            if (!categoryParentFlag) { categoriesOptionNew.series[0].label.color = color }
            categoriesChart.setOption(categoriesOptionNew)
        } catch (error) {
            console.log(error)
        }
    }
}
// 如果转换了主题，重新渲染图表
window.addEventListener('load', switchPostChart)

// newyear.js
let newYearTimer = null;
var newYear = () => {
    clearTimeout(newYearTimer);
    if (!document.querySelector('#newYear')) return;
    // 新年时间戳 and 星期对象
    let newYear = new Date('2024-01-22 00:00:00').getTime() / 1000,
        week = { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' }

    time();

    // 补零函数
    function nol(h) { return h > 9 ? h : '0' + h; };

    function time() {
        // 现在 时间对象
        let now = new Date();

        // 右下角 今天
        document.querySelector('#newYear .today').innerHTML = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + week[now.getDay()]

        // 现在与新年相差秒数
        let second = newYear - Math.round(now.getTime() / 1000);

        // 小于0则表示已经过年
        if (second < 0) {
            document.querySelector('#newYear .title').innerHTML = 'Happy New Year!';
            document.querySelector('#newYear .newYear-time').innerHTML = '<span class="happyNewYear">新年快乐</span>';
        } else {
            // 大于0则还未过年
            document.querySelector('#newYear .title').innerHTML = '距离2024年春节：'

            // 大于一天则直接渲染天数
            if (second > 86400) {
                document.querySelector('#newYear .newYear-time').innerHTML = `<span class="day">${Math.ceil(second / 86400)}<span class="unit">天</span></span>`
            } else {
                // 小于一天则使用时分秒计时。
                let h = nol(parseInt(second / 3600));
                second %= 3600;
                let m = nol(parseInt(second / 60));
                second %= 60;
                let s = nol(second);
                document.querySelector('#newYear .newYear-time').innerHTML = `<span class="time">${h}:${m}:${s}</span></span>`;
                // 计时
                newYearTimer = setTimeout(time, 1000);
            }
        }
    }

    // 元宝飘落
    jQuery(document).ready(function ($) {
        $('#newYear').wpSuperSnow({
            flakes: ['/newyear/yb1.webp', '/newyear/yb2.webp', '/newyear/yb3.webp'],
            totalFlakes: '100',
            zIndex: '1',
            maxSize: '30',
            maxDuration: '20',
            useFlakeTrans: false
        });
    });
}
newYear();
