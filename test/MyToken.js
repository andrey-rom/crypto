const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let MyToken;
  let myToken;
  let deployer;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [deployer, addr1, addr2] = await ethers.getSigners();
    MyToken = await ethers.getContractFactory("MyToken");
  });

  describe("Deployment", function () {
    it("Should deploy with correct initial supply", async function () {
      const initialSupply = ethers.parseEther("1000000");
      myToken = await MyToken.deploy(initialSupply);
      await myToken.waitForDeployment();

      expect(await myToken.balanceOf(deployer.address)).to.equal(initialSupply);
    });

    it("Should set the correct token name", async function () {
      const initialSupply = ethers.parseEther("1000000");
      myToken = await MyToken.deploy(initialSupply);
      await myToken.waitForDeployment();

      expect(await myToken.name()).to.equal("MyToken");
    });

    it("Should set the correct token symbol", async function () {
      const initialSupply = ethers.parseEther("1000000");
      myToken = await MyToken.deploy(initialSupply);
      await myToken.waitForDeployment();

      expect(await myToken.symbol()).to.equal("MTK");
    });

    it("Should set the correct decimals", async function () {
      const initialSupply = ethers.parseEther("1000000");
      myToken = await MyToken.deploy(initialSupply);
      await myToken.waitForDeployment();

      expect(await myToken.decimals()).to.equal(18);
    });

    it("Should set the correct total supply", async function () {
      const initialSupply = ethers.parseEther("1000000");
      myToken = await MyToken.deploy(initialSupply);
      await myToken.waitForDeployment();

      expect(await myToken.totalSupply()).to.equal(initialSupply);
    });
  });

  describe("Transfers", function () {
    beforeEach(async function () {
      const initialSupply = ethers.parseEther("1000000");
      myToken = await MyToken.deploy(initialSupply);
      await myToken.waitForDeployment();
    });

    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseEther("100");
      
      await myToken.transfer(addr1.address, transferAmount);
      
      expect(await myToken.balanceOf(addr1.address)).to.equal(transferAmount);
    });

    it("Should update balances after transfer", async function () {
      const initialBalance = await myToken.balanceOf(deployer.address);
      const transferAmount = ethers.parseEther("50");
      
      await myToken.transfer(addr1.address, transferAmount);
      
      expect(await myToken.balanceOf(deployer.address)).to.equal(
        initialBalance - transferAmount
      );
      expect(await myToken.balanceOf(addr1.address)).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialBalance = await myToken.balanceOf(addr1.address);
      const transferAmount = ethers.parseEther("1");

      await expect(
        myToken.connect(addr1).transfer(addr2.address, transferAmount)
      ).to.be.reverted;
    });

    it("Should emit Transfer event", async function () {
      const transferAmount = ethers.parseEther("100");

      await expect(myToken.transfer(addr1.address, transferAmount))
        .to.emit(myToken, "Transfer")
        .withArgs(deployer.address, addr1.address, transferAmount);
    });
  });

  describe("Approvals", function () {
    beforeEach(async function () {
      const initialSupply = ethers.parseEther("1000000");
      myToken = await MyToken.deploy(initialSupply);
      await myToken.waitForDeployment();
    });

    it("Should allow approval of tokens", async function () {
      const approveAmount = ethers.parseEther("100");
      
      await myToken.approve(addr1.address, approveAmount);
      
      expect(await myToken.allowance(deployer.address, addr1.address)).to.equal(
        approveAmount
      );
    });

    it("Should emit Approval event", async function () {
      const approveAmount = ethers.parseEther("100");

      await expect(myToken.approve(addr1.address, approveAmount))
        .to.emit(myToken, "Approval")
        .withArgs(deployer.address, addr1.address, approveAmount);
    });
  });

  describe("TransferFrom", function () {
    beforeEach(async function () {
      const initialSupply = ethers.parseEther("1000000");
      myToken = await MyToken.deploy(initialSupply);
      await myToken.waitForDeployment();
    });

    it("Should allow transferFrom with approval", async function () {
      const approveAmount = ethers.parseEther("100");
      const transferAmount = ethers.parseEther("50");

      await myToken.approve(addr1.address, approveAmount);
      await myToken.connect(addr1).transferFrom(
        deployer.address,
        addr2.address,
        transferAmount
      );

      expect(await myToken.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await myToken.allowance(deployer.address, addr1.address)).to.equal(
        approveAmount - transferAmount
      );
    });

    it("Should fail transferFrom without approval", async function () {
      const transferAmount = ethers.parseEther("50");

      await expect(
        myToken.connect(addr1).transferFrom(
          deployer.address,
          addr2.address,
          transferAmount
        )
      ).to.be.reverted;
    });

    it("Should fail transferFrom with insufficient allowance", async function () {
      const approveAmount = ethers.parseEther("50");
      const transferAmount = ethers.parseEther("100");

      await myToken.approve(addr1.address, approveAmount);

      await expect(
        myToken.connect(addr1).transferFrom(
          deployer.address,
          addr2.address,
          transferAmount
        )
      ).to.be.reverted;
    });
  });

  describe("Minting", function () {
    beforeEach(async function () {
      const initialSupply = ethers.parseEther("1000000");
      myToken = await MyToken.deploy(initialSupply);
      await myToken.waitForDeployment();
    });

    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseEther("50000");
      const initialBalance = await myToken.balanceOf(addr1.address);
      const initialSupply = await myToken.totalSupply();

      await myToken.mint(addr1.address, mintAmount);

      expect(await myToken.balanceOf(addr1.address)).to.equal(
        initialBalance + mintAmount
      );
      expect(await myToken.totalSupply()).to.equal(initialSupply + mintAmount);
    });

    it("Should fail if non-owner tries to mint", async function () {
      const mintAmount = ethers.parseEther("50000");

      await expect(
        myToken.connect(addr1).mint(addr2.address, mintAmount)
      ).to.be.reverted;
    });

    it("Should emit Transfer event when minting", async function () {
      const mintAmount = ethers.parseEther("10000");
      const zeroAddress = "0x0000000000000000000000000000000000000000";

      await expect(myToken.mint(addr1.address, mintAmount))
        .to.emit(myToken, "Transfer")
        .withArgs(zeroAddress, addr1.address, mintAmount);
    });

    it("Should allow owner to mint to multiple addresses", async function () {
      const mintAmount1 = ethers.parseEther("10000");
      const mintAmount2 = ethers.parseEther("20000");

      await myToken.mint(addr1.address, mintAmount1);
      await myToken.mint(addr2.address, mintAmount2);

      expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount1);
      expect(await myToken.balanceOf(addr2.address)).to.equal(mintAmount2);
    });

    it("Should update total supply correctly after multiple mints", async function () {
      const initialSupply = await myToken.totalSupply();
      const mintAmount1 = ethers.parseEther("10000");
      const mintAmount2 = ethers.parseEther("20000");

      await myToken.mint(addr1.address, mintAmount1);
      await myToken.mint(addr2.address, mintAmount2);

      expect(await myToken.totalSupply()).to.equal(
        initialSupply + mintAmount1 + mintAmount2
      );
    });
  });

  describe("Batch Transfers", function () {
    beforeEach(async function () {
      const initialSupply = ethers.parseEther("1000000");
      myToken = await MyToken.deploy(initialSupply);
      await myToken.waitForDeployment();
    });

    it("Should transfer tokens to multiple recipients", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [
        ethers.parseEther("100"),
        ethers.parseEther("200")
      ];

      await myToken.batchTransfer(recipients, amounts);

      expect(await myToken.balanceOf(addr1.address)).to.equal(amounts[0]);
      expect(await myToken.balanceOf(addr2.address)).to.equal(amounts[1]);
    });

    it("Should update sender balance correctly after batch transfer", async function () {
      const initialBalance = await myToken.balanceOf(deployer.address);
      const recipients = [addr1.address, addr2.address];
      const amounts = [
        ethers.parseEther("100"),
        ethers.parseEther("200")
      ];
      const totalTransferred = amounts[0] + amounts[1];

      await myToken.batchTransfer(recipients, amounts);

      expect(await myToken.balanceOf(deployer.address)).to.equal(
        initialBalance - totalTransferred
      );
    });

    it("Should fail if arrays length mismatch", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [ethers.parseEther("100")]; // Only one amount for two recipients

      await expect(
        myToken.batchTransfer(recipients, amounts)
      ).to.be.revertedWith("MyToken: arrays length mismatch");
    });

    it("Should fail if arrays are empty", async function () {
      const recipients = [];
      const amounts = [];

      await expect(
        myToken.batchTransfer(recipients, amounts)
      ).to.be.revertedWith("MyToken: empty arrays");
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const recipients = [addr2.address];
      const largeAmount = ethers.parseEther("2000000"); // More than initial supply

      await expect(
        myToken.batchTransfer(recipients, [largeAmount])
      ).to.be.reverted;
    });

    it("Should handle single recipient in batch transfer", async function () {
      const recipients = [addr1.address];
      const amounts = [ethers.parseEther("500")];

      await myToken.batchTransfer(recipients, amounts);

      expect(await myToken.balanceOf(addr1.address)).to.equal(amounts[0]);
    });

    it("Should emit Transfer events for each transfer in batch", async function () {
      const recipients = [addr1.address, addr2.address];
      const amounts = [
        ethers.parseEther("100"),
        ethers.parseEther("200")
      ];

      const tx = await myToken.batchTransfer(recipients, amounts);
      const receipt = await tx.wait();

      // Check that Transfer events were emitted
      const transferEvents = receipt.logs.filter(
        (log) => log.topics[0] === ethers.id("Transfer(address,address,uint256)")
      );
      
      expect(transferEvents.length).to.equal(2);
    });
  });

  describe("Edge Cases", function () {
    beforeEach(async function () {
      const initialSupply = ethers.parseEther("1000000");
      myToken = await MyToken.deploy(initialSupply);
      await myToken.waitForDeployment();
    });

    describe("Transfer Edge Cases", function () {
      it("Should fail when transferring more than available balance", async function () {
        const balance = await myToken.balanceOf(deployer.address);
        const excessAmount = balance + ethers.parseEther("1");

        await expect(
          myToken.transfer(addr1.address, excessAmount)
        ).to.be.reverted;
      });

      it("Should fail when transferring exactly one wei more than balance", async function () {
        const balance = await myToken.balanceOf(deployer.address);
        const excessAmount = balance + 1n;

        await expect(
          myToken.transfer(addr1.address, excessAmount)
        ).to.be.reverted;
      });

      it("Should succeed when transferring exact balance", async function () {
        const balance = await myToken.balanceOf(deployer.address);

        await myToken.transfer(addr1.address, balance);

        expect(await myToken.balanceOf(deployer.address)).to.equal(0);
        expect(await myToken.balanceOf(addr1.address)).to.equal(balance);
      });

      it("Should fail when transferring zero amount to zero address", async function () {
        const zeroAddress = "0x0000000000000000000000000000000000000000";

        await expect(
          myToken.transfer(zeroAddress, 0)
        ).to.be.reverted;
      });

      it("Should fail when transferring to zero address", async function () {
        const zeroAddress = "0x0000000000000000000000000000000000000000";
        const amount = ethers.parseEther("100");

        await expect(
          myToken.transfer(zeroAddress, amount)
        ).to.be.reverted;
      });

      it("Should succeed when transferring zero amount to valid address", async function () {
        const initialBalance = await myToken.balanceOf(addr1.address);
        
        await myToken.transfer(addr1.address, 0);

        expect(await myToken.balanceOf(addr1.address)).to.equal(initialBalance);
      });

      it("Should succeed when transferring to self", async function () {
        const balance = await myToken.balanceOf(deployer.address);
        const transferAmount = ethers.parseEther("100");

        await myToken.transfer(deployer.address, transferAmount);

        expect(await myToken.balanceOf(deployer.address)).to.equal(balance);
      });

      it("Should fail when account with zero balance tries to transfer", async function () {
        const transferAmount = ethers.parseEther("1");
        const addr1Balance = await myToken.balanceOf(addr1.address);

        expect(addr1Balance).to.equal(0);

        await expect(
          myToken.connect(addr1).transfer(addr2.address, transferAmount)
        ).to.be.reverted;
      });

      it("Should handle multiple transfers that would exceed balance", async function () {
        const balance = await myToken.balanceOf(deployer.address);
        const transferAmount1 = balance / 2n + 1n;
        const transferAmount2 = balance / 2n + 1n;

        // First transfer should succeed
        await myToken.transfer(addr1.address, transferAmount1);

        // Second transfer should fail as it exceeds remaining balance
        await expect(
          myToken.transfer(addr2.address, transferAmount2)
        ).to.be.reverted;
      });
    });

    describe("TransferFrom Edge Cases", function () {
      it("Should fail when transferFrom amount exceeds balance (even with sufficient allowance)", async function () {
        const balance = await myToken.balanceOf(deployer.address);
        const excessAmount = balance + ethers.parseEther("1");

        await myToken.approve(addr1.address, excessAmount);

        await expect(
          myToken.connect(addr1).transferFrom(
            deployer.address,
            addr2.address,
            excessAmount
          )
        ).to.be.reverted;
      });

      it("Should fail when transferFrom from zero address", async function () {
        const zeroAddress = "0x0000000000000000000000000000000000000000";
        const amount = ethers.parseEther("100");

        await expect(
          myToken.connect(addr1).transferFrom(
            zeroAddress,
            addr2.address,
            amount
          )
        ).to.be.reverted;
      });

      it("Should fail when transferFrom to zero address", async function () {
        const zeroAddress = "0x0000000000000000000000000000000000000000";
        const amount = ethers.parseEther("100");

        await myToken.approve(addr1.address, amount);

        await expect(
          myToken.connect(addr1).transferFrom(
            deployer.address,
            zeroAddress,
            amount
          )
        ).to.be.reverted;
      });

      it("Should succeed when transferFrom exact balance", async function () {
        const balance = await myToken.balanceOf(deployer.address);

        await myToken.approve(addr1.address, balance);
        await myToken.connect(addr1).transferFrom(
          deployer.address,
          addr2.address,
          balance
        );

        expect(await myToken.balanceOf(deployer.address)).to.equal(0);
        expect(await myToken.balanceOf(addr2.address)).to.equal(balance);
      });

      it("Should fail when transferFrom with zero amount from zero address", async function () {
        const zeroAddress = "0x0000000000000000000000000000000000000000";

        await expect(
          myToken.connect(addr1).transferFrom(
            zeroAddress,
            addr2.address,
            0
          )
        ).to.be.reverted;
      });
    });

    describe("Approval Edge Cases", function () {
      it("Should allow approval of zero amount", async function () {
        await myToken.approve(addr1.address, 0);

        expect(await myToken.allowance(deployer.address, addr1.address)).to.equal(0);
      });

      it("Should allow approval of maximum uint256 value", async function () {
        const maxUint256 = ethers.MaxUint256;

        await myToken.approve(addr1.address, maxUint256);

        expect(await myToken.allowance(deployer.address, addr1.address)).to.equal(maxUint256);
      });

      it("Should allow approval to zero address", async function () {
        const zeroAddress = "0x0000000000000000000000000000000000000000";
        const amount = ethers.parseEther("100");

        await myToken.approve(zeroAddress, amount);

        expect(await myToken.allowance(deployer.address, zeroAddress)).to.equal(amount);
      });
    });

    describe("Batch Transfer Edge Cases", function () {
      it("Should fail when batch transfer total exceeds balance", async function () {
        const balance = await myToken.balanceOf(deployer.address);
        const recipients = [addr1.address, addr2.address];
        const amounts = [
          balance / 2n + 1n,
          balance / 2n + 1n
        ];

        await expect(
          myToken.batchTransfer(recipients, amounts)
        ).to.be.reverted;
      });

      it("Should fail when one transfer in batch exceeds balance", async function () {
        const balance = await myToken.balanceOf(deployer.address);
        const recipients = [addr1.address, addr2.address];
        const amounts = [
          ethers.parseEther("100"),
          balance + ethers.parseEther("1")
        ];

        await expect(
          myToken.batchTransfer(recipients, amounts)
        ).to.be.reverted;
      });

      it("Should fail when batch transfer includes zero address", async function () {
        const zeroAddress = "0x0000000000000000000000000000000000000000";
        const recipients = [addr1.address, zeroAddress];
        const amounts = [
          ethers.parseEther("100"),
          ethers.parseEther("200")
        ];

        await expect(
          myToken.batchTransfer(recipients, amounts)
        ).to.be.reverted;
      });

      it("Should handle batch transfer with zero amounts", async function () {
        const recipients = [addr1.address, addr2.address];
        const amounts = [0, 0];

        await myToken.batchTransfer(recipients, amounts);

        expect(await myToken.balanceOf(addr1.address)).to.equal(0);
        expect(await myToken.balanceOf(addr2.address)).to.equal(0);
      });

      it("Should fail when batch transfer sum exceeds balance", async function () {
        const balance = await myToken.balanceOf(deployer.address);
        const recipients = [addr1.address, addr2.address, addr1.address];
        const amounts = [
          balance / 3n + 1n,
          balance / 3n + 1n,
          balance / 3n + 1n
        ];

        await expect(
          myToken.batchTransfer(recipients, amounts)
        ).to.be.reverted;
      });
    });

    describe("Minting Edge Cases", function () {
      it("Should allow minting zero amount", async function () {
        const initialBalance = await myToken.balanceOf(addr1.address);
        const initialSupply = await myToken.totalSupply();

        await myToken.mint(addr1.address, 0);

        expect(await myToken.balanceOf(addr1.address)).to.equal(initialBalance);
        expect(await myToken.totalSupply()).to.equal(initialSupply);
      });

      it("Should allow minting to zero address", async function () {
        const zeroAddress = "0x0000000000000000000000000000000000000000";
        const amount = ethers.parseEther("1000");

        await myToken.mint(zeroAddress, amount);

        expect(await myToken.balanceOf(zeroAddress)).to.equal(amount);
      });

      it("Should allow minting maximum uint256 value", async function () {
        const maxUint256 = ethers.MaxUint256;
        const initialSupply = await myToken.totalSupply();

        await myToken.mint(addr1.address, maxUint256);

        expect(await myToken.balanceOf(addr1.address)).to.equal(maxUint256);
        expect(await myToken.totalSupply()).to.equal(initialSupply + maxUint256);
      });
    });
  });
});

