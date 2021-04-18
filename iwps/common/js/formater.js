function getWPNO(str)
{
	// add a space to the second position
	// while when the string length is 9
	// and the second character is not space

	// SIR-55654 - start edited by Croven Phang on 02/06/2003

	var ret = "";
	for (var i=0; i<str.length; i++)
	{
		if (str.charAt(i) != ' ')
		{
			ret += str.charAt(i);
			if (ret.length == 1)
			{
				ret += ' ';
			}
		}
	}
	// SIR-55654 - end edited by Croven Phang on 02/06/2003

/*	if( str.length == 9 )
	{
		if( str.charAt(1) != ' ' )
		{
			ret = str.charAt(0) + ' ' + str.substr(1);
		}
	}
*/
	return ret;
}

function getYear(input)
{
	// get four digit year from two digit
	var ret = input;

	var year = input.valueOf();

	if( year < 50 )
	{
		ret = "20" + year;
	}
	else
	{
		ret = "19" + year;
	}

	return ret;
}

function checkDate(input)
{
	var ret = false;

	// Accept Format
	// 'ddmmyy'
	// 'ddmmyyyy'
	// 'dd/mm/yy'
	// 'dd/mm/yyyy'

	// For Format 'ddmmyy'
	if((input.length == 6) && (!isNaN(input)) )
	{
		ret = true;
	}

	// For Format 'ddmmyyyy'
	if((input.length == 8) && (!isNaN(input)) )
	{
		ret = true;
	}

	// For Format 'dd/mm/yy'
	if((input.length == 8) && isNaN(input) )
	{
		if( (!isNaN( input.substr(0,2) ))
			&& (input.charAt(2) == "/")
			&& (!isNaN( input.substr(3,2) ))
			&& (input.charAt(5) == "/")
			&& (!isNaN( input.substr(6,2) )) )
		{
			ret = true;
		}
	}

	// For Format 'dd/mm/yyyy'
	if((input.length == 10) && isNaN(input) )
	{
		if( (!isNaN( input.substr(0,2) ))
			&& (input.charAt(2) == "/")
			&& (!isNaN( input.substr(3,2) ))
			&& (input.charAt(5) == "/")
			&& (!isNaN( input.substr(6,4) )) )
		{
			ret = true;
		}
	}

	return ret;
}

function getDate(input)
{
	var str = input;
	var ret = str;

	// Add slash to the date string
	// for format ddmmyy
	if( str.length == 6 )
	{
		if( !isNaN(str) )
		{
			var year = str.substr(4, 2);

			ret = str.substr(0, 2) + "/"
				+ str.substr(2, 2) + "/"
				+ getYear(str.substr(4, 2));
		}
	}

	// Add slash to the date string
	// for format ddmmyyyy
	if( str.length == 8 )
	{
		if( !isNaN(str) )
		{
			ret = str.substr(0, 2) + "/"
				+ str.substr(2, 2) + "/"
				+ str.substr(4, 4);
		}
		else if( (str.charAt(2) == "/") && (str.charAt(5) == "/") )
		{
			ret = str.substr(0,6) + getYear(str.substr(6,2));
		}
	}

	return ret;
}

function formatDate(input)
{
	input.value = getDate(input.value);
}

function formatMonthYear(input)
{
	input.value = getMonthYear(input.value);
}

function getMonthYear(input)
{
	var str = input;
	var ret = str;


		
	// Add slash to the date string
	// for format mmyy
	if( str.length == 4 )
	{
		if( !isNaN(str) )
		{
			var year = str.substr(2, 4);

			ret = str.substr(0, 2) + "/"				
				+ getYear(str.substr(2, 4));
		}
	}
	
	// for format mmyyyy
	if( str.length == 6 )
	{
		if( !isNaN(str) )
		{
			ret = str.substr(0, 2) + "/"
				+ str.substr(2, 6);
		}
	}
	
	return ret;
}

function formatWPNO(input)
{
	 
	 //sir774 start	
	 //if(self.event.keyCode==13)
     //{
		input.value = getWPNO(input.value);

	 //}
}

function splitWPNO_DOA(wpField, doaFieldName)
{
	var str = wpField.value;
	var wpno = str;

	if( wpno.length >= 15 )
	{
		var date = "";

		if( wpno.charAt(1) != " " )
		{
			wpno = str.substr(0, 9);
			date = str.substr(9);
		}
		else
		{
			wpno = str.substr(0,10);
			date = str.substr(10);
		}

		if( checkDate(date) == true )
		{
			if( !doaFieldName == "" )
			{
				wpField.form.elements[doaFieldName].value = getDate(date);
			}
		}
		else
		{
			wpno = str;
			date = "";
		}
	}

	wpField.value = getWPNO(wpno);
}

function getElementByName(elementName)
{
	var myForm = document.forms[0];
	for (var i = 0;i<myForm.elements.length;i++)
	{
		var myElement = myForm.elements[i];
		if (myElement.name.indexOf(elementName)!=-1)
		{
			return myElement;
		}
	}
	//alert(elementName+' is null');
	return null; //can't find element with the name=elementName
}

function isEnterKey(evt) {
	if (!evt) {
	// grab IE event object
		evt = window.event
	} else if (!evt.keyCode) {
	// grab NN4 event info
		evt.keyCode = evt.which
	}
	return (evt.keyCode == 13)
}

function split(obj, doaName)
{
	var formName = obj.form.name;
	var doaFieldName = getElementByName(doaName);
	var str = obj.value;
	var wpno = str;
	var split = false;

	if( wpno.length >= 15 )
	{
		var date = "";

		if( wpno.charAt(1) != " " )
		{
			wpno = str.substr(0, 9);
			date = str.substr(9);
		}
		else
		{
			wpno = str.substr(0,10);
			date = str.substr(10);
		}

		if( checkDate(date) == true )
		{
			if( !doaName == "" )
			{
				doaFieldName.value = getDate(date);

				//document.forms[formName].elements[doaFieldName].value = getDate(date);
				split = true;
			}
		}
		else
		{
			wpno = str;
			date = "";
		}
	}

	obj.value = getWPNO(wpno);

	return split;
}

function processWPDOA(obj, doaName, btnName)
{

	if(obj.value == "")
	{
		return;
	}

	if( btnName == "" )
	{
		// No button
		if( doaName == "" )
		{
			// only need to format WPNO
			formatWPNO(obj);
		}
		else
		{
			// Have DOA
			split(obj,doaName);
		}
	}
	else
	{
		// Need to split WPNO and DOA and trigger button
		if( doaName == "" )
		{
			// only need to format WPNO
			return formatWPNO(obj);
		}
		else
		{
			// Have DOA
			if( split(obj,doaName) )
			{
				// Have DOA and split success

				// trigger button
				var btnFieldName = getElementByName(btnName);

	//			btnFieldName.focus();
				btnFieldName.click();
			}
		}
	}

	return;
}

function divertTo(actionVal)
{
	if(self.event.keyCode != 13)
	return
	var form;
	var target;
	   for(var i=0;i<document.forms.length;i++)
	    {
	      tempname=new String(document.forms[i].name);
	      if (tempname.indexOf("FIFORM")!=-1)
	      {
		form=document.forms[i];
		break;
	      }
	    }  
	form.action.value = actionVal;
	form.submit();
}

function handleKeydown()
{
	//disable Enter key
	if(self.event.keyCode==13)
	{
		event.returnValue = false;
	}

}
