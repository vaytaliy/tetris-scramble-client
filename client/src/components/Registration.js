import axios from 'axios'; 
import React, { useState } from 'react';

const Registration = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [emailInput, setEmailInput] = useState('');

    const handleUsernameChange = (newValue) => {
        setUsernameInput(newValue);
    }

    const handlePasswordChange = (newValue) => {
        setPasswordInput(newValue);
    }

    const handleEmailChange = (newValue) => {
        setEmailInput(newValue);
    }

    const sendRegisterUserForm = async () => {
        const user = {
            username: usernameInput,
            password: passwordInput,
            email: emailInput
        }
        
        const endpoint = `${process.env.REACT_APP_API_BASE_ADDRESS}/api/v1/auth/register`
        const res = await fetch(endpoint, 
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(user),
        });
        const parsedRes = await res.json();
        console.log(parsedRes);
    }

    return (
        <div>
            <br />
                Registration
            <br />
            <div>
                <label>Username</label>
                <input type="text" value={usernameInput} onChange={(e) => handleUsernameChange(e.target.value)} />
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={passwordInput} onChange={(e) => handlePasswordChange(e.target.value)} />
            </div>
            <div>
                <label>Email</label>
                <input type="email" value={emailInput} onChange={(e) => handleEmailChange(e.target.value)} />
            </div>
            <button onClick={sendRegisterUserForm}>Submit</button>
        </div>
    );
};

export default Registration;
