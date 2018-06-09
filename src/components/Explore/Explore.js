import React, {Component} from 'react';
import StyledLink from '../StyledLink/StyledLink'
import styled from "styled-components";

class Explore extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: {}
        };

        this.handleLoad = this.handleLoad.bind(this);
    };

    componentDidMount() {
        // window.addEventListener('load', this.handleLoad);
        this.handleLoad();
    }

    handleLoad() {
        fetch(`${process.env.REACT_APP_API_HOST}/explore`, {
            method: 'GET'
        }).then((response) => {

            response.json().then((body) => {
                this.setState({
                    data: body
                });
            }).catch((err) => {
                console.log("The API returned an error response: " + err)
            });
        });
    };

    render() {
        function List(props) {
            if (props.list.pages === undefined) {
                return null;
            }
            const list = props.list.pages;
            // Not recommended to use index as the key.
            // Better would have each element having an id
            if (list === null
            || list.length < 1) {
                return <div>The API did not return any items. It is possible that no items exist or the service is down.</div>
            }

            const items = Object.keys(list).map((item) => {
                    return (
                        <Tag>
                            <StyledLink to={"/pages/" + item}>
                                <TagHeader>
                                    {item}
                                </TagHeader>
                                <TagBody>
                                    {list[item].stacktrace}
                                </TagBody>
                            </StyledLink>
                        </Tag>
                    );
                }
            );
            return <TagContainer>{items}</TagContainer>
        }

        return (
            <List list={this.state.data}/>
        );
    }
}

const TagContainer = styled.section`
    margin-top: 20px;
    display: grid;
    grid-gap: 64px;
    grid-template-columns: repeat(4, 1fr);
    justify-content: start;
`;

const Tag = styled.section`
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: auto;
`;

const TagHeader = styled.section`
  margin-top: auto;
  padding: 10px;
  text-align: center;
  background: #38820C;
`;

const TagBody = styled.section`
  padding: 10px 25px;
  background: #222727;
`;

export default Explore;