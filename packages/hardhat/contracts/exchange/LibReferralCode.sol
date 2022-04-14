// pragma solidity >=0.6.2 <0.8.0;
// pragma abicoder v2;

// // https://medium.com/coinmonks/eip712-a-full-stack-example-e12185b03d54
// library LibReferralCode {

//     bytes32 constant AUCTION_TYPEHASH = keccak256(
//         "Referral(address maker,address taker,address token,uint256 tokenId,uint256 min,uint256 start,uint256 end)"
//     );

//     struct Referral {
//         address referrer;
//         address token;
//         uint96 referrerValue;
//         uint96 refereeValue;
//         uint tokenId;
//         uint min;
//         uint start;
//         uint end;
//         bytes signature;
//     }

//     function hash(Referral memory referral) internal pure returns (bytes32) {

//         bytes32 hashStruct = keccak256(abi.encode(
//             AUCTION_TYPEHASH,
//             auction.maker,
//             auction.taker,
//             auction.token,
//             auction.tokenId,
//             auction.min,
//             auction.start,
//             auction.end
//         ));

//         return hashStruct;
//     }

// }
