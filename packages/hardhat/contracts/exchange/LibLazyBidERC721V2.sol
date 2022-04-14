pragma solidity >=0.6.2 <0.8.0;
pragma abicoder v2;

library LibLazyBidERC721V2 {

    bytes32 constant BID_TYPEHASH = keccak256(
        "Bid(address maker,address taker,address token,address auctioneer,uint256 tokenId,uint256 value,uint256 amount,uint256 start,uint256 end,bytes tokenData)"
    );
    struct Bid {
        address maker;
        address taker;
        address token;
        address auctioneer;
        uint tokenId;
        uint value;
        uint amount;
        uint start;
        uint end;
        bytes tokenData;
        bytes signature;
    }

    function hash(Bid memory bid) internal pure returns (bytes32) {

        bytes32 hashStruct = keccak256(abi.encode(
            BID_TYPEHASH,
            bid.maker,
            bid.taker,
            bid.token,
            bid.auctioneer,
            bid.tokenId,
            bid.value,
            bid.amount,
            bid.start,
            bid.end,
            keccak256(bid.tokenData)
        ));

        return hashStruct;
    }

}
