
// constants

var winSessionCookie = "ea.windowBasedSession.WinID";
var winResetCookie = "ea.windowBasedSession.WinIDReset";

//alert("parent.winid = " + parent.winid);
// set event handlers 

// cookie functions

function setCookie(name, value, expires, path, domain, secure) {
	deleteCookie(name);
 
 var curCookie = name + "=" + escape(value) +
	((expires) ? ";expires=" + expires.toGMTString() : "") +
	((path) ? ";path=" + path : "") +
	((domain) ? ";domain=" + domain : "") +
	((secure) ? ";secure" : "");
      
	document.cookie = curCookie;
}

function getCookie(name) {
	if(document.cookie) {
		var arr = document.cookie.split((escape(name) + '='));
        
		if(2 <= arr.length) {
			var val;
			var arr2 = arr[arr.length-1].split(';');
			val = unescape(arr2[0]);
			return val;
        	}
  	}
  	return null;
}

function getRequestParam(name) {
		var arr = document.location.search.split((escape(name) + '='));
		if(2 <= arr.length) {
			var val;
			var arr2 = arr[arr.length-1].split('&');
			val = unescape(arr2[0]);
			return val;
        	}
        	return null;
}

function deleteCookie(name, path, domain) {
	if (getCookie(name)) {
		document.cookie = name + "=" +
		((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "") +
		"; expires=Thu, 01-Jan-1970 00:00:01 GMT";
	}
}

// form functions

function createField( fieldType, fieldName, fieldValue ) {
	if(document.getElementById) { // IE5 / NN6
		var input = document.createElement('INPUT');
		input.type = fieldType;
		input.name = fieldName;
		input.value = fieldValue;
		return input;
	}
	return null;
}

function addField( form, field) {
	form.appendChild(field);
}

var formComplete = false;


function iwpsOnFocus() {
	if(!formComplete) {
	    formComplete = true;
	    if(window.document.forms) {
	    	var input = createField( 'hidden', 'ea.windowBasedSession.WinID', winid );
	    	for( var i = 0; i < window.document.forms.length; i++ ) {
	    		// add hidden field dynamically to each form
	    		addField( window.document.forms[i], input );
	    	}
	    }
	    var suffix = " (" + winid + " - " + " - " + window.self.name + ")";
	    var prefix = window.top.document.title;
	    if( prefix.indexOf(suffix) < 0 ) {
	    	window.top.document.title = prefix + " " + suffix;
	    }
	}
	var cookie_value = winid == null ? "" : winid;
	if( cookie_value != getCookie(winSessionCookie) ) {
	    setCookie(winSessionCookie, cookie_value, null, "/");	
	}
	
}

function iwpsWindowOpen(useLocalSession, url, name, features, replace) {
    var newsessionid = "";
    var windowname = window.self.name;
 
     var newwinid;
     var domain = null;
     var host = document.location.hostname;


    if( useLocalSession ) { 
    	// assign new session identifier
    	//newsessionid = name + "-" + new Number(new Date().getTime()).toString(36) + Math.floor(Math.random()*1000).toString(36) ;
		// DR532269 - use the same session across multiple windows	
		newsessionid = winid;
    } else {
        // inherit parent session identifier\
        newsessionid = winid;
    }
     
      if( host.search(/\b(?:\d{1,3}\.){3}\d{1,3}\b/) >= 0 && host.indexOf("127.0.0.1") < 0) {
	    var str = "Use of IP address ("+ host +") is not supported/recommended. Please use hostname instead.\n";
        str = str + "If you experience technical difficulties, please contact network administrator.";
    	alert(str);
    	
    } else if( host.indexOf("127.0.0.1") >=0 || (host.indexOf("localhost") >=0 && host.indexOf("localhost.") < 0) ) {
     	var str="Warning: In order to use a new application feature use of \'localhost\' is not recommended.\n\n";
     	str = str + "*Effective immediately* Please add the following entries to your hosts file, \'C:\\WINNT\\system32\\drivers\\etc\\hosts\':\n";
     	str = str + "     127.0.0.1      localhost.iwps\n";
     	str = str + "     127.0.0.1      subdomain.localhost.iwps\n";
     	str = str + "Use \'localhost.iwps\' instead of \'localhost\'.\n";
     	alert(str);
     	
     } else if(useLocalSession && url.indexOf("://") < 0) {
 		
		// DR532269 - Remove subdomain
		/*
		var subdomain = iwpsPopupWindowSubdomain;
 		if( subdomain == "" ) {
 			alert("Warning: Subdomain is not configured.\n\n");
 			subdomain = "subdomain";
 		}
 		domain = subdomain + "." + host;		
		*/		
		domain = host;
    	url = "http://"+domain+ ":" + document.location.port + (url.charAt(0)!='/'?'/':"") + url;
    }

    //setCookie(winSessionCookie, newsessionid, null, "/");	
     url = url + (url.indexOf("?") >= 0 ? "&" : "?") + winSessionCookie + "=" + newsessionid;

    var newwin;
        
    if(replace) {
        newwin = window.open(url, name, features, replace);
    } else if(features) {
        newwin = window.open(url, name, features);
    } else if(name) {
        newwin = window.open(url, name);
    } else {
        newwin = window.open(url);
    }
    
    if( !useLocalSession ) {
    	// associate dependant windows
        childWindows[childWindows.length] = newwin;
    }
    
    if( useLocalSession ) { //&& (winid == null || winid.length == 0) ) {
	var mainwin = getMainWindowHandle();
        mainwin.childWindows[mainwin.childWindows.length] = newwin;
    }

    return newwin;
}

function getMainWindowHandle() {
	var nextwin = window.self;
	var win;
	var mainwin;
	do {
		
		win = nextwin;
		if(win.childWindows) {
			mainwin = win;
		}
		
		if( win.opener && win != win.opener ) {
			nextwin = win.opener;
		} else if( win.parent && win != win.parent ) {
			nextwin = win.parent;			
		} else if( win.top && win != win.top ) {
			nextwin = win.top;
		} else {
			nextwin = null;
		}
		
	} while( nextwin != null );
	return mainwin;
}

function closeChildWindows() {
	// close dependant windows
	for(var i = 0; i < this.childWindows.length; i++) {
		if( this.childWindows[i] && !this.childWindows[i].closed ) this.childWindows[i].close();
	}   
	childWindows = new Array();
}


var childWindows = new Array();

// cache the winid

var winid = getRequestParam(winSessionCookie);

if(winid == null ) {
   winid = getCookie(winResetCookie);
}
if(winid == null) {
   winid = "";
}
window.onfocus = iwpsOnFocus;
window.onclose = closeChildWindows;
window.onunload = closeChildWindows;
