if (typeof window === 'undefined') {
  console.log('NO WINDOW');
  global.window = {};
} else {
  console.log('WE HAVE WINDOW');
}

import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App/App';
// import registerServiceWorker from './registerServiceWorker';

// registerServiceWorker();

ReactDOM.render(<App />, document.getElementById('reactRoot'));
