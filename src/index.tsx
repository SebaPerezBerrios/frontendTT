// Store
import { Provider} from "react-redux";
import {store} from './appStore/store'

import App  from './App';
import ReactDOM from 'react-dom';
import 'src/utils/chart';
import * as serviceWorker from './serviceWorker';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import 'nprogress/nprogress.css';
import { SidebarProvider } from './contexts/SidebarContext';

ReactDOM.render(
  <HelmetProvider>
	<Provider store={store}>
    		<SidebarProvider>
      			<BrowserRouter>
        			<App />
      			</BrowserRouter>
    		</SidebarProvider>
    	</Provider>
  </HelmetProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
