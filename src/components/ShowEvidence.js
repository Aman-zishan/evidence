import EvidenceContract from '../abis/EvidenceContract.json'
import React, { Component } from 'react';
import { Card, Button, Form, } from 'react-bootstrap';
// import { create } from "ipfs-http-client";
import Navbar from './Navbar'
import Axios from 'axios'
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import Web3 from 'web3';
import './App.css';

class ShowEvidence extends Component {
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }
    async loadWeb3() {



        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }
    async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()

        this.setState({ account: accounts[0] })
        // Network ID
        // networkId = await web3.eth.net.getId()
        // const networkData = EvidenceContract.networks[networkId]
        const networkAdress = "0xc6d80Aa83cfE693FE266395Cd6DC0DA93c5B77E3"
        // const networkAdress = "0xE4f76e3aE3C6D77Ad74E5276663F9e79D066CE6B"

        if (networkAdress) {
            const evidenceContract = new web3.eth.Contract(EvidenceContract, networkAdress)
            console.log("here");
            console.log(evidenceContract);

            this.setState({ evidenceContract })
            const caseCount = await evidenceContract.methods.totalCases().call()
            this.setState({ caseCount })
            console.log("here");
            //console.log(evidenceContract);
            console.log(caseCount)
            for (var i = 1; i <= caseCount; i++) {
                const aCase = await evidenceContract.methods.cases(i).call()
                this.setState({
                    cases: [...this.state.cases, aCase]
                })
            }



            console.log(this.state.cases)


            this.setState({ loading: false })
        } else {
            window.alert('EvidenceContract contract not deployed to detected network.')
        }
    }
    getEvidencesOfCase = async () => {
        console.log('Get Evidences Called')
        const caseId = this.state.getCaseId
        console.log(caseId)
        const contextCase = this.state.cases[caseId - 1];


        for (var j = 1; j <= contextCase.totalEvidences; j++) {
            let evd = await this.state.evidenceContract.methods.getEvidenceById(caseId, j).call()

            this.setState({
                evidences: [...this.state.evidences, evd]
            })
        }
        console.log(this.state.evidences)
    }
    handleEvidenceCaseInput = (event) => {
        this.setState({
            getCaseId: event.target.value

        });
    }
    constructor(props) {
        super(props)
        this.state = {
            account: '',
            evidenceContract: null,
            loading: true,
            getCaseId: '',
            cases: [],
            evidences: []
        }


    }
    tipEvidenceOwner(address, tipAmount) {
        this.setState({ loading: true })
        this.state.evidenceContract.methods.tipEvidenceOwner(address).send({ from: this.state.account, value: tipAmount }).on('transactionHash', (hash) => {
            this.setState({ loading: false })
        })
    }

    render() {
        return (
            <div>
                <Navbar account={this.state.account} />
                {this.state.loading
                    ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
                    :
                    <div>
                        <div className="container-fluid mt-5">
                            <div className="row">
                                <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
                                    <div className="content mr-auto ml-auto">
                                        <Card>
                                            <Card.Header as="h2">Get Evidences of a case</Card.Header>
                                            <Card.Body>

                                                <Form onSubmit={(event) => {
                                                    console.log('Form Submitted')
                                                    event.preventDefault()

                                                    this.getEvidencesOfCase();

                                                }}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Case ID</Form.Label>
                                                        <Form.Control type="text" placeholder="Case ID" value={this.state.getCaseId}
                                                            onChange={this.handleEvidenceCaseInput}
                                                            name="caseId" />

                                                    </Form.Group>


                                                    <Button variant="primary" type="submit" >Get Evidences</Button>

                                                </Form>



                                            </Card.Body>
                                        </Card>
                                        {this.state.evidences.length > 0 ? this.state.evidences.map((evidence, key) => {
                                            return (
                                                <div className="card mb-4" key={key} >

                                                    <ul id="imageList" className="list-group list-group-flush">
                                                        <li className="list-group-item">
                                                            <p className="text-center"><img src={`https://ipfs.infura.io/ipfs/${evidence[1]}`} style={{ maxWidth: '420px' }} /></p>
                                                            <p>Evidence Description: {evidence[0]}</p>
                                                            <p>Date: {evidence[2]}</p>
                                                            <button
                                                                className="btn btn-link btn-sm float-right pt-0"
                                                                name={key}
                                                                onClick={(event) => {
                                                                    let tipAmount = window.web3.utils.toWei('0.1', 'Ether')

                                                                    this.tipEvidenceOwner(evidence[3], tipAmount)
                                                                }}
                                                            >
                                                                TIP 0.1 MATIC
                                                            </button>
                                                        </li>

                                                    </ul>
                                                </div>
                                            )
                                        }) : <p></p>}
                                    </div>
                                </main>
                            </div>
                        </div>

                    </div>
                }
            </div>
        );
    }

}
export default ShowEvidence


