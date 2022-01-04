// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NftMarketPlace is ERC721URIStorage {
  address public owner;
  string  uri  = "https://gateway.pinata.cloud/ipfs/bafybeibsswnebdpxinpubbn67qr3lxxhyuniadm423rjtwjtthj3iyrfau";
    struct NFT_Sale {
        uint256 id;
        uint256 price;
        bool isForSale;
        address owner;
    }
      mapping(uint => NFT_Sale) public Nfts;
      uint256[] public _listed;

    mapping(address => uint256[]) addressMintedNftIds;
    uint Genesis_price = 770000000000000000 wei;
    uint Legendary_price = 260000000000000000 wei;
    uint Mythic_price = 510000000000000000 wei;
    uint Rare_price = 140000000000000000 wei;

    constructor() ERC721("", "") {
         owner = msg.sender;
    }

    function getBalance() public view onlyOwner returns(uint256){
    return address(this).balance; 
    }

    function getURI(string memory nftName) public view returns(string memory){
    return string(abi.encodePacked(uri ,"/", nftName, ".mp4"));
    }

  function setURI(string memory newUri) public onlyOwner {
    uri = newUri;
    }

 modifier onlyOwner(){
            require(msg.sender == owner);
            _;
        }

        function getNftsByAddress(address add) public view returns(uint[] memory indexes){
    return addressMintedNftIds[add];
}


    function getNftPrice(uint256 nftId) external view returns (uint256) {
        NFT_Sale storage nft = Nfts[nftId];
        return nft.price;
    }
      function setNftPrice(uint256 nftId , uint256 price) external {
        NFT_Sale storage nft = Nfts[nftId];
        nft.price = price;
    }

    function markAsSold(uint256 nftId) external {
        NFT_Sale storage nft = Nfts[nftId];
        nft.isForSale = false;
    }
 function markAsBuy(uint256 nftId) external {
        NFT_Sale storage nft = Nfts[nftId];
        nft.isForSale = true;
    }

    function setNftsData(uint256 nftId , uint256 price , bool isForSale) external{
          NFT_Sale storage nft = Nfts[nftId];
          nft.price = price;
          nft.isForSale = isForSale;
        approve(address(this), nftId);
    }

    function sentToInfluencers(uint tokenId , address influencer) public onlyOwner {
        safeTransferFrom(owner, influencer, tokenId);
         NFT_Sale storage nft = Nfts[tokenId];
        nft.owner = influencer;
        addressMintedNftIds[influencer].push(tokenId);
    }

   

    function getAllNfts() public view returns (uint256[] memory) {
        return _listed;
    }


      function ownerMintNft(
        uint256 tokenId,
        uint256 price 
    ) public onlyOwner {
        uint256 newItemId = tokenId;
      _safeMint(msg.sender, newItemId);
        approve(address(this), newItemId);
        NFT_Sale memory sale = NFT_Sale(newItemId, price , false, msg.sender);
        Nfts[tokenId] = sale;
        _listed.push(tokenId);
        addressMintedNftIds[msg.sender].push(tokenId);
    }

    function mintNft(
        uint256 tokenId,
        uint256 price ,
        string memory type_of_nft 
    ) public payable {
          if(keccak256(abi.encodePacked((type_of_nft))) == keccak256(abi.encodePacked(("Genesis")))){
             require(msg.value >= Genesis_price);
          }else if( keccak256(abi.encodePacked((type_of_nft))) == keccak256(abi.encodePacked(("Legendary"))) ){
            require(msg.value >= Legendary_price);
            }else if( keccak256(abi.encodePacked((type_of_nft))) == keccak256(abi.encodePacked(("Mythic"))) ){
                require(msg.value >= Mythic_price);
            }else if( keccak256(abi.encodePacked((type_of_nft))) == keccak256(abi.encodePacked(("Rare"))) ){
            require(msg.value >= Rare_price);
            }

        uint256 newItemId = tokenId;
        _safeMint(msg.sender, newItemId);
        approve(address(this), newItemId);
        NFT_Sale memory sale = NFT_Sale(newItemId, price , false, msg.sender);
        Nfts[tokenId] = sale;
        _listed.push(tokenId);
        addressMintedNftIds[msg.sender].push(tokenId);
         payable(owner).transfer(msg.value);
    }

    function transferNft(
        address currentOwner,
        address newOwner,
        uint256 nftId 
    ) external {
        safeTransferFrom(currentOwner, newOwner, nftId);
         NFT_Sale storage nft = Nfts[nftId];
        nft.owner = newOwner;
    }

    function buyNft(uint256 nftId ) public payable {
    uint256 salePrice = this.getNftPrice(nftId);
    uint256 amountPaid = msg.value;

    require(amountPaid >= salePrice);

    address payable currentOwner = payable(this.ownerOf(nftId));

    payable(currentOwner).transfer(amountPaid);
    this.transferNft(currentOwner, msg.sender, nftId);
    this.markAsSold(nftId);
    addressMintedNftIds[msg.sender].push(nftId);
}
}