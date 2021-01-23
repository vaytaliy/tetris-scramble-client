import React, { Component } from 'react'
import {users} from './DummyUsers'
import Table from './Table';
import "./Landing.css";

class Landing extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : true
        }
    }
    render(){
        const authContainer = this.state.isLoggedIn ? (
            <div className="auth-container">
            <button>Logout</button>
            <div className="user-profile">
                <img className="user-avatar" src="./image-victor.jpg" alt="user-avatar" />
                <p className="user-name">Victor</p>
            </div>
        </div>
        ):(
            <div className="auth-container"><button>Register</button><button>LogIn</button></div>
        )
        return <div className="Landing">
            <div className="container">
            <nav className="navigation">
                <div className="logo">LOGO</div>
                {authContainer}
            </nav>
            <section className="stats-container">
                <div className="stats-table">
                    <h3 className="table-title">Top of this week</h3>
                    <Table users={users} />
                </div>
                <div className="stats-table">
                    <h3 className="table-title">Best All Time</h3>
                    <Table users={users} />
                </div>
                <div className="stats-table">
                    <h3 className="table-title">Top Today</h3>
                    <Table users={users} />
                </div>
            </section>
            <section className="button-container">
                <button>Online Random</button>
                <button>Online Invite</button>
                <button>Tournament</button>
                <button>SinglePlayer</button>
            </section>
            <section className="active-player-container">
                <div className="current-active">
                    <p className="count">24668</p>
                    <p>Active Players</p>
                </div>
            </section>
            </div>
        </div>
    }
}

export default Landing;