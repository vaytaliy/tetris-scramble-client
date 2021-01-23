import axios from 'axios';
import React, {useState} from 'react';
import Landing from './Landing';
import Registration from './Registration';
import Login from './Login';
import join from '../game/online/publicRoom';

//[TBD]
// throw connecting to game logic into separate module
//
//
//

const App = () => {
    
    
    return (
        <div>
            {/* This is the root container for other components
            <button onClick={join}>Test connect</button>   
            <Registration />
            <Login /> */}
            <Landing />
        </div>
    );
};

export default App;