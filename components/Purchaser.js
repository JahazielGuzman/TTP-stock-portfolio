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

    validInput() {

        if (!this.state.ticker || !this.state.quantity)
            return false;
        
        return this.state.quantity.toFixed(2).split(".")[1] === "00";
    }

    render() {
        return(
            <div className="buy-stock box">
                <form 
                    onSubmit={e => {
                        e.preventDefault();
                        this.props.buyStock(this.state);
                        this.setState({...this.initialState});
                        this.refs.ticker.value = "";
                        this.refs.quantity.value = "";
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
                                onChange={e => this.setState({quantity: parseFloat(e.target.value)})}
                                className="input" 
                                type="text"
                                name="quantity"
                                placeholder="Qty"
                            />
                        </div>
                    </div>
                    <div className="field is-grouped">
                        <div className="control">
                            <button type="submit" disabled={!this.validInput()} className="button is-link">Buy</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

export default Purchaser;


