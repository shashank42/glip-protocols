pragma solidity >=0.6.2 <0.8.0;
pragma abicoder v2;

// https://medium.com/coinmonks/eip712-a-full-stack-example-e12185b03d54
library LibAuctioneer {

    bytes32 constant MINTER_FEE_TYPEHASH = keccak256(
        "MinterFee(address auctioneer,address minter,address token,uint8 auctionType,uint96 fee,uint256 cancelValue,uint256 start,uint256 end)"
    );

    struct Auctioneer {
        address auctioneer;
        address minter;
        address token;
        uint8 auctionType;
        uint96 fee;
        uint256 cancelValue;
        uint start;
        uint end;
        bytes[] signatures;
    }

    function hash(Auctioneer memory auctioneer) internal pure returns (bytes32) {

        bytes32 hashStruct = keccak256(abi.encode(
            MINTER_FEE_TYPEHASH,
            auctioneer.auctioneer,
            auctioneer.minter,
            auctioneer.token,
            auctioneer.auctionType,
            auctioneer.fee,
            auctioneer.cancelValue,
            auctioneer.start,
            auctioneer.end
        ));

        return hashStruct;
    }

}
