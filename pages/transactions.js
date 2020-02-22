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

            router.push('/');
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
                <h1 className="title is-1">Transactions</h1>
                {
                    this.state.transactions.length > 0 ?
                    this.state.transactions.map(
                        (stock, index) =>
                        <div className="columns" key={index}>
                            <div className="column is-2 is-size-4">{`BUY (${stock.ticker})`}</div>
                            <div className="column is-1 is-size-4">{`-`}</div>
                            <div className="column is-3 is-size-4">{`${stock.quantity} Shares @ ${stock.price}`}</div>
                        </div>
                    )
                    :
                    "No transactions"
                }
                <style jsx>{`

                    .column {
                        border-bottom: 1px solid black;
                    }
                `}</style>
            </Layout>
        );
    }
}

export default Transactions; 