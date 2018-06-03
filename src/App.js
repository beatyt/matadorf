import React from 'react';
import './App.css';
import Form from "./components/Form/Form";
import Explore from "./components/Explore/Explore";
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import styled from 'styled-components';
import StyledLink from './components/StyledLink/StyledLink'
import 'font-awesome/css/font-awesome.min.css';
import logo from './matadorf.png';

const App = () => (
    <Router>
        <Wrapper>
            <StyledLink to="/">
                <Logo>
                    <div>
                        <img src={logo} alt="logo"/>
                    </div>
                    <div>
                        <h1>
                            Matadorf
                        </h1>
                    </div>
                    <div>
                        <h2>
                            url shortener
                        </h2>
                    </div>
                </Logo>
            </StyledLink>
            <Nav>
                <ButtonLink to="/explore">
                    <i className="fa fa-coffee"/>Explore
                </ButtonLink>
            </Nav>
            <Route path="/explore" component={Explore}/>
            <Route exact path="/" component={Form}/>
            <Route path="/pages/:pageid" component={Form}/>
        </Wrapper>
    </Router>
);

const Wrapper = styled.section`
    padding: 4em;
    color: #CFC3C3;
    background-color: #3F4545;
    height: calc(100vh);
    
    i {
        margin: auto 5px;
    }
`;

const ButtonLink = styled(Link)`
    color: #FFF;
    text-decoration: none;
    margin: auto;
    background: #70D534;
    border: 0px;
    padding: 3px 10px;
    color: #FFF;
    font-size: 15px;
    font-weight: 700;
    padding: 10px 15px;
    
   &:hover {
       background: #7FE046;
       color: #FFF;
   }
`;

const Nav = styled.section`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
`;

const Logo = styled.section`
    display: grid;
    width: 240px;
    text-align: center;
    
    h1 {
        margin: 0px;
        font-size: 24px
        color: #dbc190;
    }
    
    h2 {
        margin: 0px;
        font-size: 15px;
    }
    
    img {
        width: 120px;
    }
`;

export default App;
