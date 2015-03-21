
var app = {
  	name: "Midterm App",
  	version: "1.2.3",
	links: [],
	numPages: 0,
	pageTime: 500,
	listview: document.querySelector("[data-role=listview]"),
  	mc: null,
	
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
		var fields = ["displayName", "phoneNumbers"]; 
		navigator.contacts.find(fields, app.successFunc, app.errFunc, options);	
		
    	document.getElementById("btnOK").addEventListener("click", app.ok);
	 
  	},
	
	
  	addListeners: function(){

	},
	
	successFunc: function( matches ){
		var div = document.getElementById("displaycontact");
		var nameul = document.createElement("ul");
		var phone1 = '';
		var phone2 = '';
		nameul.setAttribute("data-role","listview");
		var session = {
			'contact' :[],
			'state'	: true
		};
		
		for (i=0; i<matches.length; i++)
		{	
			console.log("Printing Name");
			nameul.innerHTML += '<li data-ref="' + i + '">' + matches[i].displayName + '</li>';
			
			for (var j=0; j<matches[i].phoneNumbers.length; j++) 
			{
				if (j==0) {
					phone1 = matches[i].phoneNumbers[j].value;
				} else {
 					phone2 = matches[i].phoneNumbers[j].value;
				}
			}
			

			session.contact.push({ 'name': matches[i].displayName, 
								   'phone1': phone1,
								   'phone2': phone2,
								   'lat': '', 'long': '' });
	
		}

		div.appendChild(nameul);
		localStorage.setItem('session-harv0116', JSON.stringify(session));
		
		
		// HAMMER TIME
		
		
		app.mc = new Hammer(app.listview);
		
		mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );
			// Single tap recognizer
		mc.add( new Hammer.Tap({ event: 'singletap' }) );
		
		mc.get('doubletap').recognizeWith('singletap');
			// we only want to trigger a tap, when we don't have detected a doubletap
		mc.get('singletap').requireFailure('doubletap');
		
		
    	app.mc.on('singletap', app.view);
		app.mc.on('doubletap', app.map);
		
		//document.querySelector("[data-role=listview]").addEventListener("click", app.view);
   	 	
		 
	},
	errFunc: function ( ) {
		alert("The contact could not be found");
	},
	ok: function(ev){
		document.querySelector("[data-role=modal]").style.display="none";
		document.querySelector("[data-role=overlay]").style.display="none";
	},
	view: function(ev){
		ev.stopPropagation();
		document.querySelector("[data-role=modal]").style.display="block";
		document.querySelector("[data-role=overlay]").style.display="block";
	
		var item = ev.target.getAttribute("data-ref");
		//var itemVal = ev.target.innerHTML;
		//document.getElementById("list").value = item;
		
		var restoredSession = JSON.parse(localStorage.getItem('session-harv0116'));
		//console.log(restoredSession);
		
		var contactName = restoredSession.contact[item].name;
		var contactPhone1 = restoredSession.contact[item].phone1;
		var contactPhone2 = restoredSession.contact[item].phone2;
		var contactLat = restoredSession.contact[item].lat;
		var contactLong = restoredSession.contact[item].long;
		
		console.log("MADE IT HERE - SINGLE TAP");
		// draw modal
		document.querySelector("[data-role=modal] h3").innerHTML = "Contact Information";
		
		document.getElementById("contNameText").placeholder = contactName;
		document.getElementById("contPhone1Text").placeholder = contactPhone1;
		document.getElementById("contPhone2Text").placeholder = contactPhone2;
		document.getElementById("contLatText").placeholder = contactLat;
		document.getElementById("contLongText").placeholder = contactLong;
		
		// display all of contact information here.  Name & 2 Phone Numbers.
	},
	map: function(ev){
		ev.stopPropagation()
		document.querySelector("[data-role=modal]").style.display="none";
		document.querySelector("[data-role=overlay]").style.display="none";		
	
		var item = ev.target.getAttribute("data-ref");
		var restoredSession = JSON.parse(localStorage.getItem('session-harv0116'));
		var contactLat = restoredSession.contact[item].lat;
		var contactLong = restoredSession.contact[item].long;
		
		console.log("MADE IT HERE - DOUBLE TAP");
	
	// MUCH MORE TO DO HERE
	
	}

};
app.initialize();


