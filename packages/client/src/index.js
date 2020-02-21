import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { unregister } from './serviceWorker';

unregister();

ReactDOM.render(<App/>, document.getElementById('root'));
