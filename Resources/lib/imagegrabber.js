Ti.include('htmlparser.js');
Ti.include('soupselect.js');
Ti.include('urldescriptor.js');

exports = {};

exports.grab = function(url, callback){
	var descriptor = urldescriptor.describe(url);
	var base_url = descriptor.base_url;
	
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
				d = urldescriptor.describe(img.attribs.src);
				if (d.base_url == urldescriptor.RELATIVE_URL){
					src = base_url + '/' + img.attribs.src;
				} else{
					src = img.attribs.src;
				}
				img_urls.push(src);
				// alert('src: ' + img.attribs.src);
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
	
};

exports.info = function(image_url){
	var imageTemp = Ti.UI.createImageView({
		image : image_url,
		height:'auto',
		width:'auto'
	});
	imageSize = imageTemp.toImage();
	
	var info = {};
	info.url = image_url;
	info.height = imageSize.height;
	info.width = imageSize.width;
	info.area = info.height * info.width;
	
	Ti.API.info( "height =" + info.height);
	Ti.API.info( "width  =" + info.width);
	Ti.API.info( "area   =" + info.area);
	
	imageTemp = imageSize = null;
	
	return info;
};

// tmpData.sort(compare);
// a,b: image info objects
function compare(a, b) {
    return b.area - a.area;
};

exports.compare = compare;

// returns the bigest image 
// from an array of image infos
exports.bigimage = function (infos) {
	infos.sort(compare);
    return infos[0];
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
