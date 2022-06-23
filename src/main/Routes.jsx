import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/Home'
import EventoCrud from '../components/evento/EventoCrud'

export default props =>
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/eventos' component={EventoCrud} />
        <Redirect from='*' to='/' />
    </Switch>