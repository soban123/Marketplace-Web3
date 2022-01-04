import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { contract_address, contract_abi } from "./constants";
import getWeb3 from "./getWeb3";
import OwnerSection from "./Owner";
import metaData from "./metadata/metadata";
import nftVideos2 from "./nftVideos";
// import PaginatedItems } from "./pagination";
import { useSearchParams } from "react-router-dom";

export default function MyNfts() {
  const [contract, setcontract] = useState("");
  const [accounts, setaccounts] = useState();
  const [isOwner, setisOwner] = useState(false);
  const [, setNftsJson] = useState([]);
  const [nftMetadata, setnftMetadata] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [giftTokenId, setgiftTokenId] = useState();
  const [influencerAddress, setinfluencerAddress] = useState("");
  const [filters, setfilters] = useState([]);
  const [filteredMetada , setFilteredMetadata] = useState(metaData)
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [MyNfts, setMyNfts] = useState()
  const [SelectedMetadata, setSelectedMetadata] = useState();

  let [searchParams, setSearchParams] = useSearchParams();


  useEffect(() => {
    getWeb3Custom();
  }, []);

  const getWeb3Custom = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const instance = new web3.eth.Contract(contract_abi, contract_address);
    setcontract(instance);
    setaccounts(accounts);
    instance && accounts && getNftsByAddress(instance, accounts);
    //check is owner
    // let owner = await instance.methods.owner().call();
    // if(owner == accounts[0]){
    //   setisOwner(true)
    // }else{
    //   setisOwner(false)
    // }
  };

  const getNftsByAddress = async (contract, accounts) => {
    let nftsId =
      accounts.length &&
      (await contract?.methods?.getNftsByAddress(accounts[0]).call());
    console.log("nfts" , nftsId)
    // const myNfts = metaData.filter(nft => nftsId.includes(nft.id))
    const myNfts = nftsId.map(nft => metaData[nft -1] )
    console.log("myNfts" , myNfts)
    setMyNfts(myNfts)
}
  //   const modifiedPackage = await Promise.all(
  //     packages.map(async (packageObj) => {
  //       let modifiedObj = {};
  //       const supply =
  //         accounts.length &&
  //         (await contract?.methods?.getSupplyByType(packageObj.name).call());
  //       modifiedObj = {
  //         ...packageObj,
  //         remainingSupply: packageObj.totalSupply - supply,
  //       };
  //       return modifiedObj;
  //     })
  //   );
  //   modifiedPackage.length && setPackages(modifiedPackage);
  //   setLoading(false);
  // };
  const connectToMetamask = async () => {
    window &&
      window.ethereum &&
      window.ethereum.request({ method: "eth_requestAccounts" });
  };

  window &&
    window.ethereum &&
    window.ethereum.on("accountsChanged", function (accounts) {
      // Time to reload your interface with accounts[0]!
      // contract && accounts &&  getNftsByAddress(contract ,accounts)
      window.location.reload();
    });

  const getBuyNft = async () => {
    if (selectedTypes.length < 1) {
      return;
    }
    // setLoading(true)
    let nftsPrice = await contract.methods
      .calculateNftPrice(selectedTypes)
      .call();
    if (nftsPrice < 1) {
      return;
    }
    await contract.methods
      .buyInBulk(selectedTypes)
      .send({ from: accounts[0], value: nftsPrice });

    setLoading(true);
    // getNftsByAddress(contract, accounts);
  };

  const sendNftsToInfluencer = async () => {
    let owner = await contract.methods.ownerOfNft(giftTokenId).call();

    if (owner !== accounts[0]) {
      alert(
        "You are not owner of this NFT or you already sent this to influencer."
      );
    } else {
      await contract.methods
        .sentToInfluencers(giftTokenId, influencerAddress)
        .send({ from: accounts[0] });
    }
  };



  if (Loading) {
    return <ClipLoader color={"white"} loading={Loading} size={150} />;
  }
  return (
    <div>
      <div className="elementor-widget-container">
      <h2> My NFTS </h2>
        {accounts && accounts.length ? (
          <div>
            <div className="elementor-widget-container">
              <div
                className="
      qodef-shortcode qodef-m qodef-section-title
      qodef-alignment--center "
                style={{ margin: "40px 0px" }}
              >
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="elementor-widget-container"></div>
            </div>

            <div style={{ textAlign: "center" }}>
              <section
                className="
      elementor-section
      elementor-top-section
      elementor-element
      elementor-element-705fef1
      qodef-elementor-content-grid
      elementor-section-full_width
      elementor-section-content-middle
      elementor-section-height-default
      elementor-section-height-default
    "
                data-id="705fef1"
                data-element_type="section"
              >
              

              <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                width:"1300px"
              }}
              className="elementor-container elementor-column-gap-no"
            >
              { SelectedMetadata ? <SelectedNftComponent
                SelectedMetadata={SelectedMetadata}
                setSelectedMetadata={setSelectedMetadata}
                contract={contract}
                accounts={accounts}
                />  :  MyNfts?.length ?
                MyNfts.map((MyNfts) => {
                  const videoSource =
                    nftVideos2[
                      MyNfts.name
                        .split(".")[0]
                        .replace(/\s/g, "")
                        .replace(/-/g, "")
                    ];
                  console.log("vide", videoSource);
                  return (
                    <div
                      className="
          elementor-column
          elementor-col-285
          elementor-top-column
          elementor-element
          elementor-element-35e0623
        "
                      data-id="35e0623"
                      data-element_type="column"
                      style={{ marginRight: "35px", cursor: "pointer" }}
                    >
                      <div
                        className="
            elementor-widget-wrap elementor-element-populated
          "
                      >
                        <div
                          className="
              elementor-element
              elementor-element-73e3105
              elementor-widget
              elementor-widget-image
            "
                          data-id="73e3105"
                          data-element_type="widget"
                          data-widget_type="image.default"
                          onClick={() => setSelectedMetadata(MyNfts)}
                        >
                          <div
                            className="elementor-widget-container"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <video width="370" height="417" autoPlay loop muted>
                              <source src={videoSource} type="video/mp4" />
                            </video>
                          </div>
                          <h6 className="qodef-m-title">
                            {" "}
                            {MyNfts.name} {false ? `(${MyNfts.id})` : ""}
                          </h6>{" "}
                        </div>
                      </div>
                    </div>
                  );
                }) :  <div
                className="
      elementor-column
      elementor-col-285
      elementor-top-column
      elementor-element
      elementor-element-35e0623
      "
                data-id="35e0623"
                data-element_type="column"
                style={{  textAlign:"center"}}
              > <h3> You do not have any NFTs. </h3> </div>}
            </div>


              </section>

              {isOwner ? (
                <section
                  className="
    elementor-section
    elementor-top-section
    elementor-element
    elementor-element-705fef1
    qodef-elementor-content-grid
    elementor-section-full_width
    elementor-section-content-middle
    elementor-section-height-default
    elementor-section-height-default
  "
                  data-id="705fef1"
                  data-element_type="section"
                >
                  <h1> Gift To Influencers </h1>
                  <div className="elementor-widget-container">
                    <OwnerSection
                      giftTokenId={giftTokenId}
                      setgiftTokenId={setgiftTokenId}
                      influencerAddress={influencerAddress}
                      setinfluencerAddress={setinfluencerAddress}
                      sendNftsToInfluencer={sendNftsToInfluencer}
                    />
                  </div>
                </section>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          <div
            className="elementor-widget-container"
            style={{
              marginBottom: "300px",
              marginTop: "200px",
              textAlign: "center",
            }}
          >
            <input
              onClick={connectToMetamask}
              type="submit"
              // style={{ marginTop: "60px" }}
              name="submit"
              className="es_subscription_form_submit es_submit_button es_textbox_button "
              id="es_subscription_form_submit_61a61952eae4f"
              value="Connect Metamask"
            />
          </div>
        )}
      </div>
    </div>
  );
}


export function SelectedNftComponent({
    SelectedMetadata,
    setSelectedMetadata,
    contract,
    accounts
  }) {
    const [Nft, setNft] = useState();
    const [NftPrice, setNftPrice] = useState(0)
    const [NftIsForSale, setNftIsForSale] = useState(false)

    useEffect(async () => {
      getNft();
    }, []);
    const getNft = async () => {
      let nft = await contract.methods.Nfts(SelectedMetadata.id).call();
      setNft(nft);
      nft?.price == 0 ? setNftPrice(0) :setNftPrice(nft?.price);
      setNftIsForSale(nft?.isForSale) 
    };
  
    const updateNft =async () => {
   
         await contract.methods
        .setNftsData(Nft.id , NftPrice , NftIsForSale )
        .send({ from: accounts[0]});

    }
    console.log("nft", Nft);
    const metaData = SelectedMetadata;
    const owner =
      Nft?.owner == "0x0000000000000000000000000000000000000000"
        ? "0xA1F3d449113578D3DAF2051F00090a9Cd6E056E6"
        : Nft?.owner;
    const isForSale =  Nft?.owner == "0x0000000000000000000000000000000000000000" ? true : Nft?.isForSale

    return (
      <div
        className="
  elementor-column
  elementor-col-285
  elementor-top-column
  elementor-element
  elementor-element-35e0623
  "
        data-id="35e0623"
        data-element_type="column"
        style={{ marginRight: "35px" }}
      >
        <div
          className="
  elementor-widget-wrap elementor-element-populated
  "
        >
          <h6
            onClick={() => setSelectedMetadata(null)}
            className="qodef-m-title"
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            {" "}
            <i
              className="fa fa-chevron-circle-left"
              style={{ fontSize: "24px", marginRight: "10px" }}
            ></i>{" "}
            Back to My-Nfts{" "}
          </h6>
  
          <div
            className="
  elementor-element
  elementor-element-73e3105
  elementor-widget
  elementor-widget-image
  "
            data-id="73e3105"
            data-element_type="widget"
            data-widget_type="image.default"
            style={{ display: "flex", justifyContent: "center" }}
            // onClick={()=>setSelectedMetadata(metaData)}
          >
            <div
              className="elementor-widget-container"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <video width="370" height="417" autoPlay loop muted>
                <source
                  src={
                    nftVideos2[
                      metaData.name
                        .split(".")[0]
                        .replace(/\s/g, "")
                        .replace(/-/g, "")
                    ]
                  }
                  type="video/mp4"
                />
              </video>
            </div>
            <div
            style={{
                display: "flex",
                flexDirection:"column",
                justifyContent: "center",
                alignItems:"flex-start"
              }}
            >
              <h4 className="qodef-m-title"> {metaData.name}</h4>{" "}
              <h6 className="qodef-m-title"> # {`${metaData.id}`}</h6>{" "}
              <h6 className="qodef-m-title"> Owner : {owner} </h6>{" "}
              <div style={{display : 'flex'}}>
              <h6 className="qodef-m-title">Price:   </h6>
              <input
              type="number"
              value={NftPrice}
              onChange={(e) => setNftPrice(e.target.value)}
            /> 
            <h6>Wei </h6>
              </div>
             
              {/*  <h6 className="qodef-m-title">Color : {metaData?.properties?.color}</h6>
              <h6 className="qodef-m-title">Rarity : {metaData?.properties?.rarity}</h6>
              <h6 className="qodef-m-title">Type : {metaData?.properties?.type}</h6>
           */}
              <h6 className="qodef-m-title">
                Season : {metaData?.properties?.season}
              </h6>
              <h6 className="qodef-m-title">
                Design : {metaData?.properties?.design}
              </h6>
              <div    style={{
                display: "flex",
                justifyContent: "center",
              
              }}>
            <h6  className="qodef-m-title"> Is For Sale: </h6> 
              <select value={NftIsForSale} onChange={e => setNftIsForSale(e.target.value)} id="cars" style={{width: '115px' , marginLeft:"20px"}} >
              <option value="true">True</option>
              <option value="false">False</option>
            </select> </div>
            <input
              onClick={updateNft}
              style={{  margin :"40px 0px"}}
              type="submit"
              className="es_subscription_form_submit es_submit_button es_textbox_button "
              id="es_subscription_form_submit_61a61952eae4f"
              value="Update"
            />
            </div>
          </div>
        </div>
      </div>
    );
  }