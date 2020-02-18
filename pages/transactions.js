import React, { Component } from "react";
import Router from "next/router";
import Fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
import {Container, Col, ListGroup, Row } from "react-bootstrap";
const API = process.env.REACT_APP_BACKEND;

class Transactions extends Component {

    state = {
        transactions: []
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        const router = Router;

        const authToken = localStorage.getItem('auth_token');

        if (!authToken && !authToken.includes("Bearer")) {

            router.push('/login');
        }
        else {
            // get the transactions for current user

            fetch(`${API}/api/transactions`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": authToken
                }
            })
            .then(res => res.json())
            .then(data => {
                this.setState({transactions: data.transactions});
            });     
        }
    }


    render() {
        return (
            <Layout>
                <Container>
                    <Row>
                        <Col lg={12}>
                        <ListGroup>
                            {
                                this.state.transactions.length > 0 ?
                                this.state.transactions.map(
                                    stock => 
                                    <ListGroup.Item>{`${stock.ticker} - ${stock.quantity} ${stock.price}`}</ListGroup.Item>
                                )
                                :
                                "No transactions"
                            }
                        </ListGroup>
                        </Col>
                    </Row>
                </Container>
            </Layout>
        );
    }
}

export default Transactions; 