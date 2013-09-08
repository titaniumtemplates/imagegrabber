Ti.include('/lib/imagegrabber.js');

var test_urls = new Array();

test_urls.push("http://us.lrd.yahoo.com/_ylc=X3oDMTBia3FyNjc4BHNlY3Rpb24DcnNz/SIG=114duk3t2/**http%3A//www.colonialamerica.com/");
test_urls.push("http://www.collegeonline.org/");
test_urls.push("http://news.yahoo.com/kerry-sarin-syria-assad-140543565.html");
test_urls.push("http://sports.yahoo.com/blogs/nfl-shutdown-corner/pam-oliver-suffered-serious-concussion-symptoms-five-days-150415828--nfl.html");
test_urls.push("http://music.yahoo.com/news/electric-zoo-canceled-two-deaths-during-festival-134023883-rolling-stone.html");
test_urls.push("http://www.vetstreet.com/our-pet-experts/use-your-spidey-sense-to-keep-pets-away-from-these-arachnids");

// HINT: In order to test several url 
//       change the index below:
var url = test_urls[5];

//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var FirstView = require('ui/common/FirstView');
		
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff'
	});
		
	//construct UI
	var firstView = new FirstView();
	self.add(firstView);
	
	var callback = function(images){
		var descriptor;
		var infos = [];
		images.forEach(function(src) {
			Ti.API.info(' ');
			Ti.API.info('>>> src ..: ' + src);
			var i = imagegrabber.info(src);
			Ti.API.info('> height =' + i.height);
			Ti.API.info('> width  =' + i.width);
			Ti.API.info('> area   =' + i.area);
			Ti.API.info('> ........: ' + JSON.stringify(i));
			infos.push(i);
		});
		
		var filtered = imagegrabber.filter(infos);
		
		var big = imagegrabber.bigimage(filtered);
		Ti.API.info(' ');
		Ti.API.info('>>> big image');
		Ti.API.info('>   ' + JSON.stringify(big));

		if (big != undefined){
			var image = Ti.UI.createImageView({
		  			image: big.url,
		  			width: 'auto',
		  			height: 'auto'
			});
			firstView.add(image);		
		}else{
			var label = Titanium.UI.createLabel(
				{text: 'No image found.'}
			);
			firstView.add(label);
		}

		// var image = Ti.UI.createImageView({
  			// image: big.src,
  			// width: 'auto',
  			// height: 'auto'
		// });
		// firstView.add(image);
	};

	var g = new imagegrabber.grab(url, callback);

	
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
