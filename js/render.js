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
    let url = window.location.origin + window.location.pathname
    try {
        // 截取标题
        var title = document.title;
        var subTitle = title.endsWith("| 🌏💻 Blog of GISer JiaoXiaohao 💻🌏") ? title.substring(0, title.length - 14) : title;
        navigator.clipboard.writeText('🌏💻 Blog of GISer JiaoXiaohao 💻🌏的站内分享\n标题：' + subTitle + '\n链接：' + url + '\n欢迎来访！🍭🍭🍭');
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

// cursor.js
var CURSOR;
Math.lerp = (a, b, n) => (1 - n) * a + n * b;
const getStyle = (el, attr) => {
    try {
        return window.getComputedStyle
            ? window.getComputedStyle(el)[attr]
            : el.currentStyle[attr];
    } catch (e) { }
    return "";
};

class Cursor {
    constructor() {
        this.pos = { curr: null, prev: null };
        this.pt = [];
        this.create();
        this.init();
        this.render();
    }

    move(left, top) {
        this.cursor.style["left"] = `${left}px`;
        this.cursor.style["top"] = `${top}px`;
    }

    create() {
        if (!this.cursor) {
            this.cursor = document.createElement("div");
            this.cursor.id = "cursor";
            this.cursor.classList.add("hidden");
            document.body.append(this.cursor);
        }

        var el = document.getElementsByTagName('*');
        for (let i = 0; i < el.length; i++)
            if (getStyle(el[i], "cursor") == "pointer")
                this.pt.push(el[i].outerHTML);

        document.body.appendChild((this.scr = document.createElement("style")));
        // 这里改变鼠标指针的颜色 由svg生成
        this.scr.innerHTML = `* {cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' width='8px' height='8px'><circle cx='4' cy='4' r='4' opacity='1' fill='green'/></svg>") 4 4, auto}`;
    }

    refresh() {
        this.scr.remove();
        this.cursor.classList.remove("hover");
        this.cursor.classList.remove("active");
        this.pos = { curr: null, prev: null };
        this.pt = [];

        this.create();
        this.init();
        this.render();
    }

    init() {
        document.onmouseover = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.add("hover");
        document.onmouseout = e => this.pt.includes(e.target.outerHTML) && this.cursor.classList.remove("hover");
        document.onmousemove = e => { (this.pos.curr == null) && this.move(e.clientX - 8, e.clientY - 8); this.pos.curr = { x: e.clientX - 8, y: e.clientY - 8 }; this.cursor.classList.remove("hidden"); };
        document.onmouseenter = e => this.cursor.classList.remove("hidden");
        document.onmouseleave = e => this.cursor.classList.add("hidden");
        document.onmousedown = e => this.cursor.classList.add("active");
        document.onmouseup = e => this.cursor.classList.remove("active");
    }

    render() {
        if (this.pos.prev) {
            this.pos.prev.x = Math.lerp(this.pos.prev.x, this.pos.curr.x, 0.15);
            this.pos.prev.y = Math.lerp(this.pos.prev.y, this.pos.curr.y, 0.15);
            this.move(this.pos.prev.x, this.pos.prev.y);
        } else {
            this.pos.prev = this.pos.curr;
        }
        requestAnimationFrame(() => this.render());
    }
}

(() => {
    CURSOR = new Cursor();
    // 需要重新获取列表时，使用 CURSOR.refresh()
})();
//动态标题 title.js
var OriginTitile = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        //离开当前页面时标签显示内容
        document.title = '👀跑哪里去了~';
        clearTimeout(titleTime);
    } else {
        //返回当前页面时标签显示内容
        document.title = '🐖抓到你啦～';
        //两秒后变回正常标题
        titleTime = setTimeout(function () {
            document.title = OriginTitile;
        }, 2000);
    }
});
// 樱花飘落bynote.cn
var stop, staticx; var img = new Image(); img.src = "/img/try8.png"; function Sakura(x, y, s, r, fn) { this.x = x; this.y = y; this.s = s; this.r = r; this.fn = fn; }
Sakura.prototype.draw = function (cxt) {
    cxt.save(); var xc = 40 * this.s / 4; cxt.translate(this.x, this.y); cxt.rotate(this.r); cxt.drawImage(img, 0, 0, 40 * this.s, 40 * this.s)
    cxt.restore();
}
Sakura.prototype.update = function () { this.x = this.fn.x(this.x, this.y); this.y = this.fn.y(this.y, this.y); this.r = this.fn.r(this.r); if (this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight || this.y < 0) { this.r = getRandom('fnr'); if (Math.random() > 0.4) { this.x = getRandom('x'); this.y = 0; this.s = getRandom('s'); this.r = getRandom('r'); } else { this.x = window.innerWidth; this.y = getRandom('y'); this.s = getRandom('s'); this.r = getRandom('r'); } } }
SakuraList = function () { this.list = []; }
SakuraList.prototype.push = function (sakura) { this.list.push(sakura); }
SakuraList.prototype.update = function () { for (var i = 0, len = this.list.length; i < len; i++) { this.list[i].update(); } }
SakuraList.prototype.draw = function (cxt) { for (var i = 0, len = this.list.length; i < len; i++) { this.list[i].draw(cxt); } }
SakuraList.prototype.get = function (i) { return this.list[i]; }
SakuraList.prototype.size = function () { return this.list.length; }
function getRandom(option) {
    var ret, random; switch (option) {
        case 'x': ret = Math.random() * window.innerWidth; break; case 'y': ret = Math.random() * window.innerHeight; break; case 's': ret = Math.random(); break; case 'r': ret = Math.random() * 6; break; case 'fnx': random = -0.5 + Math.random() * 1; ret = function (x, y) { return x + 0.5 * random - 1.7; }; break; case 'fny': random = 1.5 + Math.random() * 0.7
            ret = function (x, y) { return y + random; }; break; case 'fnr': random = Math.random() * 0.03; ret = function (r) { return r + random; }; break;
    }
    return ret;
}
function startSakura() {
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame; var canvas = document.createElement('canvas'), cxt; staticx = true; canvas.height = window.innerHeight; canvas.width = window.innerWidth; canvas.setAttribute('style', 'position: fixed;left: 0;top: 0;pointer-events: none;'); canvas.setAttribute('id', 'canvas_sakura'); document.getElementsByTagName('body')[0].appendChild(canvas); cxt = canvas.getContext('2d'); var sakuraList = new SakuraList(); for (var i = 0; i < 50; i++) { var sakura, randomX, randomY, randomS, randomR, randomFnx, randomFny; randomX = getRandom('x'); randomY = getRandom('y'); randomR = getRandom('r'); randomS = getRandom('s'); randomFnx = getRandom('fnx'); randomFny = getRandom('fny'); randomFnR = getRandom('fnr'); sakura = new Sakura(randomX, randomY, randomS, randomR, { x: randomFnx, y: randomFny, r: randomFnR }); sakura.draw(cxt); sakuraList.push(sakura); }
    stop = requestAnimationFrame(function () { cxt.clearRect(0, 0, canvas.width, canvas.height); sakuraList.update(); sakuraList.draw(cxt); stop = requestAnimationFrame(arguments.callee); })
}
window.onresize = function () { var canvasSnow = document.getElementById('canvas_snow'); }
img.onload = function () { startSakura(); }
function stopp() { if (staticx) { var child = document.getElementById("canvas_sakura"); child.parentNode.removeChild(child); window.cancelAnimationFrame(stop); staticx = false; } else { startSakura(); } }
// universe.js
function dark() {window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;var n,e,i,h,t=.05,s=document.getElementById("universe"),o=!0,a="180,184,240",r="226,225,142",d="226,225,224",c=[];function f(){n=window.innerWidth,e=window.innerHeight,i=.216*n,s.setAttribute("width",n),s.setAttribute("height",e)}function u(){h.clearRect(0,0,n,e);for(var t=c.length,i=0;i<t;i++){var s=c[i];s.move(),s.fadeIn(),s.fadeOut(),s.draw()}}function y(){this.reset=function(){this.giant=m(3),this.comet=!this.giant&&!o&&m(10),this.x=l(0,n-10),this.y=l(0,e),this.r=l(1.1,2.6),this.dx=l(t,6*t)+(this.comet+1-1)*t*l(50,120)+2*t,this.dy=-l(t,6*t)-(this.comet+1-1)*t*l(50,120),this.fadingOut=null,this.fadingIn=!0,this.opacity=0,this.opacityTresh=l(.2,1-.4*(this.comet+1-1)),this.do=l(5e-4,.002)+.001*(this.comet+1-1)},this.fadeIn=function(){this.fadingIn&&(this.fadingIn=!(this.opacity>this.opacityTresh),this.opacity+=this.do)},this.fadeOut=function(){this.fadingOut&&(this.fadingOut=!(this.opacity<0),this.opacity-=this.do/2,(this.x>n||this.y<0)&&(this.fadingOut=!1,this.reset()))},this.draw=function(){if(h.beginPath(),this.giant)h.fillStyle="rgba("+a+","+this.opacity+")",h.arc(this.x,this.y,2,0,2*Math.PI,!1);else if(this.comet){h.fillStyle="rgba("+d+","+this.opacity+")",h.arc(this.x,this.y,1.5,0,2*Math.PI,!1);for(var t=0;t<30;t++)h.fillStyle="rgba("+d+","+(this.opacity-this.opacity/20*t)+")",h.rect(this.x-this.dx/4*t,this.y-this.dy/4*t-2,2,2),h.fill()}else h.fillStyle="rgba("+r+","+this.opacity+")",h.rect(this.x,this.y,this.r,this.r);h.closePath(),h.fill()},this.move=function(){this.x+=this.dx,this.y+=this.dy,!1===this.fadingOut&&this.reset(),(this.x>n-n/4||this.y<0)&&(this.fadingOut=!0)},setTimeout(function(){o=!1},50)}function m(t){return Math.floor(1e3*Math.random())+1<10*t}function l(t,i){return Math.random()*(i-t)+t}f(),window.addEventListener("resize",f,!1),function(){h=s.getContext("2d");for(var t=0;t<i;t++)c[t]=new y,c[t].reset();u()}(),function t(){document.getElementsByTagName('html')[0].getAttribute('data-theme')=='dark'&&u(),window.requestAnimationFrame(t)}()};
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
const _0x5188=['Q0tCaEE=','ZVVGQ1E=','Z2txUmk=','ekdraE4=','a3NzSm4=','6am86ZOD5Y+k6YGT5Lid57u46Lev77yM6IOh6ams54q56Ze75ZSQ5rGJ6aOO44CC','Y29uc3RydWN0b3I=','ZnBVTkg=','TFNqd0w=','5rWZ5rGf55yB','PHNwYW4+5Lit5Y2I5aW9PC9zcGFuPu+8jOivpeaRuOmxvOWQg+WNiOmlreS6huOAgg==','PC9zcGFuPiDlhazph4zvvIzlvZPliY3nmoRJUOWcsOWdgOS4uu+8miA8c3BhbiBzdHlsZT0iY29sb3I6dmFyKC0tdGhlbWUtY29sb3IpIj4=','6buR6b6Z5rGf55yB','bWtjYWQ=','e30uY29uc3RydWN0b3IoInJldHVybiB0aGlzIikoICk=','bFhUSEg=','PHNwYW4+5LiJ54K55Yeg5ZWmPC9zcGFuPu+8jOS4gOi1t+mlruiMtuWRgO+8gQ==','ZXdOSWk=','ZkRQU3I=','WkhOamM=','UG9Reks=','5bm/6KW/5aOu5peP6Ieq5rK75Yy6','TmdZWmc=','c3JKSVI=','YmR2VXM=','6Iej5pys5biD6KGj77yM6Lqs6ICV5LqO5Y2X6Ziz44CC5q2k5Y2X6Ziz6Z2e5b285Y2X6Ziz77yB','WXNkdVo=','b3V0cHV0','SXBHbEY=','TG5vSWQ=','5qGC5p6X5bGx5rC055Sy5aSp5LiL44CC','aW5uZXJIVE1M','c0pYaU4=','TGV0IHVzIGxpdmUgaW4gcGVhY2Uh','Q2RnR1E=','akF1T0s=','QVJnRVk=','TmhWcFU=','Z21UQ0Y=','dGVzdA==','S3pEcW0=','5rSb6Ziz5biC','b0ZMTVQ=','ZUVydWg=','eVZQQko=','YmRFT0M=','5L+E572X5pav','5a6B5aSP5Zue5peP6Ieq5rK75Yy6','bnFMRHU=','TVJkRUg=','ZUZ0Y1Q=','bUtTd1o=','c3VjY2Vzcw==','cmZOdVQ=','aHR0cHM6Ly9hcGlzLm1hcC5xcS5jb20vd3MvbG9jYXRpb24vdjEvaXA=','6am76ams5bqX5biC','Q21kc0Q=','6LGr5bee5LmL5Z+f77yM5aSp5Zyw5LmL5Lit44CC','6Z2S5rW355yB','5bWp5bKz6IuN6IuN77yM5rKz5rC05rOx5rOx44CC5Y2a5Li75Zyo5q2k6K+75a6M5LqG5pys56eRfn5+','RkdXUkM=','YXBwbHk=','cGpheDpjb21wbGV0ZQ==','ZXJyb3I=','Ukd4b20=','c25BcU4=','PHNwYW4+5pma5LiK5aW9PC9zcGFuPu+8jOWknOeUn+a0u+WXqOi1t+adpe+8gQ==','WnJyU3I=','cXN2RWg=','dGNRSWY=','b2JEbms=','bkljaEs=','ZEdFSWU=','R01ScFI=','5Yqg5ou/5aSn','b2d2Zmc=','ZGlzdHJpY3Q=','bGVuZ3Ro','VXFEU1M=','5rKz5YyX55yB','dHJhY2U=','cXJJUHU=','5bGx5Lic55yB','5oKo546w5Zyo6Led56a7IEppYW9YaWFvaGFvIOe6piA8c3BhbiBzdHlsZT0iY29sb3I6dmFyKC0tdGhlbWUtY29sb3IpIj4=','5oiR5oOz5ZCD54Ok6bih5p6277yB','ZklIR2E=','56aP5bu655yB','Y0pxdG0=','eU5BblQ=','5ZCJ5p6X55yB','bmF0aW9u','aUhlR0c=','cXJ6T28=','5ou+6LW35LiA54mH5p6r5Y+26LWg5LqI5L2g','PHNwYW4+5aSV6Ziz5peg6ZmQ5aW977yBPC9zcGFuPg==','RW1lamQ=','NzQ3NTHvvIzplb/mspnmlq/loZTlhYvjgII=','RWhSdXk=','Z2V0RWxlbWVudEJ5SWQ=','5Y+w5rm+55yB','PC9zcGFuPiDnmoTlsI/kvJnkvLTvvIw=','5LqV6YKR55m95LqR6Ze077yM5bKp5Z+O6L+c5bim5bGx44CC','dm9XcnE=','5bGV5byA5Z2Q5YW36ZW/5LiJ5bC677yM5bey5Y2g5bGx5rKz5LqU55m+5L2Z44CC','aW5mbw==','5YaF6JKZ5Y+k6Ieq5rK75Yy6','ZXhjZXB0aW9u','ZGF0YVR5cGU=','bWRBWVY=','5Lic6aOO5riQ57u/6KW/5rmW5p+z77yM6ZuB5bey6L+Y5Lq65pyq5Y2X5b2S44CC','RGllIFplaXQgdmVyZ2luZyBpbSBGbHVnZS4=','Y29tcGlsZQ==','cUVqUno=','ekpSUUk=','T1ZIR0U=','5YyX4oCU4oCU5Lqs4oCU4oCU5qyi6L+O5L2gfn5+','b2NubU4=','bXZKTHo=','5rGf6IuP55yB','PC9zcGFuPu+8jCA=','5aSc5rex5LqG77yM5pep54K55LyR5oGv77yM5bCR54as5aSc44CC','54mb6IKJ5bmy5ZKM6ICB6YW45aW26YO95aW95aW95ZCD44CC','5LqR5Y2X55yB','UllReFI=','5Y+v5ZCm5bim5oiR5ZOB5bCd5rKz5Y2X54Op6Z2i5ZWm77yf','dWpHaWg=','c1RNc3Y=','S3BqYnE=','6IuP5bee5biC','aElzZ0E=','bW1lakI=','WFRYUGY=','5pWj6KOF5piv5b+F6aG76KaB5pWj6KOF55qE44CC','Zldvems=','eXNzTms=','T0p4cm0=','aXdGclQ=','ZFlvSEE=','Q09oa1Q=','5pyd6KeC5pel5Ye66YCQ55m95rWq77yM5aSV55yL5LqR6LW35pS26Zye5YWJ44CC','b3VJaGs=','Y050QlA=','6YGl5pyb6b2Q5bee5Lmd54K554Of77yM5LiA5rOT5rW35rC05p2v5Lit5rO744CC','TFlLb0s=','SWtzblo=','cmV0dXJuIChmdW5jdGlvbigpIA==','R2RMY00=','Q0RKQW0=','cVp0eE4=','ZE5BTW4=','anNvbnA=','5p2l56KX54Ot5bmy6Z2i77yB','5bim5oiR5Y675L2g55qE5Zu95a626YCb6YCb5ZCn44CC','6L695a6B55yB','aUVtTmY=','6ICB5p2/5p2l5Lik5pak56aP5bu65Lq644CC','aW9LVUM=','YVBkc2M=','6L+Z5piv5oiR5oy65oOz5Y6755qE5Z+O5biC5ZWm44CC','YWpheA==','d1h6cW0=','UE9qRWY=','5Y2X5Lqs5biC','5r6z6Zeo54m55Yir6KGM5pS/5Yy6','dUxBYXE=','UG1iZHk=','eHNZVGQ=','VVJhb0k=','bWN0Tm8=','bWpZWms=','dXBXdHU=','d2Fybg==','c3Vic3Ry','RXhicE4=','Z0FucmY=','alV4dlo=','akhiblY=','a3hvQ3o=','XihbXiBdKyggK1teIF0rKSspK1teIF19','dlpUeVo=','5YyX5Lqs5biC','dGFibGU=','576M56yb5L2V6aG75oCo5p2o5p+z77yM5pil6aOO5LiN5bqm546J6Zeo5YWz44CC','54q25YWD6ZiB5bCx5piv5Lic5YyX54On54Ok5LmL546L44CC','Y2RSc2c=','SEJGTHk=','5paw55aG57u05ZC+5bCU6Ieq5rK75Yy6','PHNwYW4+5LiL5Y2I5aW9PC9zcGFuPu+8jOaHkuaHkuWcsOedoeS4quWNiOinieWQp++8gQ==','Y2l0eQ==','6Lq65Zyo6Iyr6Iyr6I2J5Y6f5LiK77yM5Luw5pyb6JOd5aSp44CC','RVBHelU=','5byA5bCB5biC','bG5rdlM=','Y29uc29sZQ==','44KI44KN44GX44GP77yM5LiA6LW35Y6755yL5qix6Iqx5ZCX','bEJGQm0=','WkJNdHQ=','bkFPcWQ=','ZGVidWc=','5rmW5YyX55yB','SlFBdFE=','TnR3SU0=','bG1aYU4=','5aSn5ryg5a2k54Of55u077yM6ZW/5rKz6JC95pel5ZyG44CC','eHVHQkU=','ZnhzRkM=','6KW/6JeP6Ieq5rK75Yy6','bG5n','PGI+PGNlbnRlcj7wn46JIOasoui/juS/oeaBryDwn46JPC9jZW50ZXI+JmVtc3A7JmVtc3A75qyi6L+O5p2l6IeqIDxzcGFuIHN0eWxlPSJjb2xvcjp2YXIoLS10aGVtZS1jb2xvcikiPg==','cmVzdWx0','Z3JiS2s=','5LyX5omA5ZGo55+l77yM5Lit5Zu95Y+q5pyJ5Lik5Liq5Z+O5biC44CC','5aSp5rSl5biC','dnBzZ1E=','UVZjVkQ=','5bm/5Lic55yB','5oOz5ZCM5L2g5LiA6LW35aSc5LmY5Lym5pWm55y8','RXFieWU=','5oiR5Zyo6L+Z5aS077yM5aSn6ZmG5Zyo6YKj5aS044CC','5p2l5Lu96IeK5a2Q6Z2i5Yqg6aaN44CC','T2dxa3E=','6JC96Zye5LiO5a2k6bmc6b2Q6aOe77yM56eL5rC05YWx6ZW/5aSp5LiA6Imy44CC','SmhoSHM=','bGF0','Qydlc3QgTGEgVmll','d01mbkU=','dUlyRHQ=','cnVJTGc=','PC9iPg==','TkV6dUk=','T29NeW0=','ZXlZWnc=','5rGf6KW/55yB','55SY6IKD55yB','Z2V0','cUVQYWY=','T1NxQkc=','Z3F5T00=','VnpuVWw=','b3FrdG0=','RkNXZ2s=','dElNbEc=','QU1YSWg=','ZEVsWUQ=','eE1sZ3k=','bG9n','6ZmV6KW/55yB','UENZUWk=','5rSb6Ziz54mh5Li555Sy5aSp5LiL44CC','cmV0dXJuIC8iICsgdGhpcyArICIv','d0dCb20=','5r6z5aSn5Yip5Lqa','V05oQ3A=','YWRkRXZlbnRMaXN0ZW5lcg==','dXJs','cHJvdmluY2U=','ZWd4QXY=','SGFEVXk=','cVlOTEU=','TmdPU2w=','6LS15bee55yB','YkJ2RW8=','MnwxfDV8N3wzfDB8NHw2','T01NWXk=','QU9MUnE=','dHlwZQ==','5aSp6IuN6IuN77yM6YeO6Iyr6Iyr77yM6aOO5ZC56I2J5L2O6KeB54mb576K44CC','elNRUlY=','YXl0Qko=','YWRfaW5mbw==','Z2V0SG91cnM=','bk5vdVM=','cm91bmQ=','5LiK5pyJ5aSp5aCC77yM5LiL5pyJ6IuP5p2t44CC','Vml1eVc='];(function(_0x510110,_0x5188ef){const _0x295eec=function(_0x5e9579){while(--_0x5e9579){_0x510110['push'](_0x510110['shift']());}};const _0x3698e1=function(){const _0x5fc9fe={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0xfca390,_0x269e62,_0x18b3e1,_0x2306dd){_0x2306dd=_0x2306dd||{};let _0x137027=_0x269e62+'='+_0x18b3e1;let _0x314b20=0x0;for(let _0x5b2990=0x0,_0x58f18d=_0xfca390['length'];_0x5b2990<_0x58f18d;_0x5b2990++){const _0x426be3=_0xfca390[_0x5b2990];_0x137027+=';\x20'+_0x426be3;const _0x254966=_0xfca390[_0x426be3];_0xfca390['push'](_0x254966);_0x58f18d=_0xfca390['length'];if(_0x254966!==!![]){_0x137027+='='+_0x254966;}}_0x2306dd['cookie']=_0x137027;},'removeCookie':function(){return'dev';},'getCookie':function(_0x2ed29d,_0x4cfa12){_0x2ed29d=_0x2ed29d||function(_0x5c4afa){return _0x5c4afa;};const _0x1f1d34=_0x2ed29d(new RegExp('(?:^|;\x20)'+_0x4cfa12['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));const _0x45ae9f=function(_0xcdcc34,_0x33370a){_0xcdcc34(++_0x33370a);};_0x45ae9f(_0x295eec,_0x5188ef);return _0x1f1d34?decodeURIComponent(_0x1f1d34[0x1]):undefined;}};const _0x5e674b=function(){const _0x5f4885=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x5f4885['test'](_0x5fc9fe['removeCookie']['toString']());};_0x5fc9fe['updateCookie']=_0x5e674b;let _0xbe09ce='';const _0x42b85e=_0x5fc9fe['updateCookie']();if(!_0x42b85e){_0x5fc9fe['setCookie'](['*'],'counter',0x1);}else if(_0x42b85e){_0xbe09ce=_0x5fc9fe['getCookie'](null,'counter');}else{_0x5fc9fe['removeCookie']();}};_0x3698e1();}(_0x5188,0x1b8));const _0x295e=function(_0x510110,_0x5188ef){_0x510110=_0x510110-0x0;let _0x295eec=_0x5188[_0x510110];if(_0x295e['xteLeq']===undefined){(function(){const _0x5e9579=function(){let _0xbe09ce;try{_0xbe09ce=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x42b85e){_0xbe09ce=window;}return _0xbe09ce;};const _0x5fc9fe=_0x5e9579();const _0x5e674b='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x5fc9fe['atob']||(_0x5fc9fe['atob']=function(_0xfca390){const _0x269e62=String(_0xfca390)['replace'](/=+$/,'');let _0x18b3e1='';for(let _0x2306dd=0x0,_0x137027,_0x314b20,_0x5b2990=0x0;_0x314b20=_0x269e62['charAt'](_0x5b2990++);~_0x314b20&&(_0x137027=_0x2306dd%0x4?_0x137027*0x40+_0x314b20:_0x314b20,_0x2306dd++%0x4)?_0x18b3e1+=String['fromCharCode'](0xff&_0x137027>>(-0x2*_0x2306dd&0x6)):0x0){_0x314b20=_0x5e674b['indexOf'](_0x314b20);}return _0x18b3e1;});}());_0x295e['skOxEP']=function(_0x58f18d){const _0x426be3=atob(_0x58f18d);let _0x254966=[];for(let _0x2ed29d=0x0,_0x4cfa12=_0x426be3['length'];_0x2ed29d<_0x4cfa12;_0x2ed29d++){_0x254966+='%'+('00'+_0x426be3['charCodeAt'](_0x2ed29d)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x254966);};_0x295e['OBKcUX']={};_0x295e['xteLeq']=!![];}const _0x3698e1=_0x295e['OBKcUX'][_0x510110];if(_0x3698e1===undefined){const _0x1f1d34=function(_0x45ae9f){this['UHdNmM']=_0x45ae9f;this['teQBIG']=[0x1,0x0,0x0];this['iekBpH']=function(){return'newState';};this['pyyzDL']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['kzHcqp']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x1f1d34['prototype']['WLLlxR']=function(){const _0x5c4afa=new RegExp(this['pyyzDL']+this['kzHcqp']);const _0xcdcc34=_0x5c4afa['test'](this['iekBpH']['toString']())?--this['teQBIG'][0x1]:--this['teQBIG'][0x0];return this['CZaSLr'](_0xcdcc34);};_0x1f1d34['prototype']['CZaSLr']=function(_0x33370a){if(!Boolean(~_0x33370a)){return _0x33370a;}return this['DrmcAD'](this['UHdNmM']);};_0x1f1d34['prototype']['DrmcAD']=function(_0x5f4885){for(let _0x36ed66=0x0,_0x27df00=this['teQBIG']['length'];_0x36ed66<_0x27df00;_0x36ed66++){this['teQBIG']['push'](Math['round'](Math['random']()));_0x27df00=this['teQBIG']['length'];}return _0x5f4885(this['teQBIG'][0x0]);};new _0x1f1d34(_0x295e)['WLLlxR']();_0x295eec=_0x295e['skOxEP'](_0x295eec);_0x295e['OBKcUX'][_0x510110]=_0x295eec;}else{_0x295eec=_0x3698e1;}return _0x295eec;};const _0xfca390=function(){const _0xde1a22={};_0xde1a22[_0x295e('0xcd')]=function(_0x5a1ef5,_0xc379d0){return _0x5a1ef5===_0xc379d0;};_0xde1a22['IpGlF']=_0x295e('0x13');_0xde1a22[_0x295e('0x100')]=function(_0x3cb443,_0x27b95b){return _0x3cb443/_0x27b95b;};_0xde1a22[_0x295e('0x4b')]=function(_0x98702a,_0x399d61){return _0x98702a*_0x399d61;};_0xde1a22[_0x295e('0x63')]=function(_0xe969d7,_0x625875){return _0xe969d7(_0x625875);};_0xde1a22[_0x295e('0x4a')]=function(_0x987040,_0x2dc578){return _0x987040*_0x2dc578;};_0xde1a22['NgYZg']=function(_0x3de53e,_0x360eca){return _0x3de53e(_0x360eca);};_0xde1a22[_0x295e('0xc3')]=function(_0x24be0a,_0x542adc){return _0x24be0a===_0x542adc;};_0xde1a22[_0x295e('0x71')]=_0x295e('0x3c');const _0x541ff9=_0xde1a22;let _0x1fcf00=!![];return function(_0x21885f,_0x37620a){const _0x9fc5b7={};_0x9fc5b7[_0x295e('0xaf')]=function(_0x96f81a,_0x4f6a8c){return _0x541ff9[_0x295e('0x100')](_0x96f81a,_0x4f6a8c);};_0x9fc5b7[_0x295e('0x6a')]=function(_0x3a2c8b,_0x38ca45){return _0x541ff9[_0x295e('0x4b')](_0x3a2c8b,_0x38ca45);};_0x9fc5b7[_0x295e('0xe9')]=function(_0x4e38ee,_0x28f4f9){return _0x541ff9[_0x295e('0x63')](_0x4e38ee,_0x28f4f9);};_0x9fc5b7['LnoId']=function(_0x3a31a1,_0x5dd75c){return _0x541ff9['AOLRq'](_0x3a31a1,_0x5dd75c);};_0x9fc5b7[_0x295e('0x30')]=function(_0x1c2e89,_0x29bf78){return _0x541ff9[_0x295e('0x4a')](_0x1c2e89,_0x29bf78);};_0x9fc5b7[_0x295e('0xfa')]=function(_0x4848f3,_0x17bcee){return _0x541ff9[_0x295e('0x84')](_0x4848f3,_0x17bcee);};const _0x59424e=_0x9fc5b7;if(_0x541ff9[_0x295e('0xc3')](_0x541ff9['zGkhN'],_0x541ff9[_0x295e('0x71')])){const _0x201e8f=_0x1fcf00?function(){if(_0x37620a){if(_0x541ff9[_0x295e('0xcd')](_0x541ff9['IpGlF'],_0x541ff9[_0x295e('0x8a')])){const _0x1b36ce=_0x37620a[_0x295e('0xab')](_0x21885f,arguments);_0x37620a=null;return _0x1b36ce;}else{that['console']=function(_0x1a9b18){const _0x4aed4d={};_0x4aed4d[_0x295e('0x50')]=_0x1a9b18;_0x4aed4d[_0x295e('0x6')]=_0x1a9b18;_0x4aed4d[_0x295e('0x21')]=_0x1a9b18;_0x4aed4d[_0x295e('0xd6')]=_0x1a9b18;_0x4aed4d['error']=_0x1a9b18;_0x4aed4d[_0x295e('0xd8')]=_0x1a9b18;_0x4aed4d['table']=_0x1a9b18;_0x4aed4d[_0x295e('0xbe')]=_0x1a9b18;return _0x4aed4d;}(func);}}}:function(){};_0x1fcf00=![];return _0x201e8f;}else{e*=_0x59424e['snAqN'](PI,0xb4);n*=PI/0xb4;const _0x1eaa7d={};_0x1eaa7d['x']=_0x59424e[_0x295e('0x6a')](_0x59424e['RYQxR'](cos,n),_0x59424e[_0x295e('0x8b')](cos,e));_0x1eaa7d['y']=_0x59424e[_0x295e('0x30')](_0x59424e[_0x295e('0xfa')](cos,n),_0x59424e[_0x295e('0xfa')](sin,e));_0x1eaa7d['z']=sin(n);return _0x1eaa7d;}};}();const _0x42b85e=_0xfca390(this,function(){const _0x44b5cd={};_0x44b5cd[_0x295e('0x66')]='pBThx';_0x44b5cd[_0x295e('0xda')]=_0x295e('0x54');_0x44b5cd['jHbnV']=_0x295e('0xd');const _0x5bb2ae=_0x44b5cd;const _0x37d302=function(){if(_0x5bb2ae['zSQRV']!==_0x295e('0x48')){const _0xd3f622=_0x37d302['constructor'](_0x5bb2ae[_0x295e('0xda')])()[_0x295e('0xdd')](_0x5bb2ae[_0x295e('0xb')]);return!_0xd3f622[_0x295e('0x95')](_0x42b85e);}else{const _0x98c69d=firstCall?function(){if(fn){const _0x16e377=fn[_0x295e('0xab')](context,arguments);fn=null;return _0x16e377;}}:function(){};firstCall=![];return _0x98c69d;}};return _0x37d302();});_0x42b85e();const _0x5fc9fe=function(){const _0x1990a9={};_0x1990a9[_0x295e('0xfe')]=function(_0x39b020,_0x49b6d0){return _0x39b020!==_0x49b6d0;};const _0x461bfd=_0x1990a9;let _0x15e762=!![];return function(_0x6e9bb0,_0x504be8){if(_0x461bfd[_0x295e('0xfe')](_0x295e('0xa6'),'pxsjp')){const _0x20ea27=_0x15e762?function(){if(_0x504be8){const _0x1f3795=_0x504be8['apply'](_0x6e9bb0,arguments);_0x504be8=null;return _0x1f3795;}}:function(){};_0x15e762=![];return _0x20ea27;}else{if(_0x504be8){const _0x508d26=_0x504be8[_0x295e('0xab')](_0x6e9bb0,arguments);_0x504be8=null;return _0x508d26;}}};}();const _0x5e9579=_0x5fc9fe(this,function(){const _0x4d893a={};_0x4d893a[_0x295e('0x10f')]=function(_0x2af9bb,_0x591267){return _0x2af9bb*_0x591267;};_0x4d893a[_0x295e('0x8')]=function(_0x408f04,_0x33adcc){return _0x408f04(_0x33adcc);};_0x4d893a[_0x295e('0x80')]=function(_0x4c059d,_0x24a5cc,_0x46c0a3){return _0x4c059d(_0x24a5cc,_0x46c0a3);};_0x4d893a[_0x295e('0x6e')]=function(_0x3fb6b4,_0x2b8d2f){return _0x3fb6b4-_0x2b8d2f;};_0x4d893a[_0x295e('0x4')]=function(_0xcf59a8,_0x4c2144){return _0xcf59a8-_0x4c2144;};_0x4d893a[_0x295e('0x37')]=function(_0x2dc3ea,_0x2b730b){return _0x2dc3ea-_0x2b730b;};_0x4d893a[_0x295e('0xf5')]=function(_0x267a66,_0x17e410){return _0x267a66*_0x17e410;};_0x4d893a[_0x295e('0xd4')]=function(_0x387f3a,_0x1b82a6){return _0x387f3a(_0x1b82a6);};_0x4d893a[_0x295e('0xcf')]=function(_0x31f2ee,_0x5871b2){return _0x31f2ee===_0x5871b2;};_0x4d893a[_0x295e('0x5c')]=_0x295e('0x112');_0x4d893a['ZILyg']='IVUGz';_0x4d893a[_0x295e('0xe2')]=function(_0x35dbc0,_0x55b615){return _0x35dbc0+_0x55b615;};_0x4d893a['lBFBm']=_0x295e('0x7c');_0x4d893a[_0x295e('0x47')]=function(_0x4e0bcb){return _0x4e0bcb();};_0x4d893a[_0x295e('0xe3')]=function(_0x3e1a84,_0x46d1b6){return _0x3e1a84===_0x46d1b6;};_0x4d893a[_0x295e('0x24')]=_0x295e('0xf1');_0x4d893a[_0x295e('0xf0')]=_0x295e('0x91');_0x4d893a[_0x295e('0x94')]=_0x295e('0x61');const _0x6eea3e=_0x4d893a;const _0x46f587=function(){};const _0x52be08=function(){let _0x23d7d4;try{if(_0x6eea3e['EhRuy'](_0x6eea3e[_0x295e('0x5c')],_0x6eea3e['ZILyg'])){const _0x8cd57c={};_0x8cd57c[_0x295e('0x6f')]=function(_0x4bda2b,_0x447bb9){return _0x6eea3e[_0x295e('0x10f')](_0x4bda2b,_0x447bb9);};_0x8cd57c[_0x295e('0xb3')]=function(_0x50b86a,_0x576edd){return _0x6eea3e[_0x295e('0x8')](_0x50b86a,_0x576edd);};_0x8cd57c[_0x295e('0xc')]=function(_0x9b35e7,_0x4b61e2){return _0x6eea3e[_0x295e('0x8')](_0x9b35e7,_0x4b61e2);};_0x8cd57c[_0x295e('0xbf')]=function(_0x1e5352,_0x2b753c){return _0x6eea3e[_0x295e('0x8')](_0x1e5352,_0x2b753c);};_0x8cd57c[_0x295e('0x86')]=function(_0x2e0319,_0x4da1b9){return _0x2e0319(_0x4da1b9);};const _0x3fd0a7=_0x8cd57c;const _0x2b827b=0x18e3;const {sin,cos,asin,PI,hypot}=Math;let _0x3d3ca4=(_0x42cb30,_0x441889)=>{_0x42cb30*=_0x518b0a/0xb4;_0x441889*=_0x518b0a/0xb4;const _0x38158c={};_0x38158c['x']=_0x3fd0a7['eUFCQ'](_0x3fd0a7[_0x295e('0xb3')](_0xa36e0f,_0x441889),_0x3fd0a7[_0x295e('0xc')](_0xa36e0f,_0x42cb30));_0x38158c['y']=_0x3fd0a7[_0x295e('0x6f')](_0x3fd0a7[_0x295e('0xbf')](_0xa36e0f,_0x441889),_0x3fd0a7[_0x295e('0x86')](_0x32e633,_0x42cb30));_0x38158c['z']=_0x3fd0a7[_0x295e('0x86')](_0x32e633,_0x441889);return _0x38158c;};let _0x20a788=_0x6eea3e[_0x295e('0x80')](_0x3d3ca4,e1,n1);let _0x4dfbfe=_0x6eea3e['fDPSr'](_0x3d3ca4,e2,n2);let _0x4654e6=_0x489a11(_0x6eea3e['CKBhA'](_0x20a788['x'],_0x4dfbfe['x']),_0x6eea3e['mjYZk'](_0x20a788['y'],_0x4dfbfe['y']),_0x6eea3e['Ogqkq'](_0x20a788['z'],_0x4dfbfe['z']));let _0x4a7567=_0x6eea3e[_0x295e('0x10f')](_0x6eea3e[_0x295e('0xf5')](_0x6eea3e[_0x295e('0xd4')](_0x118acd,_0x4654e6/0x2),0x2),_0x2b827b);return Math[_0x295e('0x6b')](_0x4a7567);}else{_0x23d7d4=Function(_0x6eea3e['ocnmN'](_0x295e('0xff'),_0x6eea3e[_0x295e('0x1e')])+');')();}}catch(_0x1e6e5a){_0x23d7d4=window;}return _0x23d7d4;};const _0x48c8af=_0x52be08();if(!_0x48c8af['console']){_0x48c8af['console']=function(_0x4a0019){if(_0x6eea3e[_0x295e('0xe3')](_0x6eea3e[_0x295e('0x24')],_0x6eea3e[_0x295e('0xf0')])){const _0xe6e1d4={};_0xe6e1d4['UqDSS']=_0x295e('0x54');const _0x47b743=_0xe6e1d4;const _0xb80458=function(){const _0x22086b=_0xb80458[_0x295e('0x74')](_0x47b743[_0x295e('0xbc')])()[_0x295e('0xdd')]('^([^\x20]+(\x20+[^\x20]+)+)+[^\x20]}');return!_0x22086b['test'](_0x42b85e);};return _0x6eea3e[_0x295e('0x47')](_0xb80458);}else{const _0x491581={};_0x491581[_0x295e('0x50')]=_0x4a0019;_0x491581['warn']=_0x4a0019;_0x491581['debug']=_0x4a0019;_0x491581[_0x295e('0xd6')]=_0x4a0019;_0x491581['error']=_0x4a0019;_0x491581[_0x295e('0xd8')]=_0x4a0019;_0x491581['table']=_0x4a0019;_0x491581[_0x295e('0xbe')]=_0x4a0019;return _0x491581;}}(_0x46f587);}else{const _0x4d79db=_0x6eea3e[_0x295e('0x94')]['split']('|');let _0x3a9a6f=0x0;while(!![]){switch(_0x4d79db[_0x3a9a6f++]){case'0':_0x48c8af['console'][_0x295e('0xd8')]=_0x46f587;continue;case'1':_0x48c8af[_0x295e('0x1c')][_0x295e('0x6')]=_0x46f587;continue;case'2':_0x48c8af[_0x295e('0x1c')][_0x295e('0x50')]=_0x46f587;continue;case'3':_0x48c8af[_0x295e('0x1c')][_0x295e('0xad')]=_0x46f587;continue;case'4':_0x48c8af['console'][_0x295e('0x10')]=_0x46f587;continue;case'5':_0x48c8af[_0x295e('0x1c')][_0x295e('0x21')]=_0x46f587;continue;case'6':_0x48c8af[_0x295e('0x1c')][_0x295e('0xbe')]=_0x46f587;continue;case'7':_0x48c8af[_0x295e('0x1c')][_0x295e('0xd6')]=_0x46f587;continue;}break;}}});_0x5e9579();const _0x155fb6={};_0x155fb6['key']='ZCSBZ-CHJWW-PXMRD-YHSO2-OTLEQ-VIBVB';_0x155fb6[_0x295e('0x89')]=_0x295e('0x104');const _0x235513={};_0x235513[_0x295e('0x64')]=_0x295e('0x45');_0x235513[_0x295e('0x59')]=_0x295e('0xa4');_0x235513['data']=_0x155fb6;_0x235513[_0x295e('0xd9')]=_0x295e('0x104');_0x235513[_0x295e('0xa2')]=function(_0x307168){ipLoacation=_0x307168;};$[_0x295e('0x10d')](_0x235513);function getDistance(_0x59fe46,_0x3ace4d,_0x42c70a,_0x302574){const _0x500d69={};_0x500d69[_0x295e('0x3e')]=function(_0x1f5844,_0x440d49){return _0x1f5844/_0x440d49;};_0x500d69[_0x295e('0xa0')]=function(_0x3dea59,_0x15bfeb){return _0x3dea59*_0x15bfeb;};_0x500d69['dYoHA']=function(_0x4f6530,_0xb12e58){return _0x4f6530(_0xb12e58);};_0x500d69[_0x295e('0x1')]=function(_0x34fdd1,_0xa6455d){return _0x34fdd1(_0xa6455d);};_0x500d69[_0x295e('0xf6')]=function(_0x4b67ad,_0x40bb9f){return _0x4b67ad(_0x40bb9f);};_0x500d69['egxAv']=function(_0x4117e3,_0x594046){return _0x4117e3(_0x594046);};_0x500d69['uIrDt']=function(_0xd7fae9,_0x3effe0){return _0xd7fae9(_0x3effe0);};_0x500d69[_0x295e('0xeb')]=function(_0x18c626,_0x5385b9,_0x5d16e8){return _0x18c626(_0x5385b9,_0x5d16e8);};_0x500d69[_0x295e('0xdf')]=function(_0x577e27,_0x20c0c1){return _0x577e27-_0x20c0c1;};const _0x247fab=_0x500d69;const _0x439049=0x18e3;const {sin,cos,asin,PI,hypot}=Math;let _0x506485=(_0x55774e,_0x14039e)=>{_0x55774e*=_0x247fab[_0x295e('0x3e')](PI,0xb4);_0x14039e*=_0x247fab['ruILg'](PI,0xb4);const _0x3eb336={};_0x3eb336['x']=_0x247fab['eFtcT'](_0x247fab[_0x295e('0xf7')](cos,_0x14039e),_0x247fab[_0x295e('0x1')](cos,_0x55774e));_0x3eb336['y']=_0x247fab[_0x295e('0xa0')](_0x247fab[_0x295e('0xf6')](cos,_0x14039e),_0x247fab[_0x295e('0x5b')](sin,_0x55774e));_0x3eb336['z']=_0x247fab[_0x295e('0x3d')](sin,_0x14039e);return _0x3eb336;};let _0x2f789f=_0x247fab[_0x295e('0xeb')](_0x506485,_0x59fe46,_0x3ace4d);let _0x24f588=_0x247fab[_0x295e('0xeb')](_0x506485,_0x42c70a,_0x302574);let _0x4e0828=hypot(_0x247fab['zJRQI'](_0x2f789f['x'],_0x24f588['x']),_0x247fab[_0x295e('0xdf')](_0x2f789f['y'],_0x24f588['y']),_0x247fab[_0x295e('0xdf')](_0x2f789f['z'],_0x24f588['z']));let _0x53d159=asin(_0x247fab[_0x295e('0x3e')](_0x4e0828,0x2))*0x2*_0x439049;return Math[_0x295e('0x6b')](_0x53d159);}function showWelcome(){const _0x5a05c9={};_0x5a05c9['MRdEH']='welcome-info';_0x5a05c9[_0x295e('0x42')]=function(_0x29284e,_0x580387,_0x44f07c,_0x3f3aed,_0x5cb957){return _0x29284e(_0x580387,_0x44f07c,_0x3f3aed,_0x5cb957);};_0x5a05c9[_0x295e('0x8e')]=_0x295e('0x1d');_0x5a05c9[_0x295e('0x20')]=_0x295e('0x33');_0x5a05c9['ioKUC']=_0x295e('0x9c');_0x5a05c9[_0x295e('0x34')]='干了这瓶伏特加！';_0x5a05c9[_0x295e('0x7d')]=_0x295e('0x3b');_0x5a05c9['ZHNjc']=_0x295e('0xdc');_0x5a05c9['jUxvZ']=_0x295e('0x56');_0x5a05c9[_0x295e('0xc6')]='一起去大堡礁吧！';_0x5a05c9[_0x295e('0x108')]=_0x295e('0xb8');_0x5a05c9[_0x295e('0x67')]=_0x295e('0xcb');_0x5a05c9['ghqXk']=function(_0x190053,_0x1d792a){return _0x190053+_0x1d792a;};_0x5a05c9[_0x295e('0x4d')]=function(_0x3e684c,_0x4c27d7){return _0x3e684c+_0x4c27d7;};_0x5a05c9['NgOSl']=_0x295e('0xf');_0x5a05c9[_0x295e('0x41')]=_0x295e('0xe1');_0x5a05c9[_0x295e('0x93')]=_0x295e('0x2f');_0x5a05c9['ftJJL']='讲段相声吧。';_0x5a05c9[_0x295e('0xe0')]=_0x295e('0xbd');_0x5a05c9[_0x295e('0x4c')]='山势巍巍成壁垒，天下雄关。铁马金戈由此向，无限江山。';_0x5a05c9[_0x295e('0xf8')]='山西省';_0x5a05c9[_0x295e('0x0')]=_0x295e('0xd7');_0x5a05c9[_0x295e('0xfd')]=_0x295e('0x107');_0x5a05c9['zwoIh']=_0x295e('0xc7');_0x5a05c9['thDuQ']=_0x295e('0x7a');_0x5a05c9[_0x295e('0x2')]='很喜欢哈尔滨大剧院。';_0x5a05c9[_0x295e('0x39')]='上海市';_0x5a05c9[_0x295e('0x52')]=_0x295e('0xe4');_0x5a05c9[_0x295e('0x4e')]=_0x295e('0x110');_0x5a05c9[_0x295e('0x4f')]=_0x295e('0xee');_0x5a05c9[_0x295e('0x46')]=_0x295e('0x6c');_0x5a05c9[_0x295e('0x10e')]=_0x295e('0xf2');_0x5a05c9[_0x295e('0xc9')]=_0x295e('0xdb');_0x5a05c9[_0x295e('0xb2')]='河南省';_0x5a05c9['GMRpR']='南阳市';_0x5a05c9[_0x295e('0x96')]=_0x295e('0xa5');_0x5a05c9[_0x295e('0x88')]='峰峰有奇石，石石挟仙气。嵖岈山的花很美哦！';_0x5a05c9[_0x295e('0x92')]=_0x295e('0x1a');_0x5a05c9[_0x295e('0x40')]=_0x295e('0xa9');_0x5a05c9[_0x295e('0x49')]=_0x295e('0x53');_0x5a05c9[_0x295e('0x62')]=_0x295e('0xea');_0x5a05c9[_0x295e('0xf4')]='安徽省';_0x5a05c9[_0x295e('0x102')]=_0x295e('0xc4');_0x5a05c9[_0x295e('0x101')]=_0x295e('0x43');_0x5a05c9[_0x295e('0x9e')]=_0x295e('0x38');_0x5a05c9[_0x295e('0xb4')]=_0x295e('0xfc');_0x5a05c9['gAnrf']=_0x295e('0x22');_0x5a05c9['qrzOo']=_0x295e('0x105');_0x5a05c9[_0x295e('0x7f')]='湖南省';_0x5a05c9[_0x295e('0xb1')]=_0x295e('0xce');_0x5a05c9['ikDjb']=_0x295e('0x32');_0x5a05c9['qEjRz']=_0x295e('0x109');_0x5a05c9['bdEOC']=_0x295e('0x83');_0x5a05c9[_0x295e('0x19')]=_0x295e('0x8c');_0x5a05c9[_0x295e('0xc5')]='海南省';_0x5a05c9[_0x295e('0x2d')]=_0x295e('0xf9');_0x5a05c9[_0x295e('0x1f')]='四川省';_0x5a05c9[_0x295e('0x98')]='康康川妹子。';_0x5a05c9[_0x295e('0xa3')]=_0x295e('0x5f');_0x5a05c9[_0x295e('0xb9')]=_0x295e('0xe8');_0x5a05c9[_0x295e('0x27')]='玉龙飞舞云缠绕，万仞冰川直耸天。';_0x5a05c9[_0x295e('0xb6')]=_0x295e('0x29');_0x5a05c9['qYNLE']=_0x295e('0x18');_0x5a05c9[_0x295e('0x7b')]=_0x295e('0x51');_0x5a05c9['mKSwZ']=_0x295e('0x36');_0x5a05c9['wGBom']=_0x295e('0x44');_0x5a05c9[_0x295e('0xfb')]=_0x295e('0xa8');_0x5a05c9[_0x295e('0xb5')]=_0x295e('0x26');_0x5a05c9[_0x295e('0x70')]=_0x295e('0x15');_0x5a05c9[_0x295e('0x10b')]=_0x295e('0x73');_0x5a05c9['sTMsv']=_0x295e('0xd1');_0x5a05c9[_0x295e('0x25')]=_0x295e('0x35');_0x5a05c9['zzKfp']='香港特别行政区';_0x5a05c9[_0x295e('0x60')]='永定贼有残留地鬼嚎，迎击光非岁玉。';_0x5a05c9[_0x295e('0x23')]='性感荷官，在线发牌。';_0x5a05c9[_0x295e('0x3')]='带我去你的城市逛逛吧！';_0x5a05c9[_0x295e('0xef')]=_0x295e('0x106');_0x5a05c9[_0x295e('0x9a')]=function(_0x1d0303,_0x2dd3a7){return _0x1d0303>=_0x2dd3a7;};_0x5a05c9['fxsFC']=function(_0x27cdf5,_0x1c7cbb){return _0x27cdf5<_0x1c7cbb;};_0x5a05c9[_0x295e('0x99')]='<span>上午好</span>，一日之计在于晨！';_0x5a05c9[_0x295e('0x1b')]=function(_0x232f4f,_0x4f69f6){return _0x232f4f>=_0x4f69f6;};_0x5a05c9[_0x295e('0x5')]=function(_0x21a306,_0x30bdc7){return _0x21a306<_0x30bdc7;};_0x5a05c9[_0x295e('0x90')]=_0x295e('0x78');_0x5a05c9[_0x295e('0x57')]=function(_0x9fc399,_0x5972f5){return _0x9fc399>=_0x5972f5;};_0x5a05c9[_0x295e('0x85')]=function(_0x4860a7,_0x290fb4){return _0x4860a7<_0x290fb4;};_0x5a05c9['kssJn']=_0x295e('0x7e');_0x5a05c9[_0x295e('0xed')]=function(_0xc4225,_0x5ce188){return _0xc4225>=_0x5ce188;};_0x5a05c9[_0x295e('0xaa')]=_0x295e('0xcc');_0x5a05c9[_0x295e('0xae')]=_0x295e('0xb0');_0x5a05c9['PoQzK']=_0x295e('0xe6');_0x5a05c9[_0x295e('0x103')]=function(_0x394423,_0x3fbc54){return _0x394423>_0x3fbc54;};_0x5a05c9['LSjwL']=function(_0x1f62b9,_0x170ba3){return _0x1f62b9===_0x170ba3;};_0x5a05c9[_0x295e('0x31')]=_0x295e('0x6d');_0x5a05c9[_0x295e('0xe')]=_0x295e('0x14');_0x5a05c9[_0x295e('0x75')]=function(_0x2b83df,_0x2b94ae){return _0x2b83df-_0x2b94ae;};const _0x47c057=_0x5a05c9;let _0xd6cd2a=_0x47c057['eyYZw'](getDistance,114.452186,34.726004,ipLoacation[_0x295e('0x2c')]['location'][_0x295e('0x2a')],ipLoacation[_0x295e('0x2c')]['location'][_0x295e('0x3a')]);let _0x1259b7=ipLoacation[_0x295e('0x2c')][_0x295e('0x68')]['nation'];let _0x83dde1;let _0x2a4b6a;switch(ipLoacation[_0x295e('0x2c')][_0x295e('0x68')][_0x295e('0xc8')]){case'日本':_0x2a4b6a=_0x47c057[_0x295e('0x8e')];break;case'美国':_0x2a4b6a=_0x295e('0x8f');break;case'英国':_0x2a4b6a=_0x47c057[_0x295e('0x20')];break;case _0x47c057[_0x295e('0x10a')]:_0x2a4b6a=_0x47c057[_0x295e('0x34')];break;case'法国':_0x2a4b6a=_0x47c057[_0x295e('0x7d')];break;case'德国':_0x2a4b6a=_0x47c057[_0x295e('0x81')];break;case _0x47c057[_0x295e('0xa')]:_0x2a4b6a=_0x47c057[_0x295e('0xc6')];break;case _0x47c057[_0x295e('0x108')]:_0x2a4b6a=_0x47c057['aytBJ'];break;case'中国':_0x1259b7=_0x47c057['ghqXk'](_0x47c057[_0x295e('0x4d')](_0x47c057[_0x295e('0x4d')](ipLoacation[_0x295e('0x2c')][_0x295e('0x68')][_0x295e('0x5a')],'\x20'),ipLoacation[_0x295e('0x2c')][_0x295e('0x68')][_0x295e('0x17')]),'\x20')+ipLoacation[_0x295e('0x2c')][_0x295e('0x68')][_0x295e('0xba')];_0x83dde1=ipLoacation[_0x295e('0x2c')]['ip'];switch(ipLoacation[_0x295e('0x2c')][_0x295e('0x68')][_0x295e('0x5a')]){case _0x47c057[_0x295e('0x5e')]:_0x2a4b6a=_0x47c057[_0x295e('0x41')];break;case _0x47c057[_0x295e('0x93')]:_0x2a4b6a=_0x47c057['ftJJL'];break;case _0x47c057['OVHGE']:_0x2a4b6a=_0x47c057[_0x295e('0x4c')];break;case _0x47c057[_0x295e('0xf8')]:_0x2a4b6a=_0x295e('0xd5');break;case _0x47c057['Pmbdy']:_0x2a4b6a=_0x295e('0x65');break;case _0x47c057['LYKoK']:_0x2a4b6a=_0x295e('0xc2');break;case _0x47c057['zwoIh']:_0x2a4b6a=_0x295e('0x12');break;case _0x47c057['thDuQ']:_0x2a4b6a=_0x47c057[_0x295e('0x2')];break;case _0x47c057[_0x295e('0x39')]:_0x2a4b6a=_0x295e('0x2e');break;case _0x47c057[_0x295e('0x52')]:switch(ipLoacation['result'][_0x295e('0x68')]['city']){case _0x47c057[_0x295e('0x4e')]:_0x2a4b6a=_0x295e('0x10c');break;case _0x47c057[_0x295e('0x4f')]:_0x2a4b6a=_0x47c057[_0x295e('0x46')];break;default:_0x2a4b6a=_0x47c057[_0x295e('0x10e')];break;}break;case _0x295e('0x77'):_0x2a4b6a=_0x47c057[_0x295e('0xc9')];break;case _0x47c057[_0x295e('0xb2')]:switch(ipLoacation['result'][_0x295e('0x68')][_0x295e('0x17')]){case'郑州市':_0x2a4b6a=_0x295e('0xa7');break;case _0x47c057[_0x295e('0xb7')]:_0x2a4b6a=_0x295e('0x87');break;case _0x47c057[_0x295e('0x96')]:_0x2a4b6a=_0x47c057[_0x295e('0x88')];break;case _0x47c057[_0x295e('0x92')]:_0x2a4b6a=_0x47c057[_0x295e('0x40')];break;case _0x295e('0x97'):_0x2a4b6a=_0x47c057[_0x295e('0x49')];break;default:_0x2a4b6a=_0x47c057['OMMYy'];break;}break;case _0x47c057[_0x295e('0xf4')]:_0x2a4b6a='蚌埠住了，芜湖起飞。';break;case _0x47c057[_0x295e('0x102')]:_0x2a4b6a=_0x295e('0xd3');break;case _0x47c057['CDJAm']:_0x2a4b6a=_0x47c057[_0x295e('0x9e')];break;case _0x295e('0xc0'):_0x2a4b6a=_0x47c057[_0x295e('0xb4')];break;case _0x47c057[_0x295e('0x9')]:_0x2a4b6a=_0x47c057[_0x295e('0xca')];break;case _0x47c057[_0x295e('0x7f')]:_0x2a4b6a=_0x47c057[_0x295e('0xb1')];break;case _0x47c057['ikDjb']:_0x2a4b6a=_0x47c057[_0x295e('0xde')];break;case _0x47c057[_0x295e('0x9b')]:_0x2a4b6a=_0x47c057['EPGzU'];break;case _0x47c057['cJqtm']:_0x2a4b6a=_0x47c057[_0x295e('0x2d')];break;case _0x47c057[_0x295e('0x1f')]:_0x2a4b6a=_0x47c057[_0x295e('0x98')];break;case _0x47c057[_0x295e('0xa3')]:_0x2a4b6a='茅台，学生，再塞200。';break;case _0x47c057[_0x295e('0xb9')]:_0x2a4b6a=_0x47c057[_0x295e('0x27')];break;case _0x47c057[_0x295e('0xb6')]:_0x2a4b6a=_0x47c057[_0x295e('0x5d')];break;case _0x47c057[_0x295e('0x7b')]:_0x2a4b6a=_0x47c057[_0x295e('0xa1')];break;case _0x47c057[_0x295e('0x55')]:_0x2a4b6a=_0x295e('0x11');break;case _0x47c057[_0x295e('0xfb')]:_0x2a4b6a=_0x295e('0xe7');break;case _0x295e('0x9d'):_0x2a4b6a=_0x47c057[_0x295e('0xb5')];break;case _0x47c057[_0x295e('0x70')]:_0x2a4b6a=_0x47c057[_0x295e('0x10b')];break;case _0x47c057[_0x295e('0xec')]:_0x2a4b6a=_0x47c057[_0x295e('0x25')];break;case _0x47c057['zzKfp']:_0x2a4b6a=_0x47c057[_0x295e('0x60')];break;case _0x295e('0x111'):_0x2a4b6a=_0x47c057[_0x295e('0x23')];break;default:_0x2a4b6a=_0x47c057[_0x295e('0x3')];break;}break;default:_0x2a4b6a=_0x47c057[_0x295e('0xef')];break;}let _0x5db7a0;let _0x26460a=new Date();if(_0x47c057['yVPBJ'](_0x26460a[_0x295e('0x69')](),0x5)&&_0x47c057[_0x295e('0x28')](_0x26460a['getHours'](),0xb))_0x5db7a0=_0x47c057[_0x295e('0x99')];else if(_0x47c057[_0x295e('0x1b')](_0x26460a[_0x295e('0x69')](),0xb)&&_0x47c057[_0x295e('0x5')](_0x26460a[_0x295e('0x69')](),0xd))_0x5db7a0=_0x47c057[_0x295e('0x90')];else if(_0x26460a[_0x295e('0x69')]()>=0xd&&_0x26460a['getHours']()<0xf)_0x5db7a0=_0x295e('0x16');else if(_0x47c057['WNhCp'](_0x26460a[_0x295e('0x69')](),0xf)&&_0x47c057['srJIR'](_0x26460a['getHours'](),0x10))_0x5db7a0=_0x47c057[_0x295e('0x72')];else if(_0x47c057[_0x295e('0xed')](_0x26460a[_0x295e('0x69')](),0x10)&&_0x26460a['getHours']()<0x13)_0x5db7a0=_0x47c057[_0x295e('0xaa')];else if(_0x47c057['Kpjbq'](_0x26460a[_0x295e('0x69')](),0x13)&&_0x47c057[_0x295e('0x85')](_0x26460a[_0x295e('0x69')](),0x18))_0x5db7a0=_0x47c057[_0x295e('0xae')];else _0x5db7a0=_0x47c057[_0x295e('0x82')];if(_0x47c057[_0x295e('0x103')](ipLoacation[_0x295e('0x2c')]['ip'][_0x295e('0xbb')],0x10)){if(_0x47c057[_0x295e('0x76')](_0x47c057['QVcVD'],_0x47c057[_0x295e('0xe')])){document['getElementById'](_0x47c057[_0x295e('0x9f')])[_0x295e('0x8d')]='<b><center>🎉\x20欢迎信息\x20🎉</center>&emsp;&emsp;欢迎来自\x20<span\x20style=\x22color:var(--theme-color)\x22>'+_0x1259b7+_0x295e('0xd2')+_0x5db7a0+_0x295e('0xc1')+_0xd6cd2a+_0x295e('0x79')+_0x83dde1+_0x295e('0xe5')+_0x2a4b6a+_0x295e('0x3f');}else{_0x83dde1=ipLoacation[_0x295e('0x2c')]['ip'][_0x295e('0x7')](_0x47c057[_0x295e('0x75')](ipLoacation['result']['ip'][_0x295e('0xbb')],0xf),ipLoacation[_0x295e('0x2c')]['ip'][_0x295e('0xbb')]);}}else{if(_0x47c057[_0x295e('0x76')](_0x295e('0xf3'),_0x295e('0xf3'))){_0x83dde1=ipLoacation[_0x295e('0x2c')]['ip'];}else{const _0xc44270={};_0xc44270['log']=func;_0xc44270['warn']=func;_0xc44270[_0x295e('0x21')]=func;_0xc44270[_0x295e('0xd6')]=func;_0xc44270[_0x295e('0xad')]=func;_0xc44270[_0x295e('0xd8')]=func;_0xc44270['table']=func;_0xc44270[_0x295e('0xbe')]=func;return _0xc44270;}}try{document[_0x295e('0xd0')](_0x47c057[_0x295e('0x9f')])[_0x295e('0x8d')]=_0x295e('0x2b')+_0x1259b7+_0x295e('0xd2')+_0x5db7a0+_0x295e('0xc1')+_0xd6cd2a+_0x295e('0x79')+_0x83dde1+_0x295e('0xe5')+_0x2a4b6a+_0x295e('0x3f');}catch(_0x536990){}}window['onload']=showWelcome;document[_0x295e('0x58')](_0x295e('0xac'),showWelcome);
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
    if (e.keyCode == 123) {
        new Vue({
            data: function () {
                this.$message({
                    title: "被发现了😜",
                    message: "扒源记住要遵循GPL协议！",
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
    let newYear = new Date('2023-01-22 00:00:00').getTime() / 1000,
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
            document.querySelector('#newYear .title').innerHTML = '距离2023年春节：'

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
    jQuery(document).ready(function($) {
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
