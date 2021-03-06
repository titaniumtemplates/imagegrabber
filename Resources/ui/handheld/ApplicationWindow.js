Ti.include('/lib/imagegrabber.js');

var test_urls = new Array();

test_urls.push("http://us.lrd.yahoo.com/_ylc=X3oDMTBia3FyNjc4BHNlY3Rpb24DcnNz/SIG=114duk3t2/**http%3A//www.colonialamerica.com/");
test_urls.push("http://www.collegeonline.org/");
test_urls.push("http://news.yahoo.com/kerry-sarin-syria-assad-140543565.html");
test_urls.push("http://sports.yahoo.com/blogs/nfl-shutdown-corner/pam-oliver-suffered-serious-concussion-symptoms-five-days-150415828--nfl.html");
test_urls.push("http://music.yahoo.com/news/electric-zoo-canceled-two-deaths-during-festival-134023883-rolling-stone.html");
test_urls.push("http://www.vetstreet.com/our-pet-experts/use-your-spidey-sense-to-keep-pets-away-from-these-arachnids");
test_urls.push("http://www.nytimes.com/interactive/2013/09/05/movies/movies-20-young-directors.html?hp&_r=0");
test_urls.push("http://www.nytimes.com/2013/09/09/business/verizon-and-fcc-net-neutrality-battle-set-in-district-court.html?hp");
test_urls.push("http://www.nytimes.com/2013/09/08/world/middleeast/with-the-world-watching-syria-amassed-nerve-gas.html?hp");
test_urls.push("http://www.theguardian.com/world/2013/sep/08/syria-john-kerry-un-resolution");
test_urls.push("http://www.theguardian.com/politics/2013/sep/08/labour-unite-falkirk-bullying-claims");
test_urls.push("http://keepingscore.blogs.time.com/2013/09/08/nadal-djokovic-meet-again-for-u-s-open-title/");
test_urls.push("http://entertainment.time.com/2013/09/06/the-real-gangs-of-boardwalk-empire/");
test_urls.push("http://lightbox.time.com/2013/09/06/pictures-of-the-week-august-29-september-6/#1");

// HINT: In order to test several url 
//       change the index below:
var url = test_urls[0];

// cached objects
var imageview; 
var noimagelabel;
var firstView;
var test_url_index = 0;
var toast;

//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var FirstView = require('ui/common/FirstView');
		
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#ffffff'
	});
		
	//construct UI
	firstView = new FirstView();
	self.add(firstView);
	
	var cb = grabimage;
	
	firstView.addEventListener('click', cb);
	
	return self;
}

function grabimage(){
	var callback = function(images){
		// var descriptor;
		// var infos = [];
		// images.forEach(function(src) {
			// Ti.API.info(' ');
			// Ti.API.info('>>> src ..: ' + src);
			// var i = imagegrabber.info(src);
			// Ti.API.info('> height =' + i.height);
			// Ti.API.info('> width  =' + i.width);
			// Ti.API.info('> area   =' + i.area);
			// Ti.API.info('> ........: ' + JSON.stringify(i));
			// infos.push(i);
		// });
// 		
		// var filtered = imagegrabber.filter(infos);
// 		
		// var big = imagegrabber.bigimage(filtered);
		// Ti.API.info(' ');
		// Ti.API.info('>>> big image');
		// Ti.API.info('>   ' + JSON.stringify(big));
		
		var big = imagegrabber.suggestion(images);

		if (big != undefined){
			imageview = Ti.UI.createImageView({
		  			image: big.url,
		  			width: 'auto',
		  			height: 'auto'
			});
			firstView.add(imageview);		
		}else{
			noimagelabel = Titanium.UI.createLabel(
				{text: 'No image found.'}
			);
			firstView.add(noimagelabel);
		}

	};

	if (imageview != null){
		firstView.remove(imageview);
	}
	
	if (noimagelabel != null){
		firstView.remove(noimagelabel);
	}
	
	if (toast != null){
		firstView.remove(toast);
	}
	
	url = test_urls[next_index()];
	
	toast = Ti.UI.createLabel({
		color:'#cecece',
		text: url,
		font: { fontSize: 14 },
		height:'auto',
		width:'auto',
		bottom: 60
	});
	
	firstView.add(toast);

	var g = new imagegrabber.grab(url, callback);
}

function next_index(){
	if (test_url_index < test_urls.length - 1){
		test_url_index ++;
	}else{
		test_url_index = 0;
	}
	
	return test_url_index;
	
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
