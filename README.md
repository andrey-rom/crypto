# MyToken - ERC20 Token Project

A Hardhat-based project for creating and managing a custom ERC20 token implementation.

## Description

This project implements a fully functional ERC20 token with additional features:
- Standard ERC20 functions (transfer, approve, transferFrom)
- Token minting functionality (owner-restricted)
- Batch transfer capability
- Comprehensive test coverage

## Prerequisites

The following software is required to run this project:

- Node.js (version 16 or higher)
- npm or yarn package manager
- Git version control system

## Installation

1. Navigate to the project directory:
```bash
cd crypto
```

2. Install project dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root directory with the following variables:
```env
PRIVATE_KEY=your_private_key_here
OPTIMISM_SEPOLIA_URL=https://sepolia.optimism.io
```

## Project Structure

```
crypto/
├── contracts/
│   ├── MyToken.sol          # Main token contract
│   └── Lock.sol             # Example contract (Hardhat template)
├── scripts/
│   └── deploy.js            # Contract deployment script
├── test/
│   ├── MyToken.js           # MyToken contract tests
│   └── Lock.js              # Lock contract tests
├── hardhat.config.js        # Hardhat configuration
└── package.json             # Project dependencies
```

## Usage

### Compiling Contracts

To compile the Solidity contracts:

```bash
npx hardhat compile
```

### Running Tests

Execute the test suite using the following commands:

```bash
# Run all tests
npm test

# Run tests with gas reporting
REPORT_GAS=true npm test

# Run specific test file
npm test -- test/MyToken.js
```

### Deploying Contracts

#### Local Network (Hardhat Network)

1. Start a local Hardhat node:
```bash
npx hardhat node
```

2. In a separate terminal, deploy the contract:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

#### Optimism Sepolia Testnet

Deploy to the Optimism Sepolia test network:

```bash
npx hardhat run scripts/deploy.js --network sepoliaOptimism
```

### Additional Commands

```bash
# Display available Hardhat commands
npx hardhat help

# Start local blockchain node
npx hardhat node

# Run code checks
npx hardhat check
```

## Contract Documentation

### MyToken Contract

The MyToken contract implements the ERC20 standard with additional functionality.

#### Constructor

```solidity
constructor(uint256 initialSupply)
```

- Initializes the token with name "MyToken" and symbol "MTK"
- Mints the initial supply to the contract deployer

#### Mint Function

```solidity
function mint(address to, uint256 amount) public onlyOwner
```

- Creates new tokens and assigns them to the specified address
- Restricted to contract owner only

#### Batch Transfer Function

```solidity
function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) public
```

- Enables transferring tokens to multiple addresses in a single transaction
- The `recipients` and `amounts` arrays must have equal length

#### Standard ERC20 Functions

The contract inherits standard ERC20 functionality:

- `transfer(address to, uint256 amount)` - Transfer tokens to an address
- `transferFrom(address from, address to, uint256 amount)` - Transfer tokens with approval
- `approve(address spender, uint256 amount)` - Approve token spending
- `balanceOf(address account)` - Query account balance
- `totalSupply()` - Get total token supply
- `name()` - Returns token name ("MyToken")
- `symbol()` - Returns token symbol ("MTK")
- `decimals()` - Returns token decimals (18)

## Testing

The project includes comprehensive test coverage for:

- Contract deployment
- Basic token transfers
- Approvals and transferFrom operations
- Token minting functionality
- Batch transfer operations
- Edge cases including:
  - Transfers exceeding balance
  - Transfers to zero address
  - Zero amount transfers
  - Multiple sequential transfers
  - Additional boundary conditions

### Running Tests

```bash
# Execute all tests
npm test

# Run MyToken tests only
npm test -- test/MyToken.js

# Run tests with gas consumption report
REPORT_GAS=true npm test
```

## Network Configuration

The project is configured to work with the following networks:

- **Hardhat Network** (localhost) - For development and testing
- **Optimism Sepolia** - Optimism test network

To add additional networks, modify the `hardhat.config.js` file.

## Dependencies

Project dependencies include:

- **Hardhat** - Ethereum development environment
- **OpenZeppelin Contracts** - Secure smart contract library
- **Ethers.js** - Ethereum interaction library
- **Chai** - Testing assertion library
- **Mocha** - JavaScript test framework

## Security Considerations

The contract implementation includes the following security measures:

- Utilizes audited OpenZeppelin contract libraries
- Minting function restricted to contract owner
- All transfers validate balance and address validity
- Comprehensive test coverage including edge cases

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [ERC20 Standard](https://eips.ethereum.org/EIPS/eip-20)
- [Solidity Documentation](https://docs.soliditylang.org/)

## Contributing

Contributions, improvements, and suggestions are welcome. Please create issues and submit pull requests for review.

## License

UNLICENSED

---

**Note:** This project is intended for educational purposes. Before using in production, ensure a comprehensive security audit is conducted.
