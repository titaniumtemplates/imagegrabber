/*
 * A single regex to parse and breakup a full URL 
 * including query parameters and anchors e.g.
 * https://gist.github.com/metafeather/202974
 * 
 * test url:
 * https://www.google.com/dir/1/2/search.html?arg=0-a&arg1=1-b&amp;arg3-c#hash
 * 
 * Additional information:
 * http://stackoverflow.com/questions/27745/getting-parts-of-a-url-regex
 * 
 * NOTE:
 * The above pattern does not match URLs without parameters 
 * and one special case:
 * http://www.foo.com
 * http://www.foo.com/
 * http://www.foo.com/page
 * 
 * TODO: Fix the regexp pattern.
 * 
 * Until we will fix our pattern we will made one more check by
 * using an additional URL match pattern:
 * http://net.tutsplus.com/tutorials/other/8-regular-expressions-you-should-know/
 * 
 * NOTE 1:
 * Regexp tester used to improve this regular expression 
 * http://gskinner.com/RegExr/
 */

exports = {};

// PATTERN and PATTERN_IMPROVED_2 does not work. 
// 
var PATTERN_INITIAL    = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
var PATTERN_IMPROVED_1 = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]*[^#?\s]+)?(.*)?(#[\w\-]+)?$/;
var PATTERN_IMPROVED_2 = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)?([\w\-\.]*[^#?\s]+)?(.*)?(#[\w\-]+)?$/;
var PATTERN            = PATTERN_IMPROVED_2;
var PATTERN_ALT        = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
var RELATIVE_URL       = '{relative_url}';

exports.pattern = PATTERN;
exports.RELATIVE_URL = RELATIVE_URL;
exports.describe = function(url){
 
 	var re = new RegExp(PATTERN);
  	var m = re.exec(url);
 	
 	var re_alt = new RegExp(PATTERN_ALT);
 	var m_alt = re_alt.exec(url);
 	
 	if (m!=null){
	 	var r = {
			url: m[0], 
			protocol: m[2],
			host: m[3],
			path: m[4],
			file: m[6],
			query: m[7],
			hash: m[8],
			base_url: ((typeof m[2] !== 'undefined') ? m[2] + '://' + m[3] + ((typeof m[4] !== 'undefined') ? m[4] : '') : RELATIVE_URL)  
		};
 	} else if (m_alt!=null){
 	 	var r = {
			url: m_alt[0], 
			protocol: m_alt[1],
			host: m_alt[2] + '.' + m_alt[3],
			path: ((m_alt[4] != null) ? m_alt[4] : ''),
			base_url: m_alt[1] + m_alt[2] + '.' + m_alt[3]
		};	
 	} else {
 		r = null;
 	}
	
	return r;
	
//	/*
//	Alternate from Reverse HTTP javascript server http://www.reversehttp.net/demos/httpd.js
//	*/
//	 
//	Url.regex = 
//	/*12       3    45     6 7         8          9 A        B   C                   D  E        F 0   */
//	/* proto         user    pass      host         port     path                       query      frag */
//	/^((\w+):)?(\/\/((\w+)?(:(\w+))?@)?([^\/\?:]+)(:(\d+))?)?(\/?([^\/\?#][^\?#]*)?)?(\?([^#]+))?(#(\w*))?/;
//	 
//	this.url = r[0];
//	this.protocol = r[2];
//	this.username = r[5];
//	this.password = r[7];
//	this.host = r[8] || "";
//	this.port = r[10];
//	this.pathname = r[11] || "";
//	this.querystring = r[14] || "";
//	this.fragment = r[16] || "";

};

urldescriptor = exports;