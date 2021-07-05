module.exports = {
    isOwner:function(request, response) {
        if (request.user) { // 로그인된 상태면 true
            return true;
        } else { // 아니면 false 
            return false;
        }
    },
    statusUI:function(request, response) {
        var authStatusUI = '<a href="/auth/login">login</a>'
        if (this.isOwner(request, response)) {
            authStatusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`;
        }
        return authStatusUI;
    }
}
