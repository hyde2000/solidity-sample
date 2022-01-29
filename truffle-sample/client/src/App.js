import React, { Component } from "react";

import Item from "./contracts/Item.json";
import ItemManager from "./contracts/ItemManager.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, cost: 0, itemName: "example_1" };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.itemManager = new this.web3.eth.Contract(
        ItemManager.abi,
        ItemManager.networks[this.networkId] &&
          ItemManager.networks[this.networkId].address
      );

      this.item = new this.web3.eth.Contract(
        Item.abi,
        Item.networks[this.networkId] && Item.networks[this.networkId].address
      );

      this.setState({ loaded: true }, this.runExample);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  handlerInputChange = (e) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async () => {
    const { cost, itemName } = this.state;
    await this.itemManager.methods
      .createItem(itemName, cost)
      .send({ from: this.accounts[0] });
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Event Trigger / Supply Chain Example</h1>
        <h2>Items</h2>
        <h2>Add Items</h2>
        Cost in wei:
        <input
          type="text"
          className="form-control mb-2 mr-sm-2"
          name="cost"
          value={this.state.cost}
          onChange={this.handlerInputChange}
        />
        Item Identifier:{" "}
        <input
          type="text"
          className="form-control mb-2 mr-sm-2"
          name="itemName"
          value={this.state.itemName}
          onChange={this.handlerInputChange}
        />
        <button
          type="button"
          className="btn btn-primary"
          data-toggle="modal"
          onClick={this.handleSubmit}
        >
          Create new Item
        </button>
      </div>
    );
  }
}

export default App;
