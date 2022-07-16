// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ApprovalForAll extends ethereum.Event {
  get params(): ApprovalForAll__Params {
    return new ApprovalForAll__Params(this);
  }
}

export class ApprovalForAll__Params {
  _event: ApprovalForAll;

  constructor(event: ApprovalForAll) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get operator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get approved(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class CreateERC1155OpenGlip extends ethereum.Event {
  get params(): CreateERC1155OpenGlip__Params {
    return new CreateERC1155OpenGlip__Params(this);
  }
}

export class CreateERC1155OpenGlip__Params {
  _event: CreateERC1155OpenGlip;

  constructor(event: CreateERC1155OpenGlip) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get name(): string {
    return this._event.parameters[1].value.toString();
  }

  get symbol(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class DefaultApproval extends ethereum.Event {
  get params(): DefaultApproval__Params {
    return new DefaultApproval__Params(this);
  }
}

export class DefaultApproval__Params {
  _event: DefaultApproval;

  constructor(event: DefaultApproval) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get hasApproval(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class RoyaltiesSet extends ethereum.Event {
  get params(): RoyaltiesSet__Params {
    return new RoyaltiesSet__Params(this);
  }
}

export class RoyaltiesSet__Params {
  _event: RoyaltiesSet;

  constructor(event: RoyaltiesSet) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get wallet(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get royalties(): Array<RoyaltiesSetRoyaltiesStruct> {
    return this._event.parameters[2].value.toTupleArray<
      RoyaltiesSetRoyaltiesStruct
    >();
  }
}

export class RoyaltiesSetRoyaltiesStruct extends ethereum.Tuple {
  get account(): Address {
    return this[0].toAddress();
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class SaveCreatorSignedRoyalty extends ethereum.Event {
  get params(): SaveCreatorSignedRoyalty__Params {
    return new SaveCreatorSignedRoyalty__Params(this);
  }
}

export class SaveCreatorSignedRoyalty__Params {
  _event: SaveCreatorSignedRoyalty;

  constructor(event: SaveCreatorSignedRoyalty) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get royalty(): SaveCreatorSignedRoyaltyRoyaltyStruct {
    return changetype<SaveCreatorSignedRoyaltyRoyaltyStruct>(
      this._event.parameters[1].value.toTuple()
    );
  }
}

export class SaveCreatorSignedRoyaltyRoyaltyStruct extends ethereum.Tuple {
  get account(): Address {
    return this[0].toAddress();
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class SaveRoyaltySplitter extends ethereum.Event {
  get params(): SaveRoyaltySplitter__Params {
    return new SaveRoyaltySplitter__Params(this);
  }
}

export class SaveRoyaltySplitter__Params {
  _event: SaveRoyaltySplitter;

  constructor(event: SaveRoyaltySplitter) {
    this._event = event;
  }

  get id(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get royaltySplitterBytes(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }
}

export class Supply extends ethereum.Event {
  get params(): Supply__Params {
    return new Supply__Params(this);
  }
}

export class Supply__Params {
  _event: Supply;

  constructor(event: Supply) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get value(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class TransferBatch extends ethereum.Event {
  get params(): TransferBatch__Params {
    return new TransferBatch__Params(this);
  }
}

export class TransferBatch__Params {
  _event: TransferBatch;

  constructor(event: TransferBatch) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get ids(): Array<BigInt> {
    return this._event.parameters[3].value.toBigIntArray();
  }

  get values(): Array<BigInt> {
    return this._event.parameters[4].value.toBigIntArray();
  }
}

export class TransferSingle extends ethereum.Event {
  get params(): TransferSingle__Params {
    return new TransferSingle__Params(this);
  }
}

export class TransferSingle__Params {
  _event: TransferSingle;

  constructor(event: TransferSingle) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get id(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get value(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class URI extends ethereum.Event {
  get params(): URI__Params {
    return new URI__Params(this);
  }
}

export class URI__Params {
  _event: URI;

  constructor(event: URI) {
    this._event = event;
  }

  get value(): string {
    return this._event.parameters[0].value.toString();
  }

  get id(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class ERC1155OpenGlip__decodeLazyMintDataResultValue0Struct extends ethereum.Tuple {
  get tokenId(): BigInt {
    return this[0].toBigInt();
  }

  get reserve(): ERC1155OpenGlip__decodeLazyMintDataResultValue0ReserveStruct {
    return changetype<
      ERC1155OpenGlip__decodeLazyMintDataResultValue0ReserveStruct
    >(this[1].toTuple());
  }

  get creator(): Address {
    return this[2].toAddress();
  }

  get payouts(): Array<
    ERC1155OpenGlip__decodeLazyMintDataResultValue0PayoutsStruct
  > {
    return this[3].toTupleArray<
      ERC1155OpenGlip__decodeLazyMintDataResultValue0PayoutsStruct
    >();
  }

  get minter(): ERC1155OpenGlip__decodeLazyMintDataResultValue0MinterStruct {
    return changetype<
      ERC1155OpenGlip__decodeLazyMintDataResultValue0MinterStruct
    >(this[4].toTuple());
  }

  get royalty(): ERC1155OpenGlip__decodeLazyMintDataResultValue0RoyaltyStruct {
    return changetype<
      ERC1155OpenGlip__decodeLazyMintDataResultValue0RoyaltyStruct
    >(this[5].toTuple());
  }
}

export class ERC1155OpenGlip__decodeLazyMintDataResultValue0ReserveStruct extends ethereum.Tuple {
  get assetType(): ERC1155OpenGlip__decodeLazyMintDataResultValue0ReserveAssetTypeStruct {
    return changetype<
      ERC1155OpenGlip__decodeLazyMintDataResultValue0ReserveAssetTypeStruct
    >(this[0].toTuple());
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class ERC1155OpenGlip__decodeLazyMintDataResultValue0ReserveAssetTypeStruct extends ethereum.Tuple {
  get assetClass(): Bytes {
    return this[0].toBytes();
  }

  get data(): Bytes {
    return this[1].toBytes();
  }
}

export class ERC1155OpenGlip__decodeLazyMintDataResultValue0PayoutsStruct extends ethereum.Tuple {
  get account(): Address {
    return this[0].toAddress();
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class ERC1155OpenGlip__decodeLazyMintDataResultValue0MinterStruct extends ethereum.Tuple {
  get account(): Address {
    return this[0].toAddress();
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class ERC1155OpenGlip__decodeLazyMintDataResultValue0RoyaltyStruct extends ethereum.Tuple {
  get account(): Address {
    return this[0].toAddress();
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class ERC1155OpenGlip__encodeLazyMintDataInputDataStruct extends ethereum.Tuple {
  get tokenId(): BigInt {
    return this[0].toBigInt();
  }

  get reserve(): ERC1155OpenGlip__encodeLazyMintDataInputDataReserveStruct {
    return changetype<
      ERC1155OpenGlip__encodeLazyMintDataInputDataReserveStruct
    >(this[1].toTuple());
  }

  get supply(): BigInt {
    return this[2].toBigInt();
  }

  get creator(): Address {
    return this[3].toAddress();
  }

  get minter(): Address {
    return this[4].toAddress();
  }

  get creators(): Array<
    ERC1155OpenGlip__encodeLazyMintDataInputDataCreatorsStruct
  > {
    return this[5].toTupleArray<
      ERC1155OpenGlip__encodeLazyMintDataInputDataCreatorsStruct
    >();
  }

  get royalty(): ERC1155OpenGlip__encodeLazyMintDataInputDataRoyaltyStruct {
    return changetype<
      ERC1155OpenGlip__encodeLazyMintDataInputDataRoyaltyStruct
    >(this[6].toTuple());
  }

  get signature(): Bytes {
    return this[7].toBytes();
  }
}

export class ERC1155OpenGlip__encodeLazyMintDataInputDataReserveStruct extends ethereum.Tuple {
  get assetType(): ERC1155OpenGlip__encodeLazyMintDataInputDataReserveAssetTypeStruct {
    return changetype<
      ERC1155OpenGlip__encodeLazyMintDataInputDataReserveAssetTypeStruct
    >(this[0].toTuple());
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class ERC1155OpenGlip__encodeLazyMintDataInputDataReserveAssetTypeStruct extends ethereum.Tuple {
  get assetClass(): Bytes {
    return this[0].toBytes();
  }

  get data(): Bytes {
    return this[1].toBytes();
  }
}

export class ERC1155OpenGlip__encodeLazyMintDataInputDataCreatorsStruct extends ethereum.Tuple {
  get account(): Address {
    return this[0].toAddress();
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class ERC1155OpenGlip__encodeLazyMintDataInputDataRoyaltyStruct extends ethereum.Tuple {
  get account(): Address {
    return this[0].toAddress();
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class ERC1155OpenGlip__royaltyInfoResult {
  value0: Address;
  value1: BigInt;

  constructor(value0: Address, value1: BigInt) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    return map;
  }
}

export class ERC1155OpenGlip__verifyAssetAndSignerInputDataStruct extends ethereum.Tuple {
  get tokenId(): BigInt {
    return this[0].toBigInt();
  }

  get reserve(): ERC1155OpenGlip__verifyAssetAndSignerInputDataReserveStruct {
    return changetype<
      ERC1155OpenGlip__verifyAssetAndSignerInputDataReserveStruct
    >(this[1].toTuple());
  }

  get supply(): BigInt {
    return this[2].toBigInt();
  }

  get creator(): Address {
    return this[3].toAddress();
  }

  get minter(): Address {
    return this[4].toAddress();
  }

  get creators(): Array<
    ERC1155OpenGlip__verifyAssetAndSignerInputDataCreatorsStruct
  > {
    return this[5].toTupleArray<
      ERC1155OpenGlip__verifyAssetAndSignerInputDataCreatorsStruct
    >();
  }

  get royalty(): ERC1155OpenGlip__verifyAssetAndSignerInputDataRoyaltyStruct {
    return changetype<
      ERC1155OpenGlip__verifyAssetAndSignerInputDataRoyaltyStruct
    >(this[6].toTuple());
  }

  get signature(): Bytes {
    return this[7].toBytes();
  }
}

export class ERC1155OpenGlip__verifyAssetAndSignerInputDataReserveStruct extends ethereum.Tuple {
  get assetType(): ERC1155OpenGlip__verifyAssetAndSignerInputDataReserveAssetTypeStruct {
    return changetype<
      ERC1155OpenGlip__verifyAssetAndSignerInputDataReserveAssetTypeStruct
    >(this[0].toTuple());
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class ERC1155OpenGlip__verifyAssetAndSignerInputDataReserveAssetTypeStruct extends ethereum.Tuple {
  get assetClass(): Bytes {
    return this[0].toBytes();
  }

  get data(): Bytes {
    return this[1].toBytes();
  }
}

export class ERC1155OpenGlip__verifyAssetAndSignerInputDataCreatorsStruct extends ethereum.Tuple {
  get account(): Address {
    return this[0].toAddress();
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class ERC1155OpenGlip__verifyAssetAndSignerInputDataRoyaltyStruct extends ethereum.Tuple {
  get account(): Address {
    return this[0].toAddress();
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class ERC1155OpenGlip extends ethereum.SmartContract {
  static bind(address: Address): ERC1155OpenGlip {
    return new ERC1155OpenGlip("ERC1155OpenGlip", address);
  }

  addressToString(_address: Address): string {
    let result = super.call(
      "addressToString",
      "addressToString(address):(string)",
      [ethereum.Value.fromAddress(_address)]
    );

    return result[0].toString();
  }

  try_addressToString(_address: Address): ethereum.CallResult<string> {
    let result = super.tryCall(
      "addressToString",
      "addressToString(address):(string)",
      [ethereum.Value.fromAddress(_address)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  balanceOf(account: Address, id: BigInt): BigInt {
    let result = super.call(
      "balanceOf",
      "balanceOf(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromUnsignedBigInt(id)
      ]
    );

    return result[0].toBigInt();
  }

  try_balanceOf(account: Address, id: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "balanceOf",
      "balanceOf(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(account),
        ethereum.Value.fromUnsignedBigInt(id)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  balanceOfBatch(accounts: Array<Address>, ids: Array<BigInt>): Array<BigInt> {
    let result = super.call(
      "balanceOfBatch",
      "balanceOfBatch(address[],uint256[]):(uint256[])",
      [
        ethereum.Value.fromAddressArray(accounts),
        ethereum.Value.fromUnsignedBigIntArray(ids)
      ]
    );

    return result[0].toBigIntArray();
  }

  try_balanceOfBatch(
    accounts: Array<Address>,
    ids: Array<BigInt>
  ): ethereum.CallResult<Array<BigInt>> {
    let result = super.tryCall(
      "balanceOfBatch",
      "balanceOfBatch(address[],uint256[]):(uint256[])",
      [
        ethereum.Value.fromAddressArray(accounts),
        ethereum.Value.fromUnsignedBigIntArray(ids)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigIntArray());
  }

  contractURI(): string {
    let result = super.call("contractURI", "contractURI():(string)", []);

    return result[0].toString();
  }

  try_contractURI(): ethereum.CallResult<string> {
    let result = super.tryCall("contractURI", "contractURI():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  decodeLazyMintData(
    encoded: Bytes
  ): ERC1155OpenGlip__decodeLazyMintDataResultValue0Struct {
    let result = super.call(
      "decodeLazyMintData",
      "decodeLazyMintData(bytes):((uint256,((bytes4,bytes),uint256),address,(address,uint96)[],(address,uint96),(address,uint96)))",
      [ethereum.Value.fromBytes(encoded)]
    );

    return changetype<ERC1155OpenGlip__decodeLazyMintDataResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_decodeLazyMintData(
    encoded: Bytes
  ): ethereum.CallResult<
    ERC1155OpenGlip__decodeLazyMintDataResultValue0Struct
  > {
    let result = super.tryCall(
      "decodeLazyMintData",
      "decodeLazyMintData(bytes):((uint256,((bytes4,bytes),uint256),address,(address,uint96)[],(address,uint96),(address,uint96)))",
      [ethereum.Value.fromBytes(encoded)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<ERC1155OpenGlip__decodeLazyMintDataResultValue0Struct>(
        value[0].toTuple()
      )
    );
  }

  encodeLazyMintData(
    data: ERC1155OpenGlip__encodeLazyMintDataInputDataStruct
  ): Bytes {
    let result = super.call(
      "encodeLazyMintData",
      "encodeLazyMintData((uint256,((bytes4,bytes),uint256),uint256,address,address,(address,uint96)[],(address,uint96),bytes)):(bytes)",
      [ethereum.Value.fromTuple(data)]
    );

    return result[0].toBytes();
  }

  try_encodeLazyMintData(
    data: ERC1155OpenGlip__encodeLazyMintDataInputDataStruct
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "encodeLazyMintData",
      "encodeLazyMintData((uint256,((bytes4,bytes),uint256),uint256,address,address,(address,uint96)[],(address,uint96),bytes)):(bytes)",
      [ethereum.Value.fromTuple(data)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  global(): boolean {
    let result = super.call("global", "global():(bool)", []);

    return result[0].toBoolean();
  }

  try_global(): ethereum.CallResult<boolean> {
    let result = super.tryCall("global", "global():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isApprovedForAll(_owner: Address, _operator: Address): boolean {
    let result = super.call(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [
        ethereum.Value.fromAddress(_owner),
        ethereum.Value.fromAddress(_operator)
      ]
    );

    return result[0].toBoolean();
  }

  try_isApprovedForAll(
    _owner: Address,
    _operator: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isApprovedForAll",
      "isApprovedForAll(address,address):(bool)",
      [
        ethereum.Value.fromAddress(_owner),
        ethereum.Value.fromAddress(_operator)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  minted(param0: BigInt): BigInt {
    let result = super.call("minted", "minted(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toBigInt();
  }

  try_minted(param0: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall("minted", "minted(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  minter(): Address {
    let result = super.call("minter", "minter():(address)", []);

    return result[0].toAddress();
  }

  try_minter(): ethereum.CallResult<Address> {
    let result = super.tryCall("minter", "minter():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  name(): string {
    let result = super.call("name", "name():(string)", []);

    return result[0].toString();
  }

  try_name(): ethereum.CallResult<string> {
    let result = super.tryCall("name", "name():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  royaltyInfo(
    _tokenId: BigInt,
    _salePrice: BigInt
  ): ERC1155OpenGlip__royaltyInfoResult {
    let result = super.call(
      "royaltyInfo",
      "royaltyInfo(uint256,uint256):(address,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_tokenId),
        ethereum.Value.fromUnsignedBigInt(_salePrice)
      ]
    );

    return new ERC1155OpenGlip__royaltyInfoResult(
      result[0].toAddress(),
      result[1].toBigInt()
    );
  }

  try_royaltyInfo(
    _tokenId: BigInt,
    _salePrice: BigInt
  ): ethereum.CallResult<ERC1155OpenGlip__royaltyInfoResult> {
    let result = super.tryCall(
      "royaltyInfo",
      "royaltyInfo(uint256,uint256):(address,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_tokenId),
        ethereum.Value.fromUnsignedBigInt(_salePrice)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new ERC1155OpenGlip__royaltyInfoResult(
        value[0].toAddress(),
        value[1].toBigInt()
      )
    );
  }

  supply(param0: BigInt): BigInt {
    let result = super.call("supply", "supply(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toBigInt();
  }

  try_supply(param0: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall("supply", "supply(uint256):(uint256)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  supportsInterface(interfaceId: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(interfaceId: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  symbol(): string {
    let result = super.call("symbol", "symbol():(string)", []);

    return result[0].toString();
  }

  try_symbol(): ethereum.CallResult<string> {
    let result = super.tryCall("symbol", "symbol():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  uri(param0: BigInt): string {
    let result = super.call("uri", "uri(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toString();
  }

  try_uri(param0: BigInt): ethereum.CallResult<string> {
    let result = super.tryCall("uri", "uri(uint256):(string)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  verifyAssetAndSigner(
    data: ERC1155OpenGlip__verifyAssetAndSignerInputDataStruct,
    amount: BigInt
  ): Address {
    let result = super.call(
      "verifyAssetAndSigner",
      "verifyAssetAndSigner((uint256,((bytes4,bytes),uint256),uint256,address,address,(address,uint96)[],(address,uint96),bytes),uint256):(address)",
      [
        ethereum.Value.fromTuple(data),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );

    return result[0].toAddress();
  }

  try_verifyAssetAndSigner(
    data: ERC1155OpenGlip__verifyAssetAndSignerInputDataStruct,
    amount: BigInt
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "verifyAssetAndSigner",
      "verifyAssetAndSigner((uint256,((bytes4,bytes),uint256),uint256,address,address,(address,uint96)[],(address,uint96),bytes),uint256):(address)",
      [
        ethereum.Value.fromTuple(data),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class __ERC1155OpenGlip_initCall extends ethereum.Call {
  get inputs(): __ERC1155OpenGlip_initCall__Inputs {
    return new __ERC1155OpenGlip_initCall__Inputs(this);
  }

  get outputs(): __ERC1155OpenGlip_initCall__Outputs {
    return new __ERC1155OpenGlip_initCall__Outputs(this);
  }
}

export class __ERC1155OpenGlip_initCall__Inputs {
  _call: __ERC1155OpenGlip_initCall;

  constructor(call: __ERC1155OpenGlip_initCall) {
    this._call = call;
  }

  get _name(): string {
    return this._call.inputValues[0].value.toString();
  }

  get _symbol(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _global(): boolean {
    return this._call.inputValues[2].value.toBoolean();
  }

  get baseURI(): string {
    return this._call.inputValues[3].value.toString();
  }

  get contractURI(): string {
    return this._call.inputValues[4].value.toString();
  }

  get transferProxy(): Address {
    return this._call.inputValues[5].value.toAddress();
  }

  get lazyTransferProxy(): Address {
    return this._call.inputValues[6].value.toAddress();
  }

  get defaultMinter(): Address {
    return this._call.inputValues[7].value.toAddress();
  }

  get forwarder(): Address {
    return this._call.inputValues[8].value.toAddress();
  }
}

export class __ERC1155OpenGlip_initCall__Outputs {
  _call: __ERC1155OpenGlip_initCall;

  constructor(call: __ERC1155OpenGlip_initCall) {
    this._call = call;
  }
}

export class BurnCall extends ethereum.Call {
  get inputs(): BurnCall__Inputs {
    return new BurnCall__Inputs(this);
  }

  get outputs(): BurnCall__Outputs {
    return new BurnCall__Outputs(this);
  }
}

export class BurnCall__Inputs {
  _call: BurnCall;

  constructor(call: BurnCall) {
    this._call = call;
  }

  get account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get id(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get value(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class BurnCall__Outputs {
  _call: BurnCall;

  constructor(call: BurnCall) {
    this._call = call;
  }
}

export class BurnBatchCall extends ethereum.Call {
  get inputs(): BurnBatchCall__Inputs {
    return new BurnBatchCall__Inputs(this);
  }

  get outputs(): BurnBatchCall__Outputs {
    return new BurnBatchCall__Outputs(this);
  }
}

export class BurnBatchCall__Inputs {
  _call: BurnBatchCall;

  constructor(call: BurnBatchCall) {
    this._call = call;
  }

  get account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get ids(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }

  get values(): Array<BigInt> {
    return this._call.inputValues[2].value.toBigIntArray();
  }
}

export class BurnBatchCall__Outputs {
  _call: BurnBatchCall;

  constructor(call: BurnBatchCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class SafeBatchTransferFromCall extends ethereum.Call {
  get inputs(): SafeBatchTransferFromCall__Inputs {
    return new SafeBatchTransferFromCall__Inputs(this);
  }

  get outputs(): SafeBatchTransferFromCall__Outputs {
    return new SafeBatchTransferFromCall__Outputs(this);
  }
}

export class SafeBatchTransferFromCall__Inputs {
  _call: SafeBatchTransferFromCall;

  constructor(call: SafeBatchTransferFromCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get ids(): Array<BigInt> {
    return this._call.inputValues[2].value.toBigIntArray();
  }

  get amounts(): Array<BigInt> {
    return this._call.inputValues[3].value.toBigIntArray();
  }

  get data(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class SafeBatchTransferFromCall__Outputs {
  _call: SafeBatchTransferFromCall;

  constructor(call: SafeBatchTransferFromCall) {
    this._call = call;
  }
}

export class SafeTransferFromCall extends ethereum.Call {
  get inputs(): SafeTransferFromCall__Inputs {
    return new SafeTransferFromCall__Inputs(this);
  }

  get outputs(): SafeTransferFromCall__Outputs {
    return new SafeTransferFromCall__Outputs(this);
  }
}

export class SafeTransferFromCall__Inputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get id(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get amount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class SafeTransferFromCall__Outputs {
  _call: SafeTransferFromCall;

  constructor(call: SafeTransferFromCall) {
    this._call = call;
  }
}

export class SetApprovalForAllCall extends ethereum.Call {
  get inputs(): SetApprovalForAllCall__Inputs {
    return new SetApprovalForAllCall__Inputs(this);
  }

  get outputs(): SetApprovalForAllCall__Outputs {
    return new SetApprovalForAllCall__Outputs(this);
  }
}

export class SetApprovalForAllCall__Inputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }

  get operator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get approved(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class SetApprovalForAllCall__Outputs {
  _call: SetApprovalForAllCall;

  constructor(call: SetApprovalForAllCall) {
    this._call = call;
  }
}

export class SetURICall extends ethereum.Call {
  get inputs(): SetURICall__Inputs {
    return new SetURICall__Inputs(this);
  }

  get outputs(): SetURICall__Outputs {
    return new SetURICall__Outputs(this);
  }
}

export class SetURICall__Inputs {
  _call: SetURICall;

  constructor(call: SetURICall) {
    this._call = call;
  }

  get newuri(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class SetURICall__Outputs {
  _call: SetURICall;

  constructor(call: SetURICall) {
    this._call = call;
  }
}

export class TransferFromOrMintCall extends ethereum.Call {
  get inputs(): TransferFromOrMintCall__Inputs {
    return new TransferFromOrMintCall__Inputs(this);
  }

  get outputs(): TransferFromOrMintCall__Outputs {
    return new TransferFromOrMintCall__Outputs(this);
  }
}

export class TransferFromOrMintCall__Inputs {
  _call: TransferFromOrMintCall;

  constructor(call: TransferFromOrMintCall) {
    this._call = call;
  }

  get data(): TransferFromOrMintCallDataStruct {
    return changetype<TransferFromOrMintCallDataStruct>(
      this._call.inputValues[0].value.toTuple()
    );
  }

  get from(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class TransferFromOrMintCall__Outputs {
  _call: TransferFromOrMintCall;

  constructor(call: TransferFromOrMintCall) {
    this._call = call;
  }
}

export class TransferFromOrMintCallDataStruct extends ethereum.Tuple {
  get tokenId(): BigInt {
    return this[0].toBigInt();
  }

  get reserve(): TransferFromOrMintCallDataReserveStruct {
    return changetype<TransferFromOrMintCallDataReserveStruct>(
      this[1].toTuple()
    );
  }

  get supply(): BigInt {
    return this[2].toBigInt();
  }

  get creator(): Address {
    return this[3].toAddress();
  }

  get minter(): Address {
    return this[4].toAddress();
  }

  get creators(): Array<TransferFromOrMintCallDataCreatorsStruct> {
    return this[5].toTupleArray<TransferFromOrMintCallDataCreatorsStruct>();
  }

  get royalty(): TransferFromOrMintCallDataRoyaltyStruct {
    return changetype<TransferFromOrMintCallDataRoyaltyStruct>(
      this[6].toTuple()
    );
  }

  get signature(): Bytes {
    return this[7].toBytes();
  }
}

export class TransferFromOrMintCallDataReserveStruct extends ethereum.Tuple {
  get assetType(): TransferFromOrMintCallDataReserveAssetTypeStruct {
    return changetype<TransferFromOrMintCallDataReserveAssetTypeStruct>(
      this[0].toTuple()
    );
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class TransferFromOrMintCallDataReserveAssetTypeStruct extends ethereum.Tuple {
  get assetClass(): Bytes {
    return this[0].toBytes();
  }

  get data(): Bytes {
    return this[1].toBytes();
  }
}

export class TransferFromOrMintCallDataCreatorsStruct extends ethereum.Tuple {
  get account(): Address {
    return this[0].toAddress();
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class TransferFromOrMintCallDataRoyaltyStruct extends ethereum.Tuple {
  get account(): Address {
    return this[0].toAddress();
  }

  get value(): BigInt {
    return this[1].toBigInt();
  }
}

export class TransferFromOrMintEncodedDataCall extends ethereum.Call {
  get inputs(): TransferFromOrMintEncodedDataCall__Inputs {
    return new TransferFromOrMintEncodedDataCall__Inputs(this);
  }

  get outputs(): TransferFromOrMintEncodedDataCall__Outputs {
    return new TransferFromOrMintEncodedDataCall__Outputs(this);
  }
}

export class TransferFromOrMintEncodedDataCall__Inputs {
  _call: TransferFromOrMintEncodedDataCall;

  constructor(call: TransferFromOrMintEncodedDataCall) {
    this._call = call;
  }

  get encoded(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get from(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class TransferFromOrMintEncodedDataCall__Outputs {
  _call: TransferFromOrMintEncodedDataCall;

  constructor(call: TransferFromOrMintEncodedDataCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UpdateForwarderCall extends ethereum.Call {
  get inputs(): UpdateForwarderCall__Inputs {
    return new UpdateForwarderCall__Inputs(this);
  }

  get outputs(): UpdateForwarderCall__Outputs {
    return new UpdateForwarderCall__Outputs(this);
  }
}

export class UpdateForwarderCall__Inputs {
  _call: UpdateForwarderCall;

  constructor(call: UpdateForwarderCall) {
    this._call = call;
  }

  get forwarder(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class UpdateForwarderCall__Outputs {
  _call: UpdateForwarderCall;

  constructor(call: UpdateForwarderCall) {
    this._call = call;
  }
}
