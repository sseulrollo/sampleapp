(function (exports) {
    'use strict';

    function toast(msg, options) {
        if(!msg) return;
        options = options || 3000;

        var toastMsg = document.querySelector('./toast__msg');
        toastMsg.textContent = msg;
        toastMsg.classList.add("toast__msg--show");

        setTimeout(function() {
            toastMsg.classList.remove("toast__msg--show");
            toastMsg.textContent = "";
        }, options);
    }

    exports.toast = toast;
})(typeof window === 'undefined' ? module.exports : window)