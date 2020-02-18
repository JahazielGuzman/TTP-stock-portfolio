import React, { Component } from "react";
import Router from "next/router";
import Fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
import {Container, Col, ListGroup, Row, Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
const API = process.env.REACT_APP_BACKEND;

class Purchaser extends Component {

    state = {
        ticker: "",
        quantity: ""
    }

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="buy-stock">
                <form 
                    onSubmit={e => {
                        e.preventDefault();
                        this.props.buyStock(this.state)
                    }
                }>
                    <FormGroup controlId="ticker" bsSize="large">
                        <FormLabel>Ticker</FormLabel>
                        <FormControl
                        onChange={e => this.setState({ticker: e.target.value})}
                        type="text"
                        />
                    </FormGroup>
                    <FormGroup controlId="quantity" bsSize="large">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl
                        onChange={e => this.setState({quantity: e.target.value})}
                        type="number"
                        />
                    </FormGroup>
                    <Button block bsSize="large" type="submit" >
                        Buy
                    </Button>
                </form>
            </div>
        );
    }

}

export default Purchaser;


