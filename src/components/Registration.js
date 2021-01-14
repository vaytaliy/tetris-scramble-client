import axios from 'axios';
import React, { useState } from 'react';

const Registration = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    const handleUsernameChange = (newValue) => {
        setUsernameInput(newValue);
    }

    const handlePasswordChange = (newValue) => {
        setPasswordInput(newValue);
    }

    const sendRegisterUserForm = async () => {
        const res = await axios.post('http://localhost:8079/register',
            {
                username: usernameInput,
                password: passwordInput
            });
        console.log(res);
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
            <button onClick={sendRegisterUserForm}>Submit</button>
        </div>
    );
};

export default Registration;