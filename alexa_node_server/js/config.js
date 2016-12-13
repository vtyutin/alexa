var config = {
    host: "<IP of your node box",
    port: "port",
    plexip: "plex server IP",
    plexusername: "<plex username>",
    plexport: "<plexport>",
    plexpassword: "<plex password>",
    plexservermachineid: "<special machine id of plex server",
    plextvclientmachineid: "<special machine id of the device you want to play to",

    sony : {
    	ipwifi: "10.0.0.10",
    	portwifi : 80,
	macwifi : "34:68:95:68:10:C5",
	ip: "10.0.0.2",
	port: 80,
	mac: "AC:9B:0A:41:E4:09"
    },

    plexOptions: {
	    product: "Plex for iOS",
	    version: "4.0.6",
	    device: "iPhone",
	    deviceName: "iphone",
	    identifier: "Node JS",
	},

	cp: {
		ip : '<IP of couchpotato',
		port : '5050',
		rootpath : '/api/<apikey for Couchpotato>/',
	},

	sonarr: {
		ip : '<sonarr IP',
		port : '<sonarr port: Usually 8989>',
		apikey : '<api key for sonarr>'
	}
};

module.exports = config;