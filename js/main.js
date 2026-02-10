/**
 * 优化后的加载脚本函数
 * @param {string} src - 脚本路径
 * @param {boolean} defer - 是否延迟 (在动态脚本中主要靠 async=false 模拟)
 * @param {boolean} async - 是否异步 (设为 false 可保证按顺序执行)
 * @param {string|null} autoReplaceSvg - 特殊属性
 * @param {string} root - 根路径
 */
function loadScript(src, defer, async, autoReplaceSvg, root = "/") {
    const script = document.createElement('script');

    // 修复路径拼接问题：移除 src 开头的 / 以避免与 root 的 / 重复
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;

    // 处理 root 结尾是否带 / 的情况，确保拼接正确
    const cleanRoot = root.endsWith('/') ? root : root + '/';

    script.src = cleanRoot + cleanSrc;

    script.defer = defer;
    script.async = async; // 注意：动态脚本设为 async=false 才能保证按插入顺序执行

    if (autoReplaceSvg) {
        script.dataset.autoReplaceSvg = autoReplaceSvg;
    }

    // 添加错误处理（可选，但推荐）
    script.onerror = function () {
        console.error('Failed to load script:', script.src);
    };

    document.head.appendChild(script);
}

// 立即执行函数处理页面淡入
(function () {
    // 设置兜底定时器（防止 load 事件一直不触发）
    const timeout = setTimeout(function () {
        document.body.style.opacity = 1;
    }, 1000);

    // 使用 addEventListener 代替 window.onload 防止覆盖其他脚本
    window.addEventListener('load', function () {
        clearTimeout(timeout);
        document.body.style.opacity = 1;
    });
})();

document.addEventListener('DOMContentLoaded', function () {
    // 注意：这里的路径保留原样，loadScript 函数内部会自动处理斜杠
    loadScript("/js/fontawesome.js", false, true, "nest");

    // 下面这组脚本 async 为 false，会按代码顺序依次执行
    loadScript("/js/header.js", true, false);
    loadScript("/js/footer.js", true, false);
    loadScript("/js/pagination.js", true, false);
    loadScript("/js/team.js", true, false);
    loadScript("/js/search.js", true, false);
});

console.log("main.js loaded");