const registerServiceWorker = () => {

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        // Then later, request a one-off sync:
      }, function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
};

export default registerServiceWorker;
