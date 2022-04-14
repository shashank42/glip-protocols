import {
  AuctionMatched,
  BidMatched,
  Deposit,
  OwnershipTransferred,
  Withdraw
} from "../generated/Auction/Auction";
import {
  Approval,
  ApprovalForAll,
  CreateERC721GlipLive,
  Creators,
  DefaultApproval,
  OwnershipTransferred as AssetOwnershipTransferred,
  RoyaltiesSet,
  Transfer
} from "../generated/ERC721GlipLive/ERC721GlipLive";
import { MatchedOrder } from "../generated/schema";

export function handleAuctionMatched(event: AuctionMatched): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  const mintedTokenId = event.params.tokenId.toHexString() + "-" + event.params.token.toHexString();
  let entity = MatchedOrder.load(mintedTokenId);

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new MatchedOrder(mintedTokenId)

    // Entity fields can be set using simple assignments
    // entity.count = BigInt.fromI32(0)
  }
  // BigInt and BigDecimal math are supported
  entity.auctionMaker = event.params.maker.toHexString();

  // Entity fields can be set based on event parameters
  entity.auctionTaker = event.params.taker.toHexString();
  entity.token = event.params.token.toHexString();
  entity.tokenId = event.params.tokenId;
  entity.auctionType = event.params.auctionType;

  // Entities can be written to the store with `.save()`
  entity.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.auctioneer(...)
  // - contract.getStake(...)
  // - contract.onERC721Received(...)
  // - contract.owner(...)
  // - contract.platformFee(...)
  // - contract.stake(...)
  // - contract.verifyOrderMatch(...)
}

export function handleBidMatched(event: BidMatched): void {

  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  const mintedTokenId = event.params.tokenId.toHexString() + "-" + event.params.token.toHexString();
  let entity = MatchedOrder.load(mintedTokenId);

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new MatchedOrder(mintedTokenId);

    // Entity fields can be set using simple assignments
    // entity.count = BigInt.fromI32(0)
  }


  // BigInt and BigDecimal math are supported
  entity.bidMaker = event.params.maker.toHexString();

  // Entity fields can be set based on event parameters
  entity.bidTaker = event.params.taker.toHexString();
  entity.token = event.params.token.toHexString();
  entity.tokenId = event.params.tokenId;
  entity.auctioneer = event.params.auctioneer.toHexString();
  entity.value = event.params.value;

  // Entities can be written to the store with `.save()`
  entity.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.auctioneer(...)
  // - contract.getStake(...)
  // - contract.onERC721Received(...)
  // - contract.owner(...)
  // - contract.platformFee(...)
  // - contract.stake(...)
  // - contract.verifyOrderMatch(...)

}

export function handleDeposit(event: Deposit): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleWithdraw(event: Withdraw): void {}



export function handleApproval(event: Approval): void {
  // // Entities can be loaded from the store using a string ID; this ID
  // // needs to be unique across all entities of the same type
  // let entity = ExampleEntity.load(event.transaction.from.toHex())

  // // Entities only exist after they have been saved to the store;
  // // `null` checks allow to create entities on demand
  // if (!entity) {
  //   entity = new ExampleEntity(event.transaction.from.toHex())

  //   // Entity fields can be set using simple assignments
  //   entity.count = BigInt.fromI32(0)
  // }

  // // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1)

  // // Entity fields can be set based on event parameters
  // entity.owner = event.params.owner
  // entity.approved = event.params.approved

  // // Entities can be written to the store with `.save()`
  // entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.balanceOf(...)
  // - contract.baseURI(...)
  // - contract.burned(...)
  // - contract.contractURI(...)
  // - contract.decodeLazyMintData(...)
  // - contract.encodeLazyMintData(...)
  // - contract.exists(...)
  // - contract.getApproved(...)
  // - contract.getCreators(...)
  // - contract.getRaribleV2Royalties(...)
  // - contract.isApprovedForAll(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenByIndex(...)
  // - contract.tokenOfOwnerByIndex(...)
  // - contract.tokenURI(...)
  // - contract.totalSupply(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleCreateERC721GlipLive(event: CreateERC721GlipLive): void {}

export function handleCreators(event: Creators): void {}

export function handleDefaultApproval(event: DefaultApproval): void {}

export function handleAssetOwnershipTransferred(event: AssetOwnershipTransferred): void {}

export function handleRoyaltiesSet(event: RoyaltiesSet): void {}

export function handleTransfer(event: Transfer): void {}
