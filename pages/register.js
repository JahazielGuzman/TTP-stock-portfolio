import React, { Component } from "react";
import Router from "next/router";
import fetch from 'isomorphic-unfetch';
import Layout from "../components/Layout";
import Link from "next/link";
const API = process.env.REACT_APP_BACKEND;

class Register extends Component {


    state = {
        name: "",
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
                    if (data.success) {
                      Router.push('/');
                    }
                    else {
                      this.setState({errors: data.message});
                    }
                });       
    }

    render() {

        return (
          <Layout>
            <h1 className="title is-1">Register</h1>
            <div className="Register box">
                {this.state.errors ? <div style={{color: "red"}}>{this.state.errors}</div> : ""}
                <form onSubmit={this.handleSubmit}>              
                    <div className="field">
                        <div className="control">
                            <input 
                                onChange={e => this.setState({name: e.target.value})}
                                className="input"
                                type="text" 
                                name="name" 
                                placeholder="name"
                            />
                        </div>
                    </div>
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
                            <button type="submit" className="button is-link">Register</button>
                        </div>
                    </div>
                </form>
                <Link href="/"><a>Login</a></Link>
            </div>
          </Layout>
        );
    }

}

export default Register; 