function resizeIframe(obj) {
    obj.style.height = 0;

    if (obj.contentWindow.document.documentElement.scrollHeight < 670) {
        obj.style.height = '670px';
    } else {
        obj.style.height = (+obj.contentWindow.document.documentElement.scrollHeight + 50) + 'px';
    }

    var frameBody = document.getElementById("appFrame").contentDocument;
    frameBody.head.innerHTML = frameBody.head.innerHTML + '<style>html,body{overflow-y:hidden;}</style>';
}

// WebEngage
function rateThisService() {
    var webFunction = document.getElementById("appFrame").contentWindow.window['getWebEngageFeedback'];

    if (webFunction) {
        document.getElementById("appFrame").contentWindow.getWebEngageFeedback();
    }
}

// Footer Year
var getCurrentYear = new Date();
if (document.getElementById('currentYear')) {
    document.getElementById('currentYear').innerHTML = getCurrentYear.getFullYear();
}