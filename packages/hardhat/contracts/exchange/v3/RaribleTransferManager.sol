import "hardhat/console.sol";

// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;

import "./../../tokens/@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "./../../tokens/@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "./../../asset/contracts/LibAsset.sol";
import "./../../tokens/@rarible/royalties/contracts/IRoyaltiesProvider.sol";
import "./../../tokens/@rarible/lazy-mint/contracts/erc-721/LibERC721LazyMint.sol";
import "./../../tokens/@rarible/lazy-mint/contracts/erc-1155/LibERC1155LazyMint.sol";
import "./LibFill.sol";
import "./LibFeeSide.sol";
import "./ITransferManager.sol";
import "./TransferExecutor.sol";
import "./lib/BpLibrary.sol";
import "./../../tokens/@rarible/royalties/contracts/IERC2981.sol";
import "./../IGlipLazy.sol";
import "./IAssetMatcherAggregator.sol";





abstract contract RaribleTransferManager is OwnableUpgradeable, ITransferManager, IAssetMatcherAggregator {
    using BpLibrary for uint;
    using SafeMathUpgradeable for uint;

    uint public protocolFee;

    address public defaultFeeReceiver;
    mapping(address => address) public feeReceivers;

    function __RaribleTransferManager_init_unchained(
        uint newProtocolFee,
        address newDefaultFeeReceiver
    ) internal initializer {
        protocolFee = newProtocolFee;
        defaultFeeReceiver = newDefaultFeeReceiver;
    }


    function setProtocolFee(uint newProtocolFee) external onlyOwner {
        protocolFee = newProtocolFee;
    }

    function setDefaultFeeReceiver(address payable newDefaultFeeReceiver) external onlyOwner {
        defaultFeeReceiver = newDefaultFeeReceiver;
    }

    function setFeeReceiver(address token, address wallet) external onlyOwner {
        feeReceivers[token] = wallet;
    }

    function getFeeReceiver(address token) internal view returns (address) {
        address wallet = feeReceivers[token];
        if (wallet != address(0)) {
            return wallet;
        }
        return defaultFeeReceiver;
    }

    function doTransfers(
        LibAsset.AssetType memory makeMatch, // leftOrder's make asset
        LibAsset.AssetType memory takeMatch, // leftOrder's take asset
        LibFill.FillResult memory fill,
        LibOrder.Order memory leftOrder,
        LibOrder.Order memory rightOrder,
        LibOrderDataV1.DataV1 memory leftOrderData,
        LibOrderDataV1.DataV1 memory rightOrderData
    ) override internal returns (uint totalMakeValue, uint totalTakeValue) {

        LibFeeSide.FeeSide feeSide = LibFeeSide.getFeeSide(makeMatch.assetClass, takeMatch.assetClass);
        totalMakeValue = fill.leftValue;
        totalTakeValue = fill.rightValue;

        console.log("totalMakeValue");
        console.log(totalMakeValue);
        console.log("totalTakeValue");
        console.log(totalTakeValue);

        // Fetch royalty and payouts for
        // 1. Minted asset: Payouts from the orderData itself, Royalty from contract
        // 2. To be minted asset: Payouts from the asset contract using the mint data using decodeMintData function. Royalty as well.
        // makeMatch, takeMatch, leftOrderData, rightOrderData
        // LibPart.Part[] leftPayouts, LibPart.Part[] rightPayouts, LibPart.Part leftRoyalty, LibPart.Part rightRoyalty

        if (feeSide == LibFeeSide.FeeSide.MAKE) {

            console.log("Make side fee");

            // Left order make asset is the fungible type. Fees get cut from this and goes to Left order taker

            TransferWithFeesRequest memory request;
            request.amount = fill.leftValue;
            request.from = leftOrder.maker;
            request.dataCalculate = leftOrderData;
            request.dataNft = rightOrderData;
            request.matchCalculate = makeMatch;
            request.matchNft = takeMatch;
            request.transferDirection = TO_TAKER;
            request = getFinanceConfigByAssetType(request);

            console.log("dataNft payouts");
            console.log(request.dataNft.payouts.length);
            console.log("dataCalculate payouts");
            console.log(request.dataCalculate.payouts.length);

            // Left order maker to taker transfers + fees
            totalMakeValue = doTransfersWithFees(request);
            console.log("FEES PAYMENTS DONE");
            // Left order taker to maker transfer
            transferPayouts(takeMatch, fill.rightValue, rightOrder.maker, request.dataCalculate.payouts, TO_MAKER, request.minCalculate);

        } else if (feeSide == LibFeeSide.FeeSide.TAKE) {

            console.log("Take side fee");
            
            // Left order take asset is the fungible type. Fees get cut from this and goes to Left order maker

            TransferWithFeesRequest memory request;
            request.amount = fill.rightValue;
            request.from = rightOrder.maker;
            request.dataCalculate = rightOrderData;
            request.dataNft = leftOrderData;
            request.matchCalculate = takeMatch;
            request.matchNft = makeMatch;
            request.transferDirection = TO_MAKER;
            request = getFinanceConfigByAssetType(request);

            

            // Left order taker to maker transfers + fees
            totalTakeValue = doTransfersWithFees(request);
            // Left order maker to taker transfer
            transferPayouts(makeMatch, fill.leftValue, leftOrder.maker, request.dataCalculate.payouts, TO_TAKER, request.minCalculate);

        } else {

            console.log("No fees");

            // Neither Left order take or make asset is fungible type

            TransferWithFeesRequest memory request;
            request.amount = fill.rightValue;
            request.from = rightOrder.maker;
            request.dataCalculate = rightOrderData;
            request.dataNft = leftOrderData;
            request.matchCalculate = takeMatch;
            request.matchNft = makeMatch;
            request.transferDirection = TO_TAKER;
            request = getFinanceConfigByAssetType(request);

            // Left order maker to taker transfer
            transferPayouts(makeMatch, fill.leftValue, leftOrder.maker, request.dataCalculate.payouts, TO_TAKER, request.minCalculate);

            request.amount = fill.leftValue;
            request.from = leftOrder.maker;
            request.dataCalculate = leftOrderData;
            request.dataNft = rightOrderData;
            request.matchCalculate = makeMatch;
            request.matchNft = takeMatch;
            request.transferDirection = TO_MAKER;
            request = getFinanceConfigByAssetType(request);

            // Left order taker to maker transfer
            transferPayouts(takeMatch, fill.rightValue, rightOrder.maker, request.dataCalculate.payouts, TO_MAKER, request.minNft);

        }
    }
    

    struct TransferWithFeesRequest {
        uint amount;
        address from;
        LibOrderDataV1.DataV1 dataCalculate;
        LibOrderDataV1.DataV1 dataNft;
        LibAsset.AssetType matchCalculate;
        LibAsset.AssetType matchNft;
        bytes4 transferDirection;
        LibPart.Part royalty;
        LibAsset.Asset minCalculate;
        LibAsset.Asset minNft;
    }


    function doTransfersWithFees(
        TransferWithFeesRequest memory request
    ) internal returns (uint totalAmount) {

        totalAmount = calculateTotalAmount(request.amount, protocolFee, request.dataCalculate.originFees);
        uint rest = transferProtocolFee(totalAmount, request.amount, request.from, request.matchCalculate, request.transferDirection);
        rest = transferRoyalties(rest, request);
        (rest,) = transferFees(request.matchCalculate, rest, request.amount, request.dataCalculate.originFees, request.from, request.transferDirection, ORIGIN);
        (rest,) = transferFees(request.matchCalculate, rest, request.amount, request.dataNft.originFees, request.from, request.transferDirection, ORIGIN);

        transferPayouts(request.matchCalculate, rest, request.from, request.dataNft.payouts, request.transferDirection, request.minNft);

    }


    function transferProtocolFee(
        uint totalAmount,
        uint amount,
        address from,
        LibAsset.AssetType memory matchCalculate,
        bytes4 transferDirection
    ) internal returns (uint) {
        (uint rest, uint fee) = subFeeInBp(totalAmount, amount, protocolFee.mul(2));
        if (fee > 0) {
            address tokenAddress = address(0);
            if (matchCalculate.assetClass == LibAsset.ERC20_ASSET_CLASS) {
                tokenAddress = abi.decode(matchCalculate.data, (address));
            } else  if (matchCalculate.assetClass == LibAsset.ERC1155_ASSET_CLASS) {
                uint tokenId;
                (tokenAddress, tokenId) = abi.decode(matchCalculate.data, (address, uint));
            }
            console.log("Transfer protocol");
            console.log(fee);
            console.log(getFeeReceiver(tokenAddress));
            transfer(LibAsset.Asset(matchCalculate, fee), from, getFeeReceiver(tokenAddress), transferDirection, PROTOCOL);
        }
        return rest;
    }

    function transferRoyalties(
        uint rest,
        TransferWithFeesRequest memory request
    ) internal returns (uint) {

        LibPart.Part[] memory fees = new LibPart.Part[](1);
        fees[0] = request.royalty;
        
        (uint result, uint totalRoyalties) = transferFees(request.matchCalculate, rest, request.amount, fees, request.from, request.transferDirection, ROYALTY);
        require(totalRoyalties <= 5000, "Royalties are too high (>50%)");

        return result;
    }


    function getFinanceConfigByAssetType(
        TransferWithFeesRequest memory request 
        ) internal virtual returns (TransferWithFeesRequest memory) {
        
        // Fetch royalty and payouts for
        // 1. Minted asset: Payouts from the orderData itself, Royalty from contract
        // 2. To be minted asset: Payouts from the asset contract using the mint data using decodeMintData function. Royalty as well.
        // makeMatch, takeMatch, leftOrderData, rightOrderData
        // LibPart.Part[] payoutsCalculate, LibPart.Part[] payoutsNft, LibPart.Part royalty

        if (request.matchNft.assetClass == LibAsset.ERC1155_ASSET_CLASS || request.matchNft.assetClass == LibAsset.ERC721_ASSET_CLASS) {
            (address token, uint tokenId) = abi.decode(request.matchNft.data, (address, uint));
            (address recipient,uint256 value) = IERC2981(token).royaltyInfo(tokenId, request.amount);
            request.royalty.account = payable(recipient);
            request.royalty.value = uint96(value.mul(10000).div(request.amount));
        } else if (request.matchNft.assetClass == LibERC1155LazyMint.ERC1155_LAZY_ASSET_CLASS || request.matchNft.assetClass == LibERC721LazyMint.ERC721_LAZY_ASSET_CLASS) {
            (address token, bytes memory data) = abi.decode(request.matchNft.data, (address, bytes));
            IGlipLazy.DecodedMintData memory tokenData = IGlipLazy(token).decodeLazyMintData(data);
            request.dataNft.payouts = tokenData.payouts;
            console.log("tokenData.minter.account");
            console.log(address(tokenData.minter.account));
            console.log("tokenData.creator.account");
            console.log(tokenData.creator);
            console.log("tokenData.tokenId");
            console.log(tokenData.tokenId);
            // Adding minter fee if any to origin fees of the order
            if (tokenData.minter.account != address(0)) {
                LibPart.Part[] memory originFees =  new LibPart.Part[](request.dataNft.originFees.length + 1);
                for (uint256 i = 0; i < request.dataNft.originFees.length; i++) {
                    originFees[i] = request.dataNft.originFees[i];
                }
                originFees[request.dataNft.originFees.length] = tokenData.minter;
                request.dataNft.originFees = originFees;
            }
            request.minNft = tokenData.reserve;
            request.royalty = tokenData.royalty;
        }

        if (request.matchCalculate.assetClass == LibAsset.ERC1155_ASSET_CLASS || request.matchCalculate.assetClass == LibAsset.ERC721_ASSET_CLASS) {
        } else if (request.matchCalculate.assetClass == LibERC1155LazyMint.ERC1155_LAZY_ASSET_CLASS || request.matchCalculate.assetClass == LibERC721LazyMint.ERC721_LAZY_ASSET_CLASS) {
            (address token, bytes memory data) = abi.decode(request.matchCalculate.data, (address, bytes));
            IGlipLazy.DecodedMintData memory tokenData = IGlipLazy(token).decodeLazyMintData(data);
            request.dataCalculate.payouts = tokenData.payouts;
            // Adding minter fee if any to origin fees of the order
            if (tokenData.minter.account != address(0)) {
                LibPart.Part[] memory originFees =  new LibPart.Part[](request.dataCalculate.originFees.length + 1);
                for (uint256 i = 0; i < request.dataCalculate.originFees.length; i++) {
                    originFees[i] = request.dataCalculate.originFees[i];
                }
                originFees[request.dataCalculate.originFees.length] = tokenData.minter;
                request.dataCalculate.originFees = originFees;
                request.minCalculate = tokenData.reserve;
            }
        }

        return request;
    }

    function transferFees(
        LibAsset.AssetType memory matchCalculate,
        uint rest,
        uint amount,
        LibPart.Part[] memory fees,
        address from,
        bytes4 transferDirection,
        bytes4 transferType
    ) internal returns (uint restValue, uint totalFees) {
        totalFees = 0;
        restValue = rest;
        for (uint256 i = 0; i < fees.length; i++) {
            totalFees = totalFees.add(fees[i].value);
            (uint newRestValue, uint feeValue) = subFeeInBp(restValue, amount,  fees[i].value);
            restValue = newRestValue;
            if (feeValue > 0) {
                console.log("Transfer feed");
                console.log(feeValue);
                console.log(fees[i].account);
                transfer(LibAsset.Asset(matchCalculate, feeValue), from,  fees[i].account, transferDirection, transferType);
            }
        }
    }

    function transferPayouts(
        LibAsset.AssetType memory matchCalculate,
        uint amount,
        address from,
        LibPart.Part[] memory payouts,
        bytes4 transferDirection, 
        LibAsset.Asset memory min
    ) internal {

        // Compare with minimum set by lazy asset creator/minter
        // Asset type and amount should be satisfied
        LibAsset.AssetType memory temp;
        if (min.assetType.assetClass != 0){
            LibAsset.AssetType memory result = matchAssets(matchCalculate, min.assetType);
            if (result.assetClass == 0 || amount < min.value) {
                // console.log(result.assetClass);
                (address token1) = abi.decode(matchCalculate.data, (address));
                console.log(token1);
                (address token2) = abi.decode(min.assetType.data, (address));
                console.log(token2);
                console.log(amount);
                console.log(min.value);
                revert("Payout is less than reserve");
            }
        } 

        uint sumBps = 0;
        uint restValue = amount;
        for (uint256 i = 0; i < payouts.length - 1; i++) {
            uint currentAmount = amount.bp(payouts[i].value);
            sumBps = sumBps.add(payouts[i].value);
            if (currentAmount > 0) {
                restValue = restValue.sub(currentAmount);
                console.log("Transfer payout");
                console.log(currentAmount);
                console.log(payouts[i].account);
                transfer(LibAsset.Asset(matchCalculate, currentAmount), from, payouts[i].account, transferDirection, PAYOUT);
            }
        }
        LibPart.Part memory lastPayout = payouts[payouts.length - 1];
        sumBps = sumBps.add(lastPayout.value);
        require(sumBps == 10000, "Sum payouts Bps not equal 100%");
        if (restValue > 0) {
            console.log("Last payout");
            console.log(restValue);
            console.log(lastPayout.account);
            transfer(LibAsset.Asset(matchCalculate, restValue), from, lastPayout.account, transferDirection, PAYOUT);
        }
    }

    function calculateTotalAmount(
        uint amount,
        uint feeOnTopBp,
        LibPart.Part[] memory orderOriginFees
    ) internal pure returns (uint total){
        total = amount.add(amount.bp(feeOnTopBp));
        for (uint256 i = 0; i < orderOriginFees.length; i++) {
            total = total.add(amount.bp(orderOriginFees[i].value));
        }
    }

    function subFeeInBp(uint value, uint total, uint feeInBp) internal pure returns (uint newValue, uint realFee) {
        return subFee(value, total.bp(feeInBp));
    }

    function subFee(uint value, uint fee) internal pure returns (uint newValue, uint realFee) {
        if (value > fee) {
            newValue = value.sub(fee);
            realFee = fee;
        } else {
            newValue = 0;
            realFee = value;
        }
    }




    uint256[46] private __gap;
}
