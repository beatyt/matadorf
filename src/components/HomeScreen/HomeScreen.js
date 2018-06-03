import React, {Component} from 'react';

class HomeScreen extends React.Component {
    static navigatonOptions = {
        title: 'Welcome'
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <div>
                Hello World
            </div>
        )
    }
}

export default HomeScreen;