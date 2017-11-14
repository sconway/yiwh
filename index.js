import React from 'react';
import ReactDOM from 'react-dom';
import App from 'containers/App/App';
import registerServiceWorker from './registerServiceWorker';

registerServiceWorker();

ReactDOM.render(
  <App />,
  document.getElementById('reactRoot')
);
