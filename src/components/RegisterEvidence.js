import EvidenceContract from '../abis/EvidenceContract.json'
import React, { Component } from 'react';
import { Card, Button, Form, } from 'react-bootstrap';
// import { create } from "ipfs-http-client";
import Navbar from './Navbar'
import Axios from 'axios'
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';


import Web3 from 'web3';
import './App.css';
const config = {
    headers: {
        "Content-Type": "multipart/form-data",
     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUwNTM0Nzk5RkE3MzViMjU2M2FFQzgxRTFCNzM2QjQ0NjUwNEI4NkUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE1OTQ2ODg0MzQsIm5hbWUiOiJwcm9qZWN0In0.vFBRzrdifo20GVGw5hRS6XKmNRDxEi8Vje4S39y7YS0` }
};
var bodyFormData = new FormData();
class RegisterEvidence extends Component {

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

    uploadFile = async () => {

        console.log("Submitting file to ipfs...")
        bodyFormData.append('file', this.state.buffer);

        //adding file to the IPFS
        const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUwNTM0Nzk5RkE3MzViMjU2M2FFQzgxRTFCNzM2QjQ0NjUwNEI4NkUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE1OTQ2ODg0MzQsIm5hbWUiOiJwcm9qZWN0In0.vFBRzrdifo20GVGw5hRS6XKmNRDxEi8Vje4S39y7YS0" })

        // await client.put(this.state.buffer, (error, result) => {
        //     console.log('Ipfs result', result)
        //     if (error) {
        //         console.error(error)
        //         return
        //     }
        // Axios.post(
        //     'http://api.web3.storage/upload',
        //     { data: bodyFormData },
        //     config
        // ).then(result => {
            // console.log(result)
            this.setState({ loading: true, })

            console.log(this.state.evidenceDetails)

            this.state.evidenceContract.methods.registerEvidence(this.state.evidenceDetails.caseId,
                this.state.evidenceDetails.description,
                "test",

                this.state.evidenceDetails.createdDate).send({ from: this.state.account }).on('transactionHash', (hash) => {
                    window.location.reload()
                    this.setState({ loading: false })
                })
        // }).catch(console.log);




    }
    handleEvidenceInputChange = (event) => {
        this.setState({
            evidenceDetails: {
                ...this.state.evidenceDetails,
                [event.target.name]: event.target.value
            }
        });
    }
    constructor(props) {
        super(props)
        this.state = {
            account: '',
            evidenceContract: null,
            loading: true,
            evidenceDetails: {
                caseId: '',
                description: '',

                createdDate: ''
            },
        }

        this.uploadFile = this.uploadFile.bind(this)
        this.captureFile = this.captureFile.bind(this)
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
                                            <Card.Header as="h2">Submit Evidence</Card.Header>
                                            <Card.Body>
                                                <Card.Title>Provide the below details to submit an evidence.</Card.Title>

                                                <Form onSubmit={(event) => {
                                                    console.log('Form Submitted')
                                                    event.preventDefault()

                                                    this.uploadFile();

                                                }}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Case ID</Form.Label>
                                                        <Form.Control type="text" placeholder="Case ID" value={this.state.evidenceDetails.caseId}
                                                            onChange={this.handleEvidenceInputChange}
                                                            name="caseId" />

                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label >Upload Evidence File</Form.Label>
                                                        <Form.Control type="file" id="fname"
                                                            onChange={this.captureFile}
                                                            name="fileHash"
                                                            placeholder="Enter the Hash" />

                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Date</Form.Label>
                                                        <Form.Control type="date" placeholder="Select Date"
                                                            name="createdDate"
                                                            id="dateofbirth"
                                                            value={this.state.evidenceDetails.createdDate}
                                                            onChange={this.handleEvidenceInputChange} />

                                                    </Form.Group>

                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Evidence Description</Form.Label>
                                                        <Form.Control as="textarea" rows={3} placeholder="Evidence Description"
                                                            value={this.state.evidenceDetails.description}
                                                            onChange={this.handleEvidenceInputChange} name="description" />

                                                    </Form.Group>

                                                    <Button variant="primary" type="submit" >Submit Evidence</Button>

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

export default RegisterEvidence