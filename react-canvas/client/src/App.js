import React, { Component } from "react";
import "./index.css";

class App extends Component {
  state = {
    response: "",
    dataFromFile: "",
  };

  callApi = async () => {
    const response = await fetch("/api/file");
    const body = await response.json();
    console.log(body);
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getFileData = async () => {
    this.callApi()
      .then((res) => {
        this.setState({ dataFromFile: res.express });
      })
      .catch((err) => console.log(err));
  };

  workWithFileData() {
    console.log("tut");
    console.log(this.state.dataFromFile && this.state.dataFromFile);
  }

  render() {
    const listItems =
      this.state.dataFromFile &&
      this.state.dataFromFile.map((line) => (
        <div className="main">
          {line.map((el) => (
            <div className="item">{el}</div>
          ))}
          <br />
        </div>
      ));
    return (
      <div className="App">
        {this.state.dataFromFile ? <p>Result of drawing:</p> : null}
        <div className="container">{listItems}</div>
        {this.state.dataFromFile ? null : (
          <button onClick={() => this.getFileData()}>Draw Canvas</button>
        )}
      </div>
    );
  }
}
export default App;
