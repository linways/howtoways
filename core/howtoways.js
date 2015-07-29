$(document).ready(function()
{
	$(".htw-helper-dialog").hide();	

	/*window.onpopstate = function() 
	{
  alert("pop!");

	}*/

	 /*if (window.history && window.history.pushState) 
	 {
	    window.history.pushState('forward', null, './#forward');
	    $(window).on('popstate', function() {
	      eraseCookie("cookie_next_actionID");
	    });
  	}*/			

	var cookie_current_actionID=read_cookie("cookie_next_actionID");

	/****************************************************************************
				Check if cookie exists cookie_flowID, cookie_actionID in the url
	****************************************************************************/
	if(cookie_current_actionID)
		{
		 	htw_show_action_description(cookie_current_actionID);	
		}

	else
		{
	/**************************************************************
		Check for cookie_flowID, cookie_actionID in the url
	***************************************************************/
			var urlParams;
			(window.onpopstate = function () 
			{
			    var match,
			        pl     = /\+/g,  
			        search = /([^&=]+)=?([^&]*)/g,
			        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
			        query  = window.location.search.substring(1);

			    urlParams = {};
			    while (match = search.exec(query))
			       urlParams[decode(match[1])] = decode(match[2]);
			})();

			if(urlParams["cookie_actionID"])
			{
				htw_show_action_description(urlParams["cookie_actionID"],function()
					{
						alert("exec");
						htw_enable();

					});
			}

		}




 
});

function createCookie(name,value,days) 
{
	if (days) 
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toUTCString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+ "; path=/";
}


function read_cookie(cookie_name)
{
	var nameEQ = cookie_name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) 
	{
	    var c = ca[i];
	    while (c.charAt(0)==' ') c = c.substring(1,c.length);
	    	if (c.indexOf(nameEQ) == 0) 
	    		return c.substring(nameEQ.length,c.length);
	}
	return null;
}


function eraseCookie(name) 
{
	createCookie(name,"",-1);
}


function htw_enable(cookie_flowID)
{
	var htw_flag_status;
	if($("#htw-enable-checkbox").is(':checked'))
	{
		htw_flag_status=true;
		console.log(htw_flag_status);
	}
	else
	{
		htw_flag_status=false;
		console.log(htw_flag_status);
	}

	$("#htw-enable-checkbox").change(function(){
		if(htw_flag_status==false)
		{
			htw_flag_status=true;
			htw_show_flow();
		}
		else
		{
			htw_flag_status=false;
			$(".htw-helper-dialog").remove();
		}
	});
}


function htw_show_flow()
{
	$(".htw-helper-dialog").show().slideDown();
	var htw_dialog="<div class='htw-helper-dialog'><div class='htw-helper-dialog-head'>HOW TO WAYS</div><div class='htw-helper-dialog-body'><ul><li class='dialog-null'><li></ul>";
	$("body").after(htw_dialog)	;				

	$.ajax({

		url      :"http://localhost:1337/flowstep",
		type     :"GET",
		dataType :"json",	
		success	 :function(data)
				 {
				 	console.log(data.description);
				 	alert(data.description);

					if(data)
					{	
						var count=Object.keys(data).length;
						if(count>0)
						{
							
							for(var i=0; i<count;i++)
							{
								//console.log(data[0]);
								var j=i+1;
								$(".dialog-null").before(" <li id='htw-flow-"+j+"'>"+data[i].flow_description+"</li>");
							}

							$(".htw-helper-dialog-body ul li").click(function()
							{
								var action_ID=1;
								/*document.cookie="username=;"
								document.cookie="username="+this.id;

								var cookie=document.cookie;
								console.log(cookie);*/

								/*var cookie_flowID=document.cookie(cookie_flowID);
								console.log(cookie_flowID);*/
								htw_show_action_description(this.id,action_ID,data);									

							});
						}
					}

					else
					{
						alert("error");
					}
				 }
		});
}

function htw_show_action_description(actionID)
{
	$.ajax({
			  url 	   :'http://localhost:1337/flowstep/'+actionID,
			  type 	   :'GET',
			  dataType :'json',
			  success  :function(data)
			  			{
			  				var currentElement='#'+data.identifier;
			  				if($(currentElement).length>0)
			  				{	
								
								$(currentElement).css("border","3px solid #456");
								var htw_html="<div class='htw-action-box'><div class='htw-triangle'></div><div class='htw-action-title'><span>Title : </span>"+data.title+"</div><div class='htw-action-message'><span>Description</span> : "+data.description+"</div></div>";

								/*var htw_html="<div class='htw-action-box'><div class='htw-action-header'>help</div><div class='htw-action-title'><span>Title : </span>"+data.title+"</div><div class='htw-action-message'><span>Description</span> : "+data.description+"</div></div>";*/

								$(currentElement).after(htw_html);

								$(currentElement).click(function()
								{
									$(this).css("border","");
									$(this).next().hide();
									$(this).off('click');	

									actionID= data.next_step_id;
									createCookie("cookie_next_actionID",actionID,"");

									if(actionID!="null")
										htw_show_action_description(actionID);

									else
										eraseCookie("cookie_next_actionID");
								});
			  				}
			  			}
		  });
}
