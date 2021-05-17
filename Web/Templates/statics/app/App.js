import React, { Component } from 'react';
import { Route } from 'react-router';
import Home from './Home'


export default function App() {
    return (
        <div>
            <Route exact path='/' component={Home} />
        </div>
    );
}
