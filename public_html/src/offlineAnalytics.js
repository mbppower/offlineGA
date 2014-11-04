/**
 *  @author Marcel Barbosa Pinto
 *  @email marcel.power@gmail.com
 *  @git: https://github.com/mbppower/offlineGA.git
 *  @description Enable Google Universal Analytics tracking for native Cordova apps.
 *  When the app is offline the calls are stored in localStorage and then synchronized when the device is online.
 *  Use the _ogaq function as you would do with standard ga function;
 *  In the Analytics dashboard configure your tracking for Web not Native App
 *  @example:
 *		_ogaq = new offlineGA();
 *		_ogaq('create', 'UA-XXXXXXXX-X', 'auto');
 *		_ogaq('set', 'checkProtocolTask', null); // Disable file:// protocol checking.
 *		_ogaq('set', 'checkStorageTask', null); // Disable cookie enable checking. Use this if your webview doesn't support cookies
 *		_ogaq('send', 'pageview', '/app/my/page'); // Send page view.
 */

var ga = ga || null;

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
	
	return function(){
		_t.push(arguments);
	}
};
offlineGA.prototype = {
	localStorageKey : "_oga",
	dataMaxLength : 10,
	timeIntervalMillis : 10000,
	_isGALoaded : false,
	isSupported : function(){
		return !!("onLine" in navigator && "localStorage" in window);
	},
	isGALoaded : function (){
		return this._isGALoaded;
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
		if ((this.isSupported() && !this.isOnline()) || !this.isGALoaded()) {
			this.store(arr);
			console.log("store:" +  JSON.stringify(arr));
		}
		else {
			console.log("now:" + JSON.stringify(arr));
			ga.apply(this, arr);
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
			this.loadGA(function(){
				_t.pushData();
			});
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
			console.log("stored.length: " +  stored.length);
			if(stored.length){
				var callList = stored.splice(0, _t.dataMaxLength);
				for(var i in callList){
					var arr = [];
					for(var arg in callList[i]){
						arr.push(callList[i][arg]);
					}
					console.log("sync:" + JSON.stringify(arr));
					ga.apply(_t, arr);
				}
				_t.localStorageItem(stored);
				
				//next chunk
				setTimeout(next, _t.timeIntervalMillis);
			}
		}
		next();
	},
	loadGA: function(callback) {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','http://www.google-analytics.com/analytics.js','ga');
		_t = this;
		ga(function(){
			console.log("Analytics is loaded");
			_t._isGALoaded = true;
			callback && callback();
		});
	}
};