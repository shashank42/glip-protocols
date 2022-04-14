pragma solidity >=0.6.2 <0.8.0;
pragma abicoder v2;


import "../tokens/@rarible/royalties/contracts/LibPart.sol";

// https://medium.com/coinmonks/eip712-a-full-stack-example-e12185b03d54
library LibMinter {

    bytes32 constant MINTER_FEE_TYPEHASH = keccak256(
        "Minter(address minter,address creator,address token,uint96 fee,uint256 cancelValue,uint256 start,uint256 end,Part[] creators,Part[] royalties)Part(address account,uint96 value)"
    );

    struct Minter {
        address minter;
        address creator;
        address token;
        uint96 fee;
        uint256 cancelValue;
        uint start;
        uint end;
        LibPart.Part[] creators;
        LibPart.Part[] royalties;
        bytes[] signatures;
    }

    struct DefaultMinter {
        address creator;
        address token;
        LibPart.Part[] creators;
        LibPart.Part[] royalties;
    }

    function hash(Minter memory minter) internal pure returns (bytes32) {

        bytes32[] memory royaltiesBytes = new bytes32[](minter.royalties.length);
        for (uint256 i = 0; i < minter.royalties.length; i++) {
            royaltiesBytes[i] = LibPart.hash(minter.royalties[i]);
        }
        bytes32[] memory creatorsBytes = new bytes32[](minter.creators.length);
        for (uint256 i = 0; i < minter.creators.length; i++) {
            creatorsBytes[i] = LibPart.hash(minter.creators[i]);
        }

        bytes32 hashStruct = keccak256(abi.encode(
            MINTER_FEE_TYPEHASH,
            minter.minter,
            minter.creator,
            minter.token,
            minter.fee,
            minter.cancelValue,
            minter.start,
            minter.end,
            keccak256(abi.encodePacked(creatorsBytes)),
            keccak256(abi.encodePacked(royaltiesBytes))
        ));

        return hashStruct;
    }

}
