// values should match default values contained in PopUpDecorator.java
var Xoffset=0;
var Yoffset=10;
var width=200;

var content1="<TABLE WIDTH='"+width+"' BORDER='1' HEIGHT='";
var content2="' BORDERCOLOR='black' CELLPADDING='2' CELLSPACING='0' BGCOLOR='";
var content3="'><TD ALIGN='left'><FONT face='Verdana, Arial, Helvetica, sans-serif' COLOR='black' SIZE='2'><b>";
var content4="</b></FONT></TD></TABLE>";

var decorator = window.createPopup();
var is = null;
var nav = false;
var old = false;
var yyy = -1000;
var iex = null;
var skn = null;

function startPopupDecorator()
{
	is = new Is();
	iex = document.all;
	if(navigator.appName=='Netscape')
	{
		(document.layers) ? nav = true : old = true;
	}
	
	if(!old)
	{
		skn=(nav) ? ((null != document.dek) ? document.dek : null) : ((null != dek.style) ? dek.style : null);
		if (nav)
		{
			document.captureEvents(Event.MOUSEMOVE);
		}

		document.onmousemove = get_mouse;
	}
}

function popup(msg,bak)
{
	startPopupDecorator();
	var heightIncrement = 16;
	var msgArray = msg.split(' ');
	var tempStr = '';
	var countLine = 0;
	var content = "";
	var height = 24;

	for (i=0; i<msgArray.length; i++)
	{
		tempStr += msgArray[i];
		if(tempStr.length>24)
		{
			countLine+=1;
			tempStr = '';
		}
		tempStr += ' ';
	}
	
	height += (heightIncrement * (countLine+1));
	content = content1 + height + content2 + bak + content3 + msg + content4;

	if(old)
	{
		alert(msg);
		return;
	}
	else
	{
		yyy=Yoffset;
		if (nav)
		{
			skn.document.write(content);skn.document.close();skn.visibility="visible"
		}
		
		if (iex)
		{
			document.all.dek.innerHTML=content;
			if (!(skn.left=='' || skn.top==''))
			{
				decorator.document.body.innerHTML = document.all.dek.outerHTML; decorator.show(parseInt(skn.left), parseInt(skn.top), width, height, document.body);
			}
			else
			{
				get_mouse();
				popup(msg,bak);
			}
		}
	}
}

function get_mouse(e)
{
	var x = (nav) ? e.pageX:event.x;
	var xpopup= x + Xoffset;
	var xdiff = xpopup + 200 - ((nav) ? window.innerWidth : document.body.clientWidth);

	if(xdiff>0)
	{
		skn.left=xpopup-xdiff;
	}
	else
	{
		skn.left=xpopup;
	}
	var y= (nav) ? e.pageY : event.clientY;
	skn.top = y + yyy;
}

function kill()
{
	if(!old)
	{
		decorator.hide();
	}
}

function Is()
{
	var agent = navigator.userAgent.toLowerCase();
	this.major = parseInt(navigator.appVersion);
	this.minor = parseFloat(navigator.appVersion)
	this.ns = ((agent.indexOf('mozilla')!=-1) && ((agent.indexOf('spoofer')==-1) && (agent.indexOf('compatible')== -1)));
	this.ns4 = (this.ns && (this.major >= 4));
	this.ie = (agent.indexOf("msie") != -1);
	this.ie4 = (this.ie && (this.major >= 4));
}

//Show the layers
function showIt(layer)
{
	if (is.ns4 && document.layers[layer]==null)
	{
		return;
	}
	else if (is.ie4 && document.all[layer]==null)
	{
		return;
	}
	if(is.ns4)
	{
		document.layers[layer].visibility="show";
	}
	else if (is.ie4)
	{
		document.all[layer].style.visibility="visible";
	}
}

//hide layer
function hideIt(layer)
{
	if(is.ns4 && document.layers[layer]==null)
	{
		return;
	}
	else if (is.ie4&&document.all[layer]==null)
	{
		return;
	}
	
	if(is.ns4)
	{
		document.layers[layer].visibility="hide";
	}
	else if (is.ie4)
	{
		document.all[layer].style.visibility="hidden";
	}
}

function handleSubmit()
{
	window.focus();
	return true;
}