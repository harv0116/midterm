
var app = {
  	name: "Midterm App",
  	version: "1.2.3",
	links: [],
	numPages: 0,
	pageTime: 500,
	
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
		
		var options = new ContactFindOptions();
		options.filter = "";
		options.multiple = true;
		var fields = ["displayName"]; 
		navigator.contacts.find(fields, app.successFunc, app.errFunc, options);	
		document.getElementById("btnCancel").addEventListener("click", app.cancel);
    	document.getElementById("btnSave").addEventListener("click", app.save);
		//document.querySelector("[data-role=modal]").style.display="none";
		//document.querySelector("[data-role=overlay]").style.display="none";
			
		
	 
  	},
	successFunc: function( matches ){
		var div = document.getElementById("displaycontact");
		var nameul = document.createElement("ul");
		nameul.setAttribute("data-role","listview");
		
		for (i=0; i<matches.length; i++)
		{	
			console.log("Printing Name");	
			nameul.innerHTML += '<li data-ref="' + i + '">' + matches[i].displayName + '</li>';
		}

		div.appendChild(nameul);
		console.log("Appended");
		document.querySelector("[data-role=listview]").addEventListener("click", app.edit);
   	 	
		 
	},
	errFunc: function ( ) {
		alert("The contact could not be found");
	},
	cancel: function(ev){
		document.querySelector("[data-role=modal]").style.display="none";
		document.querySelector("[data-role=overlay]").style.display="none";
	},
	save: function(ev){
		document.querySelector("[data-role=modal]").style.display="none";
		document.querySelector("[data-role=overlay]").style.display="none";
	},
	edit: function(ev){
		ev.stopPropagation();
		alert("Opening Modal");
		document.querySelector("[data-role=modal]").style.display="block";
		document.querySelector("[data-role=overlay]").style.display="block";
	
		var item = ev.target.getAttribute("data-ref");
		var itemVal = ev.target.innerHTML;
		document.getElementById("list").value = item;
		document.querySelector("[data-role=modal] h3").innerHTML = "Editing " + itemVal;
	}
	

};
app.initialize();


