$(document).ready(function()
{
	$(".htw-helper-dialog").hide();	

	var cookie_current_flow_id=read_cookie("flow_id");
	var prev_flowstep_id = "null";

	/****************************************************************************
				Check if cookie exists cookie_flow_id in the url
	****************************************************************************/
	if(cookie_current_flow_id)
		{
		 	htw_show_action_description(cookie_current_flow_id,prev_flowstep_id);	
		}

	else
		{
	/**************************************************************
		Check for cookie_flowID, cookie_flow_id in the url
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

			if(urlParams["cookie_flow_id"])
			{
				htw_show_action_description(urlParams["cookie_flow_id"],function()
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
	document.cookie = name+"="+value+expires+"; path=/";
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


function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=0'
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



function htw_show_action_description(flow_id,prev_flowstep_id)
{
	$.ajax({
			  url 	   :'how-to-ways/get-flow-step/'+ flow_id +'/'+prev_flowstep_id+'/',
			  type 	   :'GET',
			  dataType :'json',
			  success  :function(data)
			  			{
			  				var currentElement='#'+data.identifier;
			  				if($(currentElement).length>0)
			  				{
			  					if(countTimer) 
			  					{
			  						clearInterval(countTimer);
			  					}	
								$(currentElement).css("border","3px solid #FF8000");

								// var htw_html="<div class='htw-action-box'><div class='htw-triangle'></div><div class='htw-action-title'><span>Title : </span>"+data.title+"</div><div class='htw-action-message'><span>Description</span> : "+data.description+"</div></div>";
								var htw_html_both="<div class='htw-action-box-both'><div class='htw-action-header'>How to ways</div><div class='htw-action-title'><span>Title : </span>"+data.title+"</div><div class='htw-action-message'><span>Description</span> : "+data.description+"</br></div></div>";

								var htw_html_right="<div class='htw-action-box-right'><div class='htw-action-header'>How to ways</div><div class='htw-action-title'><span>Title : </span>"+data.title+"</div><div class='htw-action-message'><span>Description</span> : "+data.description+"</br></div></div>";
								
								var htw_html_bottom="<div id='htw_html_bottom' class='htw-action-box-bottom'><div class='htw-action-header'>How to ways</div><div class='htw-action-title'><span>Title : </span>"+data.title+"</div><div class='htw-action-message'><span>Description</span> : "+data.description+"</br></div></div>";

								var htw_html="<div class='htw-action-box'><div class='htw-action-header'>How to ways</div><div class='htw-action-title'><span>Title : </span>"+data.title+"</div><div class='htw-action-message'><span>Description</span> : "+data.description+"</br></div></div>";
								var elementPositionFlag = 0;
								var offset = $(currentElement).offset();
								//alert(document.domain);
								var windowHeight = $(window).height();
								var windowWidth = $(window).width();
								var bottom = windowHeight - offset.top; 
								var right =  windowWidth - offset.left;  
								//alert("element width "+ bottom);
								
								if(right < 600 && bottom < 200)
								{
									elementPositionFlag = 1;
									$(currentElement).before(htw_html_bottom);
									//$("#htw_html_bottom").css({ 'margin-top' : spaceForHtwString});
									//alert(spaceForHtwString);	
								}
								else if (right < 600) 
								{
									elementPositionFlag = 1;
									$(currentElement).before(htw_html_right);
									//alert(spaceForHtwString);
								}
								else if(bottom < 200) 
								{
									elementPositionFlag = 1;
									$(currentElement).before(htw_html_bottom);
									//$("#htw_html_bottom").css({ 'margin-bottom' : spaceForHtwString});
									//alert(spaceForHtwString);
								}
								else
								{
									$(currentElement).after(htw_html);
								}
								$('#triggerCurrentElement').click(function()
									{
										alert(currentElement);
										$(currentElement)[0].click();
										// $(currentElement).trigger( "click" );
									});
								$(currentElement).click(function()
								{
									$(this).css("border","");
									if (elementPositionFlag == 1) 
									{
										$(this).prev().hide();
									}
									else
									{
										$(this).next().hide();
									}
									$(this).off('click');	
									prev_flowstep_id = data.id;
									createCookie("prev_flowstep_id",prev_flowstep_id,"");
									prev_flowstep_id = read_cookie("prev_flowstep_id");
									if(flow_id!="null")
										htw_show_action_description(flow_id,prev_flowstep_id);
									else
										eraseCookie("prev_flowstep_id");
										eraseCookie("flow_id");
								});
			  				}
			  				else
			  				{
			  					
			  					var countTimer = setInterval(function(){ 
			  						
			  						if($(currentElement).length>0) 
			  						{
			  							clearInterval(countTimer);
			  							$(currentElement).css("border","3px solid #FF8000");
										// var htw_html="<div class='htw-action-box'><div class='htw-triangle'></div><div class='htw-action-title'><span>Title : </span>"+data.title+"</div><div class='htw-action-message'><span>Description</span> : "+data.description+"</div></div>";
										var htw_html_both="<div class='htw-action-box-both'><div class='htw-action-header'>How to ways</div><div class='htw-action-title'><span>Title : </span>"+data.title+"</div><div class='htw-action-message'><span>Description</span> : "+data.description+"</div></div>";

										var htw_html_right="<div class='htw-action-box-right'><div class='htw-action-header'>How to ways</div><div class='htw-action-title'><span>Title : </span>"+data.title+"</div><div class='htw-action-message'><span>Description</span> : "+data.description+"</div></div>";
										
										var htw_html_bottom="<div id='htw_html_bottom' class='htw-action-box-bottom'><div class='htw-action-header'>How to ways</div><div class='htw-action-title'><span>Title : </span>"+data.title+"</div><div class='htw-action-message'><span>Description</span> : "+data.description+"</div></div>";

										var htw_html="<div class='htw-action-box'><div class='htw-action-header'>How to ways</div><div class='htw-action-title'><span>Title : </span>"+data.title+"</div><div class='htw-action-message'><span>Description</span> : "+data.description+"</div></div>";
										var elementPositionFlag = 0;
										var offset = $(currentElement).offset();
										//alert(document.domain);
										var windowHeight = $(window).height();
										var windowWidth = $(window).width();
										var bottom = windowHeight - offset.top; 
										var right =  windowWidth - offset.left;  
										//alert("element width "+ bottom);
										
										if(right < 600 && bottom < 200)
										{
											elementPositionFlag = 1;
											$(currentElement).before(htw_html_bottom);
											//$("#htw_html_bottom").css({ 'margin-top' : spaceForHtwString});
											//alert(spaceForHtwString);	
										}
										else if (right < 600) 
										{
											elementPositionFlag = 1;
											$(currentElement).before(htw_html_right);
											//alert(spaceForHtwString);
										}
										else if(bottom < 200) 
										{
											elementPositionFlag = 1;
											$(currentElement).before(htw_html_bottom);
											//$("#htw_html_bottom").css({ 'margin-bottom' : spaceForHtwString});
											//alert(spaceForHtwString);
										}
										else
										{
											$(currentElement).after(htw_html);
										}
										
										$(currentElement).click(function()
										{
											$(this).css("border","");
											if (elementPositionFlag == 1) 
											{
												$(this).prev().hide();
											}
											else
											{
												$(this).next().hide();
											}
											$(this).off('click');	
											prev_flowstep_id = data.id;
											createCookie("prev_flowstep_id",prev_flowstep_id,"");
											prev_flowstep_id = read_cookie("prev_flowstep_id");
											if(flow_id!="null")
											{
												htw_show_action_description(flow_id,prev_flowstep_id);
											}
											else
											{
												eraseCookie("prev_flowstep_id");
												eraseCookie("flow_id");
											}
												
										});
			  						}
			  						else
			  						{

			  						}

			  					}, 3000);
			  				}
			  			}
		  });
}
