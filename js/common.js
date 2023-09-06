function SetLanguage(lang) {
    $.ajax({
        type: "post",
        url: "/Auth/SetLanguage",
        contentType: "application/json",
        data: JSON.stringify({ lang: lang }),
        success: function (result) {
            if (result.Result == true) {
                location.reload();
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert(xhr.responseText);
        }
    });
}

function SetInuputEnter(input, callback) {

    $(input).keydown(function (event) {
        if (event.keyCode == 13) {
            callback();
        }
    });
}

function GetPagingMax(totalCount, pageSize) {
    return  Math.floor(totalCount / pageSize) + (totalCount % pageSize === 0 ? 0 : 1);
}

var SnsManager = {
    _defaults: {
        text: '',
        url: '',
        tag: ['DragonNest'],
        via: '',
        callTwitter: false,//'SnsManager.twitter.receive',
        callFacebook: false//'SnsManager.facebook.receive'
    },
    data: null,
    init: function (options) {
        SnsManager.data = $.extend({}, SnsManager._defaults, options || {});
        if (SnsManager.data.callTwitter) {
            var data = {
                url: SnsManager.data.url,
                callback: SnsManager.data.callTwitter
            };
            pwp.util.callJsonP('http://urls.api.twitter.com/1/urls/count.json?' + $.param(data));
        };
        if (SnsManager.data.callFacebook) {
            var data = {
                ids: SnsManager.data.url,
                callback: SnsManager.data.callFacebook
            };
            pwp.util.callJsonP('https://graph.facebook.com/?' + $.param(data));
        };
        $('.ui-share-label-url').html(SnsManager.data.url);
        $('.ui-share-btn-copy').on('click', SnsManager.copy);
        $('.ui-share-btn-googleplus').on('click', SnsManager.googleplus.share);
        $('.ui-share-btn-facebook').on('click', SnsManager.facebook.share);
        $('.ui-share-btn-twitter').on('click', SnsManager.twitter.share);
    },
    share: function (url, data) {
        var params = $.param(data);
        var win = window.open(url + '?' + params, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=550,height=450');
        win.focus();
        return false;
    },
    twitter: {
        share: function () {
            var data = SnsManager.data;
            if (data) {
                var str = '';
                for (var i in data.tag) {
                    str += (i > 0 ? ',' : '') + data.tag[i].replace(/\s/gi, '');
                };
                var data = {
                    lang: 'ko',
                    url: data.url,
                    hashtags: str,
                    text: data.text,
                    via: data.via
                };
                SnsManager.share('https://twitter.com/share', data);
            };
            return false;
        },
        receive: function (data) {
            if (data.count) {
            } else {
            };
        }
    },
    facebook: {
        share: function () {
            var data = SnsManager.data;
            if (data) {
                var data = {
                    u: data.url
                };
                SnsManager.share('http://www.facebook.com/sharer.php', data);
            };
            return false;
        },
        receive: function (data) {
            if (!data.error && data[data.url].shares) {
            } else {
            };
        }
    },
    googleplus: {
        share: function (options) {
            var data = SnsManager.data;
            if (data) {
                var data = {
                    url: data.url
                };
                SnsManager.share('https://plus.google.com/share', data);
            };
            return false;
        }
    },
    copy: function () {
        if (copyClipboard(SnsManager.data.url)) {
            var msg = msg || '';
            alert(msg + 'Please Paste as \ nCtrl + V.');
        };
    }
};

function copyClipboard(clipboard, msg) {
    var IE = (document.all) ? true : false;
    if (IE) {
        window.clipboardData.setData('Text', clipboard);
        if (window.clipboardData.getData('Text') == clipboard) {
            return true;
        };
    };
    var tmp = prompt((msg ? msg + '\n' : '') + 'Please press Ctrl + C then Ctrl + V to copy paste.\n\n', clipboard);
    return false;
    if (window.clipboardData) {
        window.clipboardData.setData('Text', clipboard);
        return true;
    } else if (window.netscape) {
        try {
            netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
            var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
            if (!clip) return;
            var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
            if (!trans) return;
            trans.addDataFlavor('text/unicode');
            var str = new Object();
            var len = new Object();
            var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
            var copytext = clipboard;
            str.data = copytext;
            trans.setTransferData("text/unicode", str, copytext.length * 2);
            var clipid = Components.interfaces.nsIClipboard;
            if (!clip) return false;
            clip.setData(trans, null, clipid.kGlobalClipboard);
            return true;
        }
        catch (e) {
            alert('Not allow the copy function.\n\nin the address bar \"about:config\" after input\n\"signed.applets.codebase_principal_support\" settings \n\"true\" please change the value.');
            return false;
        };
    };
    alert('Not allow the copy function');
    return false;
};

function checkKeyword(obj) {
    var keyword = obj.value;
    var len = keyword.length;
    if (len < 2) {
        alert('2자 이상의 검색어를 입력하세요.');
        obj.focus();
        return false;
    };
    var disabledKeywords = 'about;after;all;also;an;and;another;any;are;as;at;be;because;been;before;being;between;both;but;by;came;can;come;could;did;do;each;for;from;get;got;has;had;he;have;her;here;him;himself;his;how;if;in;into;is;it;like;make;many;me;might;more;most;much;must;my;never;now;of;on;only;or;other;our;out;over;said;same;see;should;since;some;still;such;take;than;that;the;their;them;then;there;these;they;this;those;through;to;too;under;up;very;was;way;we;well;were;what;where;which;while;who;with;would;you;your;';
    if (disabledKeywords.indexOf(keyword + ';') >= 0) {
        alert('검색 가능한 단어가 아닙니다.\n다른 문자열로 검색해 주세요.');
        obj.focus();
        return false;
    };
    var reg = /[^0-9a-zA-Z가-힣ㄱ-ㅎ\s]/;
    for (var i = 0; i < len; i++) {
        var chr = keyword.charAt(i);
        if (chr.search(reg) != -1) {
            alert('특수문자를 입력할 수 없습니다.\n다른 문자열로 검색해 주세요.');
            obj.focus();
            return false;
            break;
        };
    };
    return true;
};

function is_valid_date(date_str) {
    var yyyyMMdd = String(date_str);
    var year = yyyyMMdd.substring(0, 4);
    var month = yyyyMMdd.substring(4, 6);
    var day = yyyyMMdd.substring(6, 8);

    if (date_str.length != 8)
        return false;

    if (Number(month) > 12 || Number(month) < 1)
        return false;

    if (Number(last_day(date_str)) < day)
        return false;

    return true;
}

function last_day(date_str) {
    var yyyyMMdd = String(date_str);
    var days = "31";
    var year = yyyyMMdd.substring(0, 4);
    var month = yyyyMMdd.substring(4, 6);

    if (Number(month) == 2) {
        if (is_leap_year(year + month + "01"))
            days = "29";
        else
            days = "28";
    }
    else if (Number(month) == 4 || Number(month) == 6 || Number(month) == 9 || Number(month) == 11)
        days = "30";

    return days;
}

function is_leap_year(date_str) {
    var year = date_str.substring(0, 4);
    if (year % 4 == 0) {
        if (year % 100 == 0)
            return (year % 400 == 0);
        else
            return true;
    }
    else
        return false;
}

(function ($) {
    // Cross Browsing
    $.browser = {
        ua: navigator.userAgent.toLowerCase(),
        mozilla: /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase()),
        webkit: /webkit/.test(navigator.userAgent.toLowerCase()),
        opera: /opera/.test(navigator.userAgent.toLowerCase()),
        msie: /msie/.test(navigator.userAgent.toLowerCase()),
        chrome: /chrome/.test(navigator.userAgent.toLowerCase()),
        isMobile: /mobi|iphone|ipad|android|windows ce|blackberry|symbian|windows phone|webos|opera mini|opera mobi|polaris|iemobile|lgtelecom|nokia|sonyericsson/i.test(navigator.userAgent.toLowerCase()) || /LG|SAMSUNG|Samsung/i.test(navigator.userAgent.toLowerCase())
    };
})(jQuery);

// Cookie
function setCookie(name, value, expiredays) {
    var todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";";
}

function getCookie(name) {
    var nameOfCookie = name + "=";
    var x = 0;
    while (x <= document.cookie.length) {
        var y = (x + nameOfCookie.length);
        if (document.cookie.substring(x, y) == nameOfCookie) {
            if ((endOfCookie = document.cookie.indexOf(";", y)) == -1)
                endOfCookie = document.cookie.length;
            return unescape(document.cookie.substring(y, endOfCookie));
        }
        x = document.cookie.indexOf(" ", x) + 1;
        if (x == 0) break;
    }
    return "";
}

// Form
function createForm(n, m, a, t) {
    var f = document.createElement('form');
    f.setAttribute('name', n);
    f.setAttribute('method', m);
    f.setAttribute('action', a);
    if (t) f.setAttribute('target', t);
    document.body.appendChild(f);
    return f;
};
function addHiddenField(f, n, v) {
    var i = document.createElement('input');
    i.setAttribute('type', 'hidden');
    i.setAttribute('name', n);
    i.setAttribute('value', v);
    f.appendChild(i);
    return f;
};