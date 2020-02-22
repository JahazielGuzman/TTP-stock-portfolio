import React, { Component } from "react";
import Router from "next/router";
import fetch from 'isomorphic-unfetch';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import Portfolio from "./portfolio";
const API = process.env.REACT_APP_BACKEND;

class Register extends Component {


    state = {
        name: "",
        email: "",
        password: "",
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


            fetch(`${API}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: this.state.name,
                    email: this.state.email,
                    password: this.state.password
                })
                })
                .then(res => res.json())
                .then(data => {
                    Router.push('/');
                });       
    }

    render() {


        return (
          <div className="Login">
            <form onSubmit={this.handleSubmit}>
              <FormGroup controlId="name">
                <FormLabel>Name</FormLabel>
                <FormControl
                  autoFocus
                  type="text"
                  onChange={e => this.setState({name: e.target.value})}
                />
              </FormGroup>
              <FormGroup controlId="email">
                <FormLabel>Email</FormLabel>
                <FormControl
                  autoFocus
                  type="email"
                  onChange={e => this.setState({email: e.target.value})}
                />
              </FormGroup>              
              <FormGroup controlId="password">
                <FormLabel>Password</FormLabel>
                <FormControl
                  onChange={e => this.setState({password: e.target.value})}
                  type="password"
                />
              </FormGroup>
              <Button block type="submit" >
                Login
              </Button>
            </form>
          </div>
        );
    }

}

export default Register; 