// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28; 

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable { 
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") Ownable(msg.sender) { 
        _mint(msg.sender, initialSupply); 
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Transfer tokens to multiple addresses in a single transaction
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to transfer (must match recipients length)
     */
    function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) public {
        require(recipients.length == amounts.length, "MyToken: arrays length mismatch");
        require(recipients.length > 0, "MyToken: empty arrays");

        for (uint256 i = 0; i < recipients.length; i++) {
            transfer(recipients[i], amounts[i]);
        }
    }
}