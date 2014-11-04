/**
 *  @author Marcel Barbosa Pinto
 *  @email marcel.power@gmail.com
 *  @git: https://github.com/mbppower/offlineGA.git
 *  @deprecated Please, use offlineAnalytcs.js
 *  
 *  Example code:
 *		var _ogaq = new offlineGA();
 *		_ogaq.push(['_setAccount', 'UA-XXXXXXXX-X']);
 *		_ogaq.push(['_trackPageview', '/app/my/page/view']);
 *		
 */
var _gaq = _gaq || [];

var offlineGA = function(){
	var _t = this;
	
	if(!this.isSupported())
		return;
	
	//begin sync
	if(navigator.onLine){
		_t.sync();
	}
	//sync when status change from offline to online
	window.addEventListener('online', function() {
		_t.sync();
	});
};
offlineGA.prototype = {
	localStorageKey : "_oga",
	dataMaxLength : 10,
	timeIntervalMillis : 10000,
	isSupported : function(){
		return !!("onLine" in navigator && "localStorage" in window);
	},
	isGALoaded : function (){
		return !!(window["_gaq"] && !(_gaq instanceof Array));
	},
	isOnline : function(){
		return navigator.onLine;
	},
	localStorageItem : function(val){
		if(val != null){
			return localStorage.setItem(this.localStorageKey, JSON.stringify(val));
		}
		else{
			return localStorage.getItem(this.localStorageKey) == null ? null : JSON.parse(localStorage.getItem(this.localStorageKey));
		}
	},
	push: function(arr) {
		if (this.isSupported() && !this.isOnline()) {
			this.store(arr);
			console.log("store", arr);
		}
		else {
			console.log("now", arr);
			_gaq.push(arr);
		}
	},
	store: function(arr) {
		if(!arr) return;
		var stored = this.localStorageItem() || [];
		stored.push(arr);
		this.localStorageItem(stored);
	},
	sync: function() {
		if (this.isGALoaded()) {
			this.pushData();
		}
		else {
			//GA callback
			var _t = this;
			_gaq.push(function(){
				_t.pushData();
			});
			this.loadGA();
		}
	},
	pushData : function(){
		if (!this.isSupported()) {
			console.log("offlineGA is not supported");
			return;
		}
		var _t = this;
		function next(){
			if(!_t.isOnline()) return;
			var stored = _t.localStorageItem() || [];
			console.log("stored.length", stored.length);
			if(stored.length){
				var callList = stored.splice(0, _t.dataMaxLength);
				for(var i in callList){
					_gaq.push(callList[i]);
				}
				_t.localStorageItem(stored);
				
				//next chunk
				setTimeout(next, _t.timeIntervalMillis);
			}
		}
		next();
	},
	loadGA: function() {
		var ga = document.createElement('script');
		ga.type = 'text/javascript';
		ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(ga, s);
	}
};