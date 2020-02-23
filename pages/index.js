import React, { Component } from "react";
import Router from "next/router";
import fetch from 'isomorphic-unfetch';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import Link from "next/link";
import Layout from "../components/Layout";
const API = process.env.REACT_APP_BACKEND;

export default class Index extends Component {

    
    state = {
        email: "",
        password: "",
        errors: ""
    }
    
    constructor(props) {
        super(props)
    }
    
    componentDidMount = () => {

        const authToken = localStorage.getItem('auth_token');
        
        if (authToken && authToken.includes("Bearer")) {
            
            Router.push('/portfolio');
        }
    }

    /*
      Handle when the user logs in and if we get a jwt token store it in
      localstorage and reroute to portfolio page 
    */
    handleSubmit = (e) => {

        e.preventDefault();
                

        fetch(`${process.env.REACT_APP_BACKEND}/api/auth/login`, {
            method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: this.state.email,
            password: this.state.password
        })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {

                localStorage.setItem('auth_token', data.token);
                Router.push('/portfolio');
              }
              else
              this.setState({errors: data.message});
              
            });       
          }
          
          render() {
            

        return (
          <Layout>
            <h1 className="title is-1">Sign in</h1>
            <div className="Signin box">
                {this.state.errors ? <div style={{color: "red"}}>{this.state.errors}</div> : ""}
                <form onSubmit={this.handleSubmit}>
                    <div className="field">
                        <div className="control">
                            <input 
                                onChange={e => this.setState({email: e.target.value})}
                                className="input"
                                type="email" 
                                name="email" 
                                placeholder="e-mail"
                            />
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <input 
                                ref="quantity"
                                onChange={e => this.setState({password: e.target.value})}
                                className="input" 
                                type="password"
                                name="password"
                                placeholder="password"
                            />
                        </div>
                    </div>
                    <div className="field is-grouped">
                        <div className="control">
                            <button type="submit" className="button is-link">Sign in</button>
                        </div>
                    </div>
                </form>
                <Link href="/register"><a>Register</a></Link>
            </div>
          </Layout>
        );
    }

}