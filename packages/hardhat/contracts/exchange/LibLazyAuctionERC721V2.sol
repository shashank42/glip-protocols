pragma solidity >=0.6.2 <0.8.0;
pragma abicoder v2;

// https://medium.com/coinmonks/eip712-a-full-stack-example-e12185b03d54
library LibLazyAuctionERC721V2 {

    bytes32 constant AUCTION_TYPEHASH = keccak256(
        "Auction(address maker,address taker,address token,uint256 tokenId,uint256 min,uint256 amount,uint256 start,uint256 end)"
    );

    struct Auction {
        address maker;
        address taker;
        address token;
        uint tokenId;
        uint min;
        uint amount;
        uint start;
        uint end;
        bytes signature;
    }

    function hash(Auction memory auction) internal pure returns (bytes32) {

        bytes32 hashStruct = keccak256(abi.encode(
            AUCTION_TYPEHASH,
            auction.maker,
            auction.taker,
            auction.token,
            auction.tokenId,
            auction.min,
            auction.amount,
            auction.start,
            auction.end
        ));

        return hashStruct;
    }

}
