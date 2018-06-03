import React, {Component} from 'react';
import Explore from "../Explore/Explore";
import Form from "../Form/Form";
import {BrowserRouter as Router, Link, Route} from 'react-router-dom'

class Navigation extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <div>
                    <nav>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/explore">Explore</Link></li>
                    </nav>
                    <Route path="/" component={Form} />
                    <Route path="/explore" component={Explore} />
                </div>
            </Router>
        );
    }
}



export default Navigation;