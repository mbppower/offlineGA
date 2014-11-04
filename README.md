offlineGA
=========

Offline Google Analytics support

Enable Google Universal Analytics tracking for native Cordova/Web apps.
When the app is offline the calls are stored in localStorage and then synchronized when the device is online.
Use the _ogaq function as you would do with standard ga function;
In the Analytics dashboard configure your tracking for Web not Native App

Example:

_ogaq = new offlineGA();
_ogaq('create', 'UA-XXXXXXXX-X', 'auto');
_ogaq('set', 'checkProtocolTask', null); // Disable file:// protocol checking.
_ogaq('set', 'checkStorageTask', null); // Disable cookie enable checking. Use this if your webview doesn't support cookies
_ogaq('send', 'pageview', '/app/my/page'); // Send page view.
