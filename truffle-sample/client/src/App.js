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
      this.itemManager.options.address =
        "0x54a68A5fE4A12e0767C2387F4b654C2ca07D74AE";

      this.item = new this.web3.eth.Contract(
        Item.abi,
        Item.networks[this.networkId] && Item.networks[this.networkId].address
      );
      this.item.options.address = "0x54a68A5fE4A12e0767C2387F4b654C2ca07D74AE";

      this.listenToPaymentEvent();
      this.setState({ loaded: true }, this.runExample);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  listenToPaymentEvent = () => {
    this.itemManager.events.SupplyChainStep().on("data", async (e) => {
      console.log(e);

      let itemObj = this.itemManager.methods
        .items(e.returnValues._itemIndex)
        .call();
      console.log(itemObj);
    });
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
    let res = await this.itemManager.methods
      .createItem(itemName, cost)
      .send({ from: this.accounts[0] });
    console.log(res);
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
