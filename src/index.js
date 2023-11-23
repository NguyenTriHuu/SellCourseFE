import 'react-app-polyfill/stable';
import 'core-js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store';
import { StoreProvider } from './stores';
import './Grid.css';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
createRoot(document.getElementById('root')).render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Provider store={store}>
            <StoreProvider>
                <QueryClientProvider client={new QueryClient()}>
                    <App />
                </QueryClientProvider>
            </StoreProvider>
        </Provider>
    </LocalizationProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
