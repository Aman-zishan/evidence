import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import RegisterUser from './components/RegisterUser'
import RegisterCase from './components/RegisterCase'
import RegisterEvidence from './components/RegisterEvidence'
import ShowEvidence from './components/ShowEvidence'
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
ReactDOM.render(
    <BrowserRouter><Routes>

        {/* This route is for home component 
      with exact path "/", in component props 
      we passes the imported component*/}
        <Route path="/" element={<App></App>} />

        {/* This route is for about element 
      with exact path "/about", in element 
      props we passes the imported element*/}
        <Route path="/register" element={<RegisterUser></RegisterUser>} />

        {/* This route is for contactus element
      with exact path "/contactus", in 
      element props we passes the imported element*/}

        <Route path="/registerCase" element={<RegisterCase></RegisterCase>} />
        <Route path="/registerEvidence" element={<RegisterEvidence></RegisterEvidence>} />
        {/* If any route mismatches the upper 
      route endpoints then, redirect triggers 
      and redirects app to home element with to="/" */}
        <Route path="/showEvidence" element={<ShowEvidence></ShowEvidence>} />

    </Routes></BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
