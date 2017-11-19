var http = require('http');
var url  = require('url');
var fs   = require('fs'); 
var gpio = require('gpio');

var fnt; // frontward
var bck; // backward
var lft; // left
var rgt; // right

var up = 0;
var down = 0;
var left = 0;
var right = 0;

var intervalTimer;

/*
 * Create and start webserver on port 3000
 * 
 * listen to requets made by the web browser to this server
 * sets the movement variables accordingly
 */
var server = http.createServer(function (request, response) {
	
	// enable cors
	// server header
	response.writeHead(200, {
		'Content-Type': 'text/plain',
		'Access-Control-Allow-Origin' : '*',
		'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
	});
	
	if (request.url == '/up-on') {
		up = 1;
	} else if (request.url == '/up-off') {
		up = 0;
	} else if (request.url == '/down-on') {
		down = 1;
	} else if (request.url == '/down-off') {
		down = 0;
	} else if (request.url == '/left-on') {
		left = 1;
	} else if (request.url == '/left-off') {
		left = 0;
	} else if (request.url == '/right-on') {
		right = 1;
	} else if (request.url == '/right-off') {
		right = 0;
	}

	response.end();
	
}); 

/*
 * frontward pin to 1, car moves forward
 * frontward pin to 0, car stops
 * 
 * backward pin to 1, car moves backwards
 * backward pin to 0, car stops
 * 
 * left pin to 1, front wheels turn to the left
 * left pin to 0, front wheels motor stops
 * 
 * right pin to 1, front wheels turn to the right
 * right pin to 0, front wheels motor stops
 */
server.listen(3000, null, null, function() {
	
	// Enable gpio 
	fnt = gpio.export(17, { ready: function() { } });	
	bck = gpio.export(4, { ready: function() { } });	
	lft = gpio.export(27, { ready: function() { } });	
	rgt = gpio.export(22, { ready: function() { } });	

	// Set timer 
	intervalTimer = setInterval(function() {
		
		if (up == 1) 
		{
			fnt.set();			// set the frontward pin to 1        
		} 
		else if (up == 0) 
		{
			fnt.reset();        // set the frontward pin to 0
		}      

		if (down == 1) 
		{
			bck.set();			// set the backward pin to 1
		} 
		else if (down == 0) 
		{
			bck.reset();		// set the backward pin to 0
		}

		if (left == 1) 
		{
			lft.set();			// set the left pin to 1
		} 
		else if (left == 0) 
		{
			lft.reset();		// set the left pin to 0
		}

		if (right == 1) 
		{
			rgt.set();			// set the right pin to 1
		} 
		else if (right == 0) 
		{
			rgt.reset();		// set the right pin to 0
		}
		
	}, 200);	
	
});

// Cleanup on exit
process.on('SIGINT', function() {
	console.log('\nExit \nCleaning up...');
	clearInterval(intervalTimer);
	
	// Reset and release gpio port
	fnt.reset();                
    fnt.unexport(function () {  
		
		bck.reset();                
		bck.unexport(function () {  
				
			lft.reset();                
			lft.unexport(function () {  
					
				rgt.reset();                
				rgt.unexport(function () {  	
					
					// exit
					console.log('GPIO cleaning completed');
					process.exit(0);						
				});					
			});
		});				
	});                     
});
