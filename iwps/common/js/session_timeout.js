//----------------Variables should be set in templates----------------//
//set in script.jsp
var SESSION_LIFETIME;
var appRoot = "";
var MSGTIMEOUT = "";
var MSGLOGOUT = "";
var GDCFlag = "";
var SESSION_BUFFER;
var Begin=new Date(); 
var userid = "";

//The url to logout action, defaulted to front end logout action
//set in admintemplate.jsp
var logOffUrl = "";
var sessionRedirectUrl = "/common/jsp/SessionRedirect.jsp";
//----------------End of Variables should be set in templates---------//

//----------------Internal Variables Used Here only  ----------------//
var timerid = 0;
var btimerid = false;

var img = new Image(); //for refreshes
var pageLoaded = false; //for marking the page is loaded in onload event
//----------------End of Internal Variables -------------------------//

//startTimer(): Start the timer to check user session timeout
//It is invoked in DefaultLayout.jsp, in onload event
function startTimerH(timer){
   pageLoaded = true;
    Begin=new Date();
    timerid = window.setTimeout('alertTimeout()', timer);
    btimerid = true;
}

// alertTimeout(): "Keep Alive" function to check for session inactivity
// parameters:  none
// return:  none
// comment: this runs regularly in background to check for session inactivity
// uses many functions above
function alertTimeout()
{
    Begin = new Date();
    var bchoice = false;
	var newResetTime = 0;

	if (userid.length > 0){
		timeDiff = getTimeDiffSession(userid);
		newResetTime = (timeDiff > 0) ? ((SESSION_LIFETIME * 1000) - ((SESSION_BUFFER*1000) + timeDiff)) : 0 ;
	}

	if (newResetTime <= 0){
		self.focus();
		bchoice = confirm(MSGTIMEOUT);  

		if ( ( gettimediff(Begin) < ( (SESSION_BUFFER*1000) - 5000) ) && bchoice)
		{
		   dorefresh();
		   clrsettimeout();
		}
		else
		{
			 if(bchoice){
			   alert(MSGLOGOUT);
			 top.location=sessionRedirectUrl;
			}
			if(!bchoice){
			  dosignoff();
			}
		}
	} else {
		startTimerH(newResetTime);
	}

}

// returns diff in 2 times, 1 passed in & 1 now
function gettimediff(begin)
{
    var end = new Date();
    return end.getTime() - begin.getTime();
}

function dorefresh(){

	if (userid.length > 0){
		setCookieSession(userid,SESSION_LIFETIME);	
	}

    img.src = appRoot + '/common/jsp/refresh.jsp';	
}

function clrsettimeout()
{

    if (btimerid) {
        stopTimer();
    }
    startTimerH((SESSION_LIFETIME - SESSION_BUFFER)*1000);
}

function stopTimer(){
    if (btimerid) {
        clearTimeout(timerid); 
    }
    btimerid = false;
}

function dosignoff(){
	
	  if (btimerid){
        stopTimer();
    }

    window.top.location = logOffUrl;
}
