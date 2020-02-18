import React, { Component } from "react";
import Router from "next/router";
import Fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
import {Container, Col, ListGroup, Row } from "react-bootstrap";
import Purchaser from "../components/Purchaser";
const API = process.env.REACT_APP_BACKEND;

class Portfolio extends Component {

    state = {
        portfolio: [],
        error: ""
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        const router = Router;

        const authToken = localStorage.getItem('auth_token');

        if (!authToken && !authToken.includes("Bearer")) {

            router.push('/');
        }
        else {
            // get the portfolio for current user

            fetch(`${API}/api/portfolio`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": localStorage.getItem('auth_token')
                }
            })
            .then(res => res.json())
            .then(data => {
                this.setState({portfolio: data.portfolio});
            });     
        }
    }

    buyStock = (stock) => {

        console.log(stock);
        fetch(`${API}/api/transactions`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem('auth_token')
            },
            body: JSON.stringify({
                ticker: stock.ticker,
                quantity: stock.quantity
            })
        })
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                const {ticker, quantity, price} = data.stock;
                const matchingStock = this.state.portfolio.find(s => s.ticker == ticker);

                if (matchingStock)
                    this.setState({
                            portfolio: [
                                {ticker, quantity: matchingStock.quantity + quantity, price},
                                ...this.state.portfolio.filter(s => s.ticker != ticker)
                            ]
                        });
                else {
                    this.setState({
                        portfolio: [...this.state.portfolio, {ticker, quantity, price}]
                    })
                }
                this.setState({error: ""})
                
            }
            else {
                this.setState({error: data.message});
            }
        });  
    }

    render() {
        return (
            <Layout>
                <Container>
                    <Row>
                        <Col lg={6}>
                        <ListGroup>
                            {
                                this.state.portfolio.length > 0 ?
                                this.state.portfolio.map(
                                    stock => 
                                    <ListGroup.Item>{`${stock.ticker} - ${stock.quantity} ${stock.value}`}</ListGroup.Item>
                                    )
                                : 
                                "No stocks yet"
                            }
                        </ListGroup>
                        </Col>
                        <Col lg={6}>
                            {this.state.error ? <p class="help is-danger">{this.state.error}</p> : ""}
                            <Purchaser buyStock={this.buyStock} />
                        </Col>
                    </Row>
                </Container>
            </Layout>
        );
    }
}

export default Portfolio; 