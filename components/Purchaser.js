import React, { Component } from "react";
import Router from "next/router";
import Fetch from "isomorphic-unfetch";
import Layout from "../components/Layout";
const API = process.env.REACT_APP_BACKEND;

class Purchaser extends Component {

    initialState = {
        ticker: "",
        quantity: ""
    }

    constructor(props) {
        super(props);

        this.state = {...this.initialState};
    }

    render() {
        return(
            <div className="buy-stock box">
                <form 
                    onSubmit={e => {
                        e.preventDefault();
                        this.props.buyStock(this.state);
                        this.setState({...this.initialState});
                        this.refs.ticker = "";
                        this.refs.quantity = "";
                    }
                }>
                    <div className="field">
                        <div className="control">
                            <input 
                                ref="ticker"
                                onChange={e => this.setState({ticker: e.target.value})}
                                className="input" 
                                type="text" 
                                name="ticker" 
                                placeholder="Ticker"
                            />
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <input 
                                ref="quantity"
                                onChange={e => this.setState({quantity: parseInt(e.target.value)})}
                                className="input" 
                                type="text"
                                name="quantity"
                                placeholder="Qty"
                            />
                        </div>
                    </div>
                    <div className="field is-grouped">
                        <div className="control">
                            <button type="submit" className="button is-link">Buy</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

export default Purchaser;


