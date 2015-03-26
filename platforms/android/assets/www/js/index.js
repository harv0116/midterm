var app = {
  	name: "Midterm App",
  	version: "1.2.3",
	links: [],
	numPages: 0,
	pageTime: 500,
	lat: "",
	long: "",
	themap: "",
	session: {
			'contact' :[],
			'state'	: true
		},
	
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
		app.geolocation();
		app.contacts();
		//app.hammerlistener();   // Unable to get to work from here
		// SORRY NO BACK BUTTON - I am just not feeling well and have to hand this in NOW
		
    	document.getElementById("btnOK").addEventListener("click", app.ok);
	 
  	},
	geolocation: function() {
		if( navigator.geolocation ){ 		  
			var params = {enableHighAccuracy: true, timeout:9000, maximumAge:5000};
			navigator.geolocation.getCurrentPosition( app.reportPosition, app.gpsError, params ); 
		} else {
			alert("Sorry, your browser does not support location tools.");
		}
	},
	contacts: function() {
		var options = new ContactFindOptions();
		options.filter = "";
		options.multiple = true;
		var fields = ["displayName"]; 
		navigator.contacts.find(fields, app.successFunc, app.errFunc, options);	
	},
	hammerlistener: function() {
		var listview = document.querySelector('ul');		
		
			var hammertime = new Hammer.Manager(listview);	
			var singleTap = new Hammer.Tap({ event: 'singletap' });
			var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2});
			hammertime.add([doubleTap, singleTap]);
			doubleTap.requireFailure('singletap');

			 hammertime.on('singletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				app.view(ev);
			});
			hammertime.on('doubletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				app.map(ev);
			});
			 
	},
	
	successFunc: function( matches ){
		var div = document.getElementById("displaycontact");
		var nameul = document.createElement("ul");
		var name = '';
		var phone1 = '';
		var phone2 = '';
		var phone1type = '';
		var phone2type = '';
		
		nameul.setAttribute("data-role","listview");

		
		for (i=0; i<matches.length; i++)
		{	
			if (matches[i].displayName != null) {   // test to see if contact name was entered
				var li = document.createElement("li");
				li.dataset.ref = i;
				li.innerHTML = matches[i].displayName;
	
			} else {
				var li = document.createElement("li");
				li.dataset.ref = i;
				li.innerHTML = 'Name not Listed';

			}
			
			
			if (matches[i].phoneNumbers) {
				for (var j=0; j<matches[i].phoneNumbers.length; j++) 
				{
					if (j==0) {
						phone1 = matches[i].phoneNumbers[0].value;
					} else {
						phone2 = matches[i].phoneNumbers[1].value;
					}
				} 
			}
			

			app.session.contact.push({ 'name': matches[i].displayName, 
								   'phone1': phone1,
								   'phone2': phone2,
								   'lat': ' ', 'long': ' ' });
			nameul.appendChild(li);

		}

		div.appendChild(nameul);
		
		localStorage.setItem('session-harv0116', JSON.stringify(app.session));
	
			var listview = document.querySelector('ul');		
		
			var hammertime = new Hammer.Manager(listview);	
			var singleTap = new Hammer.Tap({ event: 'singletap' });
			var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2});
			hammertime.add([doubleTap, singleTap]);
			doubleTap.requireFailure('singletap')

			 hammertime.on('singletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				app.view(ev);
			});
			hammertime.on('doubletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				app.map(ev);
			}); 
	},
	errFunc: function ( ) {
		alert("The contact could not be found");
	},
	ok: function(ev){
		document.querySelector("[data-role=modal]").style.display="none";
		document.querySelector("[data-role=overlay]").style.display="none";
	},
	view: function(ev){
		document.querySelector("[data-role=modal]").style.display="block";
		document.querySelector("[data-role=overlay]").style.display="block";
	
		var item = ev.target.getAttribute("data-ref");
		
		var restoredSession = JSON.parse(localStorage.getItem('session-harv0116'));
		
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
	},
	map: function(ev){
		document.querySelector("[data-role=modal]").style.display="none";
		document.querySelector("[data-role=overlay]").style.display="none";
		document.querySelector("#home").style.display="none";
		document.querySelector("#geo").style.display="block";		
	
		var item = ev.target.getAttribute("data-ref");
		var restoredSession = JSON.parse(localStorage.getItem('session-harv0116'));
		var contactName = restoredSession.contact[item].name;
		var contactPhone1 = restoredSession.contact[item].phone1;
		var contactPhone2 = restoredSession.contact[item].phone2;
		var contactLat = restoredSession.contact[item].lat;
		var contactLong = restoredSession.contact[item].long;
		
		console.log ("LAT = " + app.lat + " LONG = " + app.long);


		if (contactLat.trim()=="" || contactLong.trim()=="") {
			
			var gpsLatLng = new google.maps.LatLng(app.lat, app.long);
			var mapOptions = {
				// center map
				center: gpsLatLng,
				disableDoubleClickZoom: true,
				zoom: 14,
				scalecontrol: true,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
			app.themap = new google.maps.Map(document.getElementById("mapoutput"), mapOptions);
			
			
			alert("Double tap anywhere to set the position for the contact");
			
			var el = document.getElementById('mapoutput');
			
			var hammertime = new Hammer.Manager(el);	
			var singleTap = new Hammer.Tap({ event: 'singletap' });
			var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2});
			hammertime.add([doubleTap, singleTap]);
			doubleTap.requireFailure('singletap')

			hammertime.on('doubletap', function(ev) {
				ev.preventDefault();
				console.log(ev);
				app.addLocation(ev, item);
			});
		
		} else {
			var myLatLng = new google.maps.LatLng(contactLat,contactLong);
			var mapOptions = {
				// center map
				zoom: 14,
				center: myLatLng,
				disableDoubleClickZoom: true,
				scalecontrol: true,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			
			app.themap = new google.maps.Map(document.getElementById("mapoutput"), mapOptions);
		
			
		}
		
		// event listener for back button
		
	},

	addLocation: function(ev, item) {
	
		console.log ("BY SOME LUCK WE GOT HERE!!!");
		console.log ("GPS " + app.lat + " " + app.long);
		
		var myLatLng = new google.maps.LatLng(app.lat,app.long);
		
		var marker = new google.maps.Marker({
			position: myLatLng,
			map: app.themap,
			animation: google.maps.Animation.BOUNCE
			
		});
	
		
		if (marker.getAnimation() != null) {
				marker.setAnimation(null);
			} else {
				marker.setAnimation(google.maps.Animation.BOUNCE);
		}
		
		// I give up:
		// The marker doesnt work right
		// I do not know how to use localstorage to save the lat and long to the current contact
		
		
		
	},
	reportPosition: function(position) {
		app.lat = position.coords.latitude;
		app.long = position.coords.longitude;
		console.log ("LAT = " + app.lat + " LONG = " + app.long);
	},
	gpsError: function( error ){	   		
		var errors = {
			1: 'Permission denied',
			2: 'Position unavailable',
			3: 'Request timeout'
		};		
		alert("Error: " + errors[error.code]);
	}

};
app.initialize();
