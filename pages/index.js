import React, { Component } from "react";
import Router from "next/router";
import fetch from 'isomorphic-unfetch';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import Link from "next/link";
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
          <div className="Login">
            {this.state.errors ? <div style={{color: "red"}}>{this.state.errors}</div> : ""}
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
            <Link href="/register"> Signup </Link>
          </div>
        );
    }

}