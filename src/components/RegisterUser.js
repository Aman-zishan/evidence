import EvidenceContract from '../abis/EvidenceContract.json'
import React, { Component } from 'react';
import { Card, Button, Form, } from 'react-bootstrap';

import Navbar from './Navbar'
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';


import Web3 from 'web3';
import './App.css';

const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGUwNTM0Nzk5RkE3MzViMjU2M2FFQzgxRTFCNzM2QjQ0NjUwNEI4NkUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE1OTQ2ODg0MzQsIm5hbWUiOiJwcm9qZWN0In0.vFBRzrdifo20GVGw5hRS6XKmNRDxEi8Vje4S39y7YS0" })
class RegisterUser extends Component {

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



    registerUser = async () => {
        console.log("Registering User...")

        console.log(this.state.userDetails)

        this.setState({ loading: true })
   

        

            this.state.evidenceContract.methods.addUser(this.state.userDetails.userAddress,

               "test",
                this.state.userDetails.date).send({ from: this.state.account }).on('transactionHash', (hash) => {
                  
                    window.alert("Successfully registered user",this.state.userDetails.userAddress)
                    this.setState({ loading: false })
                })
      

   

    }
    handleUserInputChange = (event) => {
        this.setState({
            userDetails: {
                ...this.state.userDetails,
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
            userDetails: {
                userAddress: "",
                date: "",
                file: ""
            }
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
                                        <Card className="mb-3">
                                            <Card.Header as="h2">Register User</Card.Header>
                                            <Card.Body>
                                                <Card.Title>Add eligible user details</Card.Title>

                                                <Form onSubmit={(event) => {
                                                    console.log('Form Submitted')
                                                    event.preventDefault()
                                                    this.registerUser();

                                                }}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>User Address</Form.Label>
                                                        <Form.Control type="text" placeholder="User Address" value={this.state.userDetails.userAddress}
                                                            onChange={this.handleUserInputChange} name="userAddress" />

                                                    </Form.Group>
                                                    
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Date</Form.Label>
                                                        <Form.Control type="date" placeholder="Select Date" value={this.state.userDetails.date}
                                                            onChange={this.handleUserInputChange}
                                                            name="date" />
                                                         

                                                    </Form.Group>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>ID proof</Form.Label>
                                                           <Form.Control type="file" placeholder="Select Date" value={this.state.userDetails.file}
                                                            onChange={this.handleUserInputChange}
                                                            />

                                                    </Form.Group>
                                                    <Button variant="primary" type="submit" >Register User</Button>

                                                </Form>



                                            </Card.Body>
                                        </Card>
                                      

                                        <p>&nbsp;</p>

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

export default RegisterUser;