// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SimpleNFT is ERC721 {
    event CollectionCreated(address collection, string name, string symbol);
    event TokenMinted(
        address collection,
        address recipient,
        uint256 tokenId,
        string tokenUri
    );

    // Mapping from collection address to collection symbol
    mapping(address => string) internal _collections;

    constructor() ERC721("MyNFT", "MNFT") {}

    function createNewCollection(
        address _collection,
        string memory _name,
        string memory _symbol
    ) public {
        require(
            abi.encodePacked(_collections[_collection]).length == 0,
            "the collection exists"
        );
        _collections[_collection] = _symbol;
        emit CollectionCreated(_collection, _name, _symbol);
    }

    function mint(
        address _collection,
        address _to,
        uint256 _tokenId,
        string memory _tokenUri
    ) public {
        require(
            abi.encodePacked(_collections[_collection]).length > 0,
            "the collection does not find"
        );
        _mint(_to, _tokenId);
        emit TokenMinted(_collection, _to, _tokenId, _tokenUri);
    }
}
