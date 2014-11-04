offlineGA
=========

Offline Google Analytics support

Enable Google Universal Analytics tracking for native Cordova/Web apps.<br/>
When the app is offline the calls are stored in localStorage and then synchronized when the device is online.<br/>
Use the _ogaq function as you would do with standard ga function;<br/>
In the Analytics dashboard configure your tracking for Web not Native App<br/><br/>

Example:<br/><br/>

var _ogaq = new offlineGA();<br/>
_ogaq('create', 'UA-XXXXXXXX-X', 'auto');<br/>
_ogaq('set', 'checkProtocolTask', null); // Disable file:// protocol checking.<br/>
_ogaq('set', 'checkStorageTask', null); // Disable cookie checking, use this if your webview doesn't support cookies<br/>
_ogaq('send', 'pageview', '/app/my/page'); // Send page view.<br/>
