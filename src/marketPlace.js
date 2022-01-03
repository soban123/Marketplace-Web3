import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { contract_address, contract_abi } from "./constants";
import getWeb3 from "./getWeb3";
import OwnerSection from "./Owner";
import metaData from "./metadata/metadata";
import nftVideos2 from "./nftVideos";
import PaginatedItems from "./pagination";
import { useSearchParams } from "react-router-dom";

export default function MarketPlace() {
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
    // instance && accounts && getNftsByAddress(instance, accounts);

    //check is owner
    // let owner = await instance.methods.owner().call();
    // if(owner == accounts[0]){
    //   setisOwner(true)
    // }else{
    //   setisOwner(false)
    // }
  };

  // const getNftsByAddress = async (contract, accounts) => {
  //   let nftsId =
  //     accounts.length &&
  //     (await contract?.methods?.getNftsByAddress(accounts[0]).call());
  //   if (nftsId.length) {
  //     const uriArray = await Promise.all(
  //       nftsId.map(async (id) => {
  //         let uri = await contract?.methods?.getURI(id).call();
  //         const uriObj = { uri, id };
  //         return uriObj;
  //       })
  //     );
  //     setNftsJson(uriArray);
  //     if (uriArray.length) {
  //       const getMp4Url = await Promise.all(
  //         uriArray.map(async (uri) => {
  //           let uriRes = await fetch(uri.uri);
  //           uriRes = await uriRes.json();
  //           uriRes = { ...uriRes, uri: uri.uri, id: uri.id };
  //           return uriRes;
  //         })
  //       );
  //       setnftMetadata(getMp4Url);
  //     }
  //   }

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

  const selectPackage = (name) => {
    if (selectedTypes.includes(name)) {
      const filteredPackages = selectedTypes.filter((pack) => pack !== name);
      setSelectedTypes(filteredPackages);
    } else {
      setSelectedTypes([...selectedTypes, name]);
    }
  };


  if (Loading) {
    return <ClipLoader color={"white"} loading={Loading} size={150} />;
  }
  return (
    <div>
      <div className="elementor-widget-container">
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
              

                <PaginatedItems
                  itemsPerPage={12}
                  items={filteredMetada}
                  contract={contract}
                  accounts={accounts}
                />
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
