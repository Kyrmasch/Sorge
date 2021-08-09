import React, { Component } from 'react';
import { Route } from 'react-router';
import wss from 'socket.io-client';
import Home from './Home'
import Login from './Login';
import Settings from './Settings';
import Maps from './Maps';

export default function App() {
    return (
        <React.Fragment>
            <Route exact path='/' component={Home}/>
            <Route exact path='/parser' component={Home}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/maps' component={Maps}/>
            <Route exact path='/settings' component={Settings}/>
        </React.Fragment>
    );
}
