import EvidenceContract from '../abis/EvidenceContract.json'
import React, { Component } from 'react';
import { Card, Button, Form, } from 'react-bootstrap';
// import { create } from "ipfs-http-client";
import Navbar from './Navbar'
import Axios from 'axios'
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import Web3 from 'web3';
import './App.css';
class App extends Component {

    render() {

        return (
            <div className="mainContainer">
                <Navbar></Navbar>
                <div className="containerInner">
                    <h1>Welcome To Ems</h1>
                </div>
            </div>
        );
    }
}

export default App;