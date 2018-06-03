import React, { Component } from 'react';

class uploadMyFile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name : '',
            text : '',
            forwardUrl: ''
        };

        this.handleUploadFile = this.handleUploadFile.bind(this);
    }

    handleUploadFile = (event) => {
        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);

        fetch('http://localhost:3002/upload', {
           method: 'POST',
           body: data
        }).then((response) => {
            response.json().then((body) => {
                console.log(body);
                this.setState({
                    name: body.name,
                    forwardUrl: `http://lolcahost:3002/${body.url}`,
                    text: body
                });
            });
        });
    };

    render() {
        return (
          <form onSubmit={this.handleUploadFile}>
              <div>
                  <input ref={(ref) => {this.uploadInput = ref;}} type="file"/>
              </div>
              <br />
              <div>
                  <button>Upload</button>
              </div>
              <div>name = {this.state.name}</div>
              <div>text = {this.state.text}</div>
              <img src={this.state.forwardUrl} alt="img" />
          </form>
        );
    }
}

export default uploadMyFile;