import React, { Component } from "react";
import Router from "next/router";
import fetch from 'isomorphic-unfetch';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import Portfolio from "./portfolio";
const API = process.env.REACT_APP_BACKEND;

export default class Login extends Component {

    
    state = {
        email: "",
        password: "",
        loggedin: false
    }
    
    constructor(props) {
        super(props)
    }
    
    componentDidMount = () => {
        
        if (localStorage.getItem('auth_token')) {
            
            Router.push('/portfolio');
        }
    }


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
            localStorage.setItem('auth_token', data.token);
            Router.push('/portfolio');
        });       
    }

    render() {

        return (
          <div className="Login">
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="email" bsSize="large">
                <FormLabel>Email</FormLabel>
                <FormControl
                  autoFocus
                  type="email"
                  onChange={e => this.setState({email: e.target.value})}
                />
              </FormGroup>
              <FormGroup controlId="password" bsSize="large">
                <FormLabel>Password</FormLabel>
                <FormControl
                  onChange={e => this.setState({password: e.target.value})}
                  type="password"
                />
              </FormGroup>
              <Button block bsSize="large" type="submit" >
                Login
              </Button>
            </form>
          </div>
        );
    }

}