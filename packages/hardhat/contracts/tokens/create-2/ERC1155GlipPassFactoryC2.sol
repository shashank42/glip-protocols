// SPDX-License-Identifier: MIT

pragma solidity 0.7.6;
pragma abicoder v2;

import "../erc-1155/ERC1155GlipPass.sol";
import "./../@openzeppelin/contracts/proxy/UpgradeableBeacon.sol";
import "./../@openzeppelin/contracts/proxy/BeaconProxy.sol";
import "./../@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev This contract is for creating proxy to access ERC1155GlipPass token.
 *
 * The beacon is initialized in the constructor.
 *
 */
contract ERC1155GlipPassFactoryC2 is Ownable {
    address public beacon;
    address exchangeProxy;
    address defaultMinter;
    address forwarder;

    event ERC1155GlipPassProxy(address proxy, address indexed owner);

    constructor(address _beacon, address _exchangeProxy, address _defaultMinter, address _forwarder) {
        beacon = address(_beacon);
        updateExchangeMinterForwarder(_exchangeProxy, _defaultMinter, _forwarder);
    }

    function updateExchangeMinterForwarder(address _exchangeProxy, address _defaultMinter, address _forwarder ) public onlyOwner {
        exchangeProxy = _exchangeProxy;
        defaultMinter = _defaultMinter;
        forwarder = _forwarder;
    }

    function create(address to, string memory _name, string memory _symbol, string memory baseURI, string memory contractURI, uint salt) external returns (address) {
        BeaconProxy proxyAddress = new BeaconProxy(beacon, getData(_name,  _symbol,  baseURI,  contractURI));
        emit ERC1155GlipPassProxy(address(proxyAddress), to);
        return address(proxyAddress);
    }

    function createToken(address to, string memory _name, string memory _symbol, string memory baseURI, string memory contractURI, uint salt) external returns (address) {
        address beaconProxy = deployProxy(getData(_name,  _symbol,  baseURI,  contractURI), salt);
        ERC1155GlipPass token = ERC1155GlipPass(address(beaconProxy));
        if (to != _msgSender()) token.transferOwnership(to); else token.transferOwnership(_msgSender());
        emit ERC1155GlipPassProxy(beaconProxy, token.owner());
        return beaconProxy;
    }

    //deploying BeaconProxy contract with create2
    function deployProxy(bytes memory data, uint salt) internal returns(address proxy){
        bytes memory bytecode = getCreationBytecode(data);
        assembly {
            proxy := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(extcodesize(proxy)) {
                revert(0, 0)
            }
        }
    }

    //adding constructor arguments to BeaconProxy bytecode
    function getCreationBytecode(bytes memory _data) internal view returns (bytes memory) {
        return abi.encodePacked(type(BeaconProxy).creationCode, abi.encode(beacon, _data));
    }

    //returns address that contract with such arguments will be deployed on
    function getAddress(string memory _name, string memory _symbol, string memory baseURI, string memory contractURI, uint salt)
        public
        view
        returns (address)
    {   
        bytes memory bytecode = getCreationBytecode(getData(_name,  _symbol,  baseURI,  contractURI));

        bytes32 hash = keccak256(
            abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(bytecode))
        );

        return address(uint160(uint(hash)));
    }

    function getData(string memory _name, string memory _symbol, string memory baseURI, string memory contractURI) view internal returns(bytes memory){
        return abi.encodeWithSelector(ERC1155GlipPass(0).__ERC1155GlipPass_init.selector,_name, _symbol, baseURI, contractURI, exchangeProxy, defaultMinter, forwarder);
    }
    

}
