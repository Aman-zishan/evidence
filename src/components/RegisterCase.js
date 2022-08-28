import React, { Component } from 'react'
import EvidenceContract from '../abis/EvidenceContract.json'

import { Card, Button, Form, } from 'react-bootstrap';

import Navbar from './Navbar'



import Web3 from 'web3';
import './App.css';

class RegisterCase extends Component {
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {


        let provider = window.ethereum

        if (provider) {
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
            console.log(this.state.cases)
            this.setState({ loading: false })
        } else {
            window.alert('EvidenceContract contract not deployed to detected network.')
        }
    }


    captureFile = event => {

        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)

        reader.onloadend = () => {
            this.setState({ buffer: Buffer(reader.result) })
            console.log('buffer', this.state.buffer)
        }
    }


    registerCase = () => {
        console.log("Registering Case...")

        console.log(this.state.caseDetails)

        this.setState({ loading: true })


        this.state.evidenceContract.methods.registerCase(this.state.caseDetails.courtId,

            this.state.caseDetails.caseDescription,
            this.state.caseDetails.startDateTime).send({ from: this.state.account }).on('transactionHash', (hash) => {
                let newCaseId = this.state.cases.length + 1
                window.alert("Successfully registered with Case ID: " + newCaseId)
                this.setState({ loading: false })
            })

    }

    handleCaseInputChange = (event) => {
        this.setState({
            caseDetails: {
                ...this.state.caseDetails,
                [event.target.name]: event.target.value
            }
        });
    }


    constructor(props) {
        super(props)
        this.state = {
            cases: [],
            account: '',
            evidenceContract: null,
            loading: true,

            caseDetails: {
                courtId: '',

                caseDescription: '',
                startDateTime: ''
            },

        }
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
                                        <p>&nbsp;</p>
                                        <Card>
                                            <Card.Header as="h2">Register Case</Card.Header>
                                            <Card.Body>
                                                <Card.Title>Provide the below details to register a case.</Card.Title>

                                                <Form onSubmit={(event) => {
                                                    console.log('Form Submitted')
                                                    event.preventDefault()
                                                    this.registerCase();

                                                }}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Court ID</Form.Label>
                                                        <Form.Control type="text" placeholder="Court ID" value={this.state.caseDetails.courtId}
                                                            onChange={this.handleCaseInputChange} name="courtId" />

                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Case Description</Form.Label>
                                                        <Form.Control as="textarea" rows={3} placeholder="Case Description" value={this.state.caseDetails.caseDescription}
                                                            onChange={this.handleCaseInputChange} name="caseDescription" />

                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Start Date</Form.Label>
                                                        <Form.Control type="date" placeholder="Select Date" value={this.state.caseDetails.startDateTime}
                                                            onChange={this.handleCaseInputChange}
                                                            name="startDateTime" />

                                                    </Form.Group>
                                                    <Button variant="primary" type="submit" >Register Case</Button>

                                                </Form>



                                            </Card.Body>
                                        </Card>

                                        

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
 
export default RegisterCase;