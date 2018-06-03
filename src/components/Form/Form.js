import React, {Component} from 'react';
import styled from 'styled-components';
import 'font-awesome/css/font-awesome.min.css';

class formSubmit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            url: '',
            text: '',
            redirect: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.handleLoad();
    }

    // Calls the back-end to get the page for this id
    handleLoad() {
        console.log(this.state.url);
        const url = this.props.match.params.pageid;
        fetch(`http://localhost:3002/pages/${url}`, {
            method: 'GET'
        }).then((response) => {

            response.json().then((body) => {
                this.setState({
                    text: body.stacktrace,
                    url: url
                });
            });
        });
    };

    // Submits the form to the back-end
    // Back-end will return a generated url which acts as the key
    handleSubmit = (event) => {
        event.preventDefault(); // prevents page from auto refreshing after a submit

        if (this.state.text === '') {
            return;
        }

        fetch('http://localhost:3002/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: this.state.text
        }).then((response) => {

            response.json().then((body) => {
                window.location = '/pages/' + Object.keys(body);
            });
        }).catch((err) => {
            console.log("Service returned an error: " + err)
        });
    };

    handleChange = (event) => {
        this.setState({text: event.target.value});
    };

    handleFocus = (event) => {
        event.target.select();
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <Wrapper>
                        <Banner>
                            Generate a memorable url for long text items
                        </Banner>
                    </Wrapper>
                    <Wrapper>
                        {
                            (this.state.url !== undefined
                                && this.state.url !== '') ?
                                <TextInput value={window.location.href} onClick={this.handleFocus} readOnly
                                           size={window.location.href.length}/>
                                : null
                        }
                    </Wrapper>
                    <Wrapper>
                    <TextArea readOnly={this.state.url !== '' && this.state.url !== undefined} value={this.state.text}
                              onChange={this.handleChange}
                              placeholder={(this.state.url !== '' && this.state.url !== undefined)
                                  ? "This has been submitted and can no longer be edited"
                                  : "Ctrl + C, V or drag text here"}/>
                        <div>
                            <Button disabled={this.state.url !== '' && this.state.url !== undefined}>Upload</Button>
                        </div>
                    </Wrapper>
                </form>
                {
                    (this.state.url !== undefined
                        && this.state.url !== '') ?
                        <Header>
                            <i className="fa fa-check"/> This page has been submitted. You can copy the url and share
                            it.
                        </Header>
                        : null
                }
            </div>
        );
    }
}

const Wrapper = styled.section`
    display: flex;
    justify-content: center;
    margin: auto;
    width: calc(50vw);

`;

const Banner = styled.section`
    text-align: center;
    min-height: 34px;
    margin-top: 12px;
    letter-spacing: .6px;
    font-size: 24px;
`;


const TextArea = styled.textarea`
    background-color: #222727;
    color: #CFC3C3;
    border: 0px;
    margin: auto;
    width: 100%;
    float: right;
    resize: none;
    height: calc(80vh - 20px);
`;

const Button = styled.button`
        background: #222727;
        color: #CFC3C3;
        font-size: 12px;
        padding: 5px 20px;
        line-height: 20px;
        border: 1px solid #555959;
        float: right;
        margin-left: 10px;
        
        &:hover {
            background: #555A5A;
            color: #FFF;
            border: 1px solid #FFF;
            cursor: pointer;
        }
        
        &:disabled {
            background: #222727;
            border: 1px solid #555959;
            color: #CFC3C3;
        }
    `;

const TextInput = styled.input`
        background: #222727;
        color: #CFC3C3;
        font-size: 12px;
        padding: 5px 20px;
        line-height: 20px;
        border: 1px solid #555959;
        margin: 10px;
    `;

const Header = styled.section`
    position: absolute;
    top: 0px;
    left: 0px;
    background: tomato;
    color: #FFF;
    margin: auto;
    display: flex;
    justify-content: center;
    width:100%;
    padding: 15px;
`;

export default formSubmit;