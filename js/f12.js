document.onkeydown = function (e) {
    // 弹出提示vue
    new Vue({
        data: function () {
            this.$message({
                title: "被发现了😜",
                message: "小伙子，扒源记住要遵循GPL协议！",
                position: 'top-left',
                offset: 50,
                showClose: true,
                type: "warning",
                duration: 5000
            });
        }
    })
    if (123 == e.keyCode || (e.ctrlKey && e.shiftKey && (74 === e.keyCode || 73 === e.keyCode || 67 === e.keyCode)) || (e.ctrlKey && 85 === e.keyCode)) return btf.snackbarShow("你真坏，不能打开控制台喔!"), event.keyCode = 0, event.returnValue = !1, !1
};