import React, { Component } from "react";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
import Purchaser from "../components/Purchaser";
const API = process.env.REACT_APP_BACKEND;

class Portfolio extends Component {

    state = {
        portfolio: [],
        total: 0,
        balance: -1,
        bought: false,
        error: ""
    }

    constructor(props) {
        super(props);
    }
    
    /* 
        Fetch portfolio data for this api,
        this sets the portfolio array when each ticker appears once,
        also get the total value of all stocks and the current users balance which we will render later
    */
    fetchPortfolio = () => {
        
        const router = Router;
    
        const authToken = localStorage.getItem('auth_token');
    
        if (!authToken || !authToken.includes("Bearer")) {
    
            router.push('/');
        }
        else {
            // get the portfolio for current user
            fetch(`${API}/api/portfolio`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": authToken
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success)
                    this.setState({portfolio: data.portfolio, total: data.total, balance: data.balance.toFixed(2)});
                else
                    this.setState({error: data.message});
            });     
        }

    }

    componentDidMount() {

        this.fetchPortfolio();
    }
    
    /*
        bought state variable is false after everytime we fetch portfolio data.
        If we have not fetched portfolio data and we just bought something, lets fetch
        the data and set bought to false so this update does not create an infiinite loop
    */
    componentDidUpdate(prevProps, prevState) {

        if (this.state.bought == true && prevState.bought == false) {

            this.setState({bought: false});
            this.fetchPortfolio();
        }
    }

    /* 
        Post the ticker and quantity that the user wants to purchase
        to POST api/transctions endpoint
        return success boolean and set a bought boolean so we update the
        portfolio on page
    */
    buyStock = (stock) => {


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
                this.setState({bought: true, error: ""})
            }
            else {
                this.setState({error: data.message});
            }
        });
    }

    /* 
        Get the performance indicator for everystock and return the appropriate text
        color for that stock to appear in
    */
    getPerformance(performance) {
        switch(performance) {
            case "ls":
                return "has-text-danger"
            case "gt":
                return "has-text-success"
            case "eq":
                return "has-text-grey"
        }
    }

    render() {
        return (
            <Layout>
                {this.state.error ? <h6 className="title is-6 help is-danger">{this.state.error}</h6> : ""}
                <h1 className="title is-1">Portfolio {this.state.total ? `($${this.state.total.toFixed(2)})` : ""}</h1>
                <div className="columns">
                    <div className="column">
                            {
                                this.state.portfolio.length > 0 ?
                                this.state.portfolio.map(
                                    (stock, index) => 
                                    <div 
                                        className={`columns ${this.getPerformance(stock.performance)}`}
                                        key={index}>
                                        <div className="column portfolio-content is-9 is-size-4">{`${stock.ticker} - ${stock.quantity} Shares`}</div>
                                        <div className="column portfolio-content is-3 is-size-4">{`$${stock.value.toFixed(2)}`}</div>
                                    </div>
                                    )
                                    :
                                    "No stocks yet"
                                }
                    </div>
                    <div className="column">
                            <h1 className="title is-1">{this.state.balance >= 0 ? `Cash - $${this.state.balance}` : ""}</h1>
                        
                        <Purchaser buyStock={this.buyStock} />        
                    </div>
                </div>
                <style jsx>{`
                    .portfolio-content {
                        border-bottom: 1px solid black;
                    }
                `}</style>
            </Layout>
        );
    }
}

export default Portfolio; 