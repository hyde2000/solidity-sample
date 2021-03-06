// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract Ownable {
    address payable _owner;

    constructor() public {
        _owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "You are not the owner");
        _;
    }

    function isOwner() public view returns (bool) {
        return (msg.sender == _owner);
    }
}
