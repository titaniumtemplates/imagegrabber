Ti.include('htmlparser.js');
Ti.include('soupselect.js');
Ti.include('urldescriptor.js');

var MIN_WIDTH = 140;
//  w:h
//  4:4 = 1
//  4:3 = 1.33
// 16:9 = 1.78 
var MAX_ASPECT_RATIO = 2.5;
var MIN_ASPECT_RATIO = 0.6;

exports = {};

exports.grab = function(url, callback){
		
	var descriptor = urldescriptor.describe(url);
	// NOTE: this is not safe. Check the following comments
	var base_url = descriptor.base_url;
	
	//
	// Locate base URL
	// there are cases where the initialy given URL is just a 
	// redirection to the actual URL. In these cases the base_url
	// is not safe to be taken by the initial given URL.
	// eg: http://us.lrd.yahoo.com/_ylc=X3oDMTBia3FyNjc4BHNlY3Rpb24DcnNz/SIG=114duk3t2/**http%3A//www.colonialamerica.com/ 
	//
	cb = function(e){
		Ti.API.info("cb .." + e.toString());
		Ti.API.info("cb .." + this.location);
		base_url = this.location;
		grabDo();
	};
	
	APIGetRequest(url, cb, null);
	
	function grabDo(){
		var select = soupselect.select;
		
		var handler = new htmlparser.DefaultHandler(function(err, dom) {
			if (err) {
				alert('Error: ' + err);
			} else {
				
				var img = select(dom, 'body img');
				var d;
				var src;
				var img_urls = new Array();
				img.forEach(function(img) {
					Ti.API.info("img ...: " + img.attribs.src);
					if (img.attribs.src != undefined){
						d = urldescriptor.describe(img.attribs.src);
						if (d!=null){
							if (d.base_url == urldescriptor.RELATIVE_URL){
								src = base_url + '/' + img.attribs.src;
							} else{
								src = img.attribs.src;
							}
							img_urls.push(src);
							// alert('src: ' + img.attribs.src);
						}else{
							Ti.API.warn("Unable to describe URL: " + img.attribs.src);
						}
					}else{
						Ti.API.warn("Img element without src attribute: " + img.raw);
					}
				});
				callback(img_urls);
			}
		});
		
		var parser = new htmlparser.Parser(handler);
		
		APIGetRequest(url, function(e){
			var status = this.status;
			if (status == 200) {
				body = this.responseText;
				parser.parseComplete(body);
			}
		}, function(err){
			alert('Unknow error from api');
		});
	}
	

// 	
};

function info(image_url){
	var imageTemp = Ti.UI.createImageView({
		image : image_url,
		// height:'auto',
		// width:'auto'
		height:'auto',
		width:10
	});
	var imageSize = imageTemp.toImage();
	
	var info = {};
	info.url = image_url;
	info.height = imageSize.height;
	info.width = imageSize.width;
	info.area = info.height * info.width;
	
	imageTemp = imageSize = null;
	
	return info;
};

exports.info = info;

// tmpData.sort(compare);
// a,b: image info objects
function compare(a, b) {
    return b.area - a.area;
};

exports.compare = compare;

// returns a filtered array 
// of image infos
function filter(infos){
	function myfilter(element) {
		if (element.width <= MIN_WIDTH) {
			return false;
		}
		
		var ratio = element.width/element.height;
		
		if (ratio > MAX_ASPECT_RATIO){
			return false;
		}
		if (ratio < MIN_ASPECT_RATIO){
			return false;
		}
		
  		return true;
	}
	
	var filtered =  infos.filter(myfilter);
	
	return filtered;
}

exports.filter = filter;

// returns the bigest image 
// from an array of image infos
function bigimage(infos) {
	infos.sort(compare);
    return infos[0];
};

exports.bigimage = bigimage;

exports.suggestion = function(img_ulrs){
		var descriptor;
		var infos = [];
		img_ulrs.forEach(function(src) {
			Ti.API.info(' ');
			Ti.API.info('>>> src ..: ' + src);
			//TODO: make info call asynch.
			var i = info(src);
			Ti.API.info('> height =' + i.height);
			Ti.API.info('> width  =' + i.width);
			Ti.API.info('> area   =' + i.area);
			Ti.API.info('> ........: ' + JSON.stringify(i));
			infos.push(i);
		});
		
		var filtered = filter(infos);
		
		var big = bigimage(filtered);
		Ti.API.info(' ');
		Ti.API.info('>>> big image');
		Ti.API.info('>   ' + JSON.stringify(big));
		
		return big;
};

function APIGetRequest(url, callback, errorCallback) {
	var req = Titanium.Network.createHTTPClient({
		onload : callback,
		onerror : errorCallback,
		timeout : 60000
	});
	req.open("GET", url, true);
	req.send();
}

imagegrabber = exports;
