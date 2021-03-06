import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ReactPaginate from "react-paginate";
import nftVideos2 from "./nftVideos";
import ClipLoader from "react-spinners/ClipLoader";
import { contract_address } from "./constants";
import {
  NavLink,
  useNavigate,
  useSearchParams,
  useLocation,
  // useHistory
} from "react-router-dom";
import { browserHistory } from "react-router";

const NFT_PRICE = {
  Genesis: "770000000000000000",
  Legendary: "260000000000000000",
  Mythic: "510000000000000000",
  Rare: "140000000000000000",
};

function Items({ currentItems, setSelectedMetadata, filters, searchtext }) {

  const applyFilters = (id) => {
    if (filters.length && searchtext) {
      window.location.href = `/?type=${filters.join(
        ","
      )}&search=${searchtext}&select=${id}`;
    } else if (filters.length) {
      window.location.href = `/?type=${filters.join(",")}&select=${id}`;
    } else if (searchtext) {
      window.location.href = `/?search=${searchtext}&select=${id}`;
    } else {
      window.location.href = `/?select=${id}`;
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "1260px",
        }}
        className="elementor-container elementor-column-gap-no"
      >
        {currentItems?.length ? (
          currentItems.map((currentItems) => {
            const videoSource =
              nftVideos2[
                currentItems.name
                  .split(".")[0]
                  .replace(/\s/g, "")
                  .replace(/-/g, "")
              ];
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
                    onClick={() => {
                      applyFilters(currentItems.id)
                    }}
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
                      {currentItems.name} {false ? `(${currentItems.id})` : ""}
                    </h6>{" "}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
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
            style={{ minWidth: "1300px", textAlign: "center" , marginLeft:"100px" }}
          >
            {" "}
            <h3> No NFT found for this filters. </h3>{" "}
          </div>
        )}
      </div>
    </>
  );
}

export function SelectedNftComponent({
  SelectedMetadata,
  setSelectedMetadata,
  contract,
  accounts,
}) {
  const [Nft, setNft] = useState();
  const [Owner, setOwner] = useState();
  const [Loading, setLoading] = useState(false);

  useEffect(async () => {
    getNft();
  }, []);
  const getNft = async () => {
    let nft = await contract.methods.Nfts(SelectedMetadata.id).call();
    let owner = await contract.methods.owner().call();
    setNft(nft);
    setOwner(owner);
    console.log("loader" , Loading )
    // if(Loading){
      setLoading(false)
    // }
  };

  const buyNft = async () => {
    if (Nft?.owner == "0x0000000000000000000000000000000000000000") {
      const result = await contract.methods
        .mintNft(
          SelectedMetadata.id,
          NFT_PRICE[SelectedMetadata.properties.rarity],
          SelectedMetadata.properties.rarity
        )
        .send({
          from: accounts[0],
          value: NFT_PRICE[SelectedMetadata.properties.rarity],
        });

        setLoading(true)

      if (result) {
        getNft();
      }else{
      setLoading(false)

      }
    } else {
      const res = await contract.methods
        .buyNft(Nft.id)
        .send({ from: accounts[0], value: Nft?.price });
        setLoading(true)

      if (res) {
        getNft();
      }else{
        setLoading(false)
  
        }
    }
  };
  const metaData = SelectedMetadata;
  const owner =
    Nft?.owner == "0x0000000000000000000000000000000000000000"
      ? Owner
      : Nft?.owner;
  const price =
    Nft?.price == 0 ? NFT_PRICE[metaData?.properties?.rarity] : Nft?.price;
  const isForSale =
    Nft?.owner == "0x0000000000000000000000000000000000000000"
      ? true
      : Nft?.isForSale;
  console.log("nft", Nft, metaData, NFT_PRICE);

  if (Loading) {
    return <ClipLoader color={"white"} loading={Loading} size={150} />;
  }

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
          Back to marketPlace{" "}
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
          <div style={{ minWidth: "520px" }}>
            <h4 className="qodef-m-title"> {metaData.name}</h4>{" "}
            <h6 className="qodef-m-title"> # {`${metaData.id}`}</h6>{" "}
            <h6 className="qodef-m-title"> Owner : {owner} </h6>{" "}
            <h6 className="qodef-m-title">Price : {Number(price || 0)/1000000000000000000} BNB</h6>
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
            {isForSale && (
              <input
                onClick={buyNft}
                type="submit"
                className="es_subscription_form_submit es_submit_button es_textbox_button "
                id="es_subscription_form_submit_61a61952eae4f"
                value="Buy Now"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaginatedItems({
  itemsPerPage,
  items,
  contract,
  accounts,
  ...props
}) {
  const [SelectedMetadata, setSelectedMetadata] = useState();
  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setcurrentPage] = useState(1);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  let [searchParams, setSearchParams] = useSearchParams();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filters, setfilters] = useState([]);
  const [searchtext, setsearchtext] = useState("");

  let location = useLocation();
  //   let history = useHistory();
  console.log("props", props);
  useEffect(() => {
    // Fetch items from another resources.
    const selectedNft = searchParams.get("select");
    if (selectedNft) {
      console.log("selectedNft", selectedNft);
      const searchedNft = items.filter((item) => item.id == selectedNft);
      setSelectedMetadata(searchedNft[0]);
    }

    const filterType = searchParams.get("type");

    const filtertype = filterType?.split(",");
    filtertype && setfilters(filtertype);

    const filterSearch = searchParams.get("search");
    const filteredSearchNfts = items.filter(
      (item) =>
        item.name.toLowerCase().includes(filterSearch?.toLowerCase()) ||
        filterType?.includes(item.properties.rarity.toLowerCase())
    );
    filterSearch && setsearchtext(filterSearch);

    const filterSearchAndType = items.filter(
      (item) =>
        item.name.toLowerCase().includes(filterSearch?.toLowerCase()) &&
        filterType?.includes(item.properties.rarity.toLowerCase())
    );

    const isFilteredNfts =
      filterType && filterSearch
        ? filterSearchAndType
        : filterType || filterSearch
        ? filteredSearchNfts
        : items;
    console.log("tp", filterType);
    const page = Number(searchParams.get("page"));
    setcurrentPage(page);
    const newOffset = (page * itemsPerPage) % isFilteredNfts.length;
    const endOffset = newOffset + itemsPerPage;

    console.log(`Loading items from ${newOffset} to ${endOffset}`);
    setCurrentItems(isFilteredNfts.slice(newOffset, endOffset));
    console.log("page", isFilteredNfts.slice(newOffset, endOffset));
    setPageCount(Math.ceil(isFilteredNfts.length / itemsPerPage));
  }, [itemsPerPage]);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    const filterType = searchParams.get("type");
    const filterSearch = searchParams.get("search");
    if (filterType && filterSearch) {
      window.location.href = `/?page=${
        event.selected + 1
      }&type=${filterType}&search=${filterSearch}`;
    } else if (filterType) {
      window.location.href = `/?page=${event.selected + 1}&type=${filterType}`;
    } else if (filterSearch) {
      window.location.href = `/?page=${
        event.selected + 1
      }&search=${filterSearch}`;
    } else {
      window.location.href = `/?page=${event.selected + 1}`;
    }

    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
  };

  const filterChanges = (typeOfNft) => {
    if (filters.includes(typeOfNft)) {
      const filteredArr = filters.filter((item) => item !== typeOfNft);
      setfilters(filteredArr);
    } else {
      setfilters([...filters, typeOfNft]);
    }
  };
  const applyFilters = () => {
    if (filters.length && searchtext) {
      window.location.href = `/?page=1&type=${filters.join(
        ","
      )}&search=${searchtext}`;
    } else if (filters.length) {
      window.location.href = `/?page=1&type=${filters.join(",")}`;
    } else if (searchtext) {
      window.location.href = `/?page=1&search=${searchtext}`;
    } else {
      window.location.href = `/?page=1`;
    }
  };

  // const applySearch = () => {
  //   window.location.href = `/?page=1&type=${filters.join(
  //     ","
  //   )}&search=${searchtext}`;
  // };
  return (
    <>
      {SelectedMetadata ? (
        <SelectedNftComponent
          SelectedMetadata={SelectedMetadata}
          setSelectedMetadata={setSelectedMetadata}
          contract={contract}
          accounts={accounts}
       
        />
      ) : (
        <div style={{ display: "flex" }}>
          <div className="elementor-widget-container">
            <h1> Filters </h1>
            <div>
              <div class="new">
                <input
                  type="text"
                  value={searchtext}
                  onChange={(e) => setsearchtext(e.target.value)}
                />
                <input
                  onClick={applyFilters}
                  type="submit"
                  // style={{ marginTop: "60px" }}
                  //   name="submit"
                  className="es_subscription_form_submit es_submit_button es_textbox_button "
                  id="es_subscription_form_submit_61a61952eae4f"
                  value="Search"
                />
                <br />
                <form className="filterBox" style={{ marginTop: "40px" }}>
                  <div class="form-group">
                    <input
                      type="checkbox"
                      id="rare"
                      checked={filters.includes("rare")}
                      onClick={() => filterChanges("rare")}
                    />
                    <label for="rare">Rare</label>
                  </div>
                  <div class="form-group">
                    <input
                      type="checkbox"
                      id="legendary"
                      checked={filters.includes("legendary")}
                      onClick={() => filterChanges("legendary")}
                    />
                    <label for="legendary">Legendary</label>
                  </div>
                  <div class="form-group">
                    <input
                      type="checkbox"
                      id="mythic"
                      checked={filters.includes("mythic")}
                      onClick={() => filterChanges("mythic")}
                    />
                    <label for="mythic">Mythic</label>
                  </div>
                  <div class="form-group">
                    <input
                      type="checkbox"
                      id="genesis"
                      checked={filters.includes("genesis")}
                      onClick={() => filterChanges("genesis")}
                    />
                    <label for="genesis">Genesis</label>
                  </div>
                </form>
              </div>

              <input
                onClick={applyFilters}
                type="submit"
                // style={{ marginTop: "60px" }}
                name="submit"
                className="es_subscription_form_submit es_submit_button es_textbox_button "
                id="es_subscription_form_submit_61a61952eae4f"
                value="Apply"
              />
            </div>
          </div>
          <div>
            <Items
              currentItems={currentItems}
              setSelectedMetadata={setSelectedMetadata}
              contract={contract}
              filters={filters}
              searchtext={searchtext}
            />
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={pageCount}
              previousLabel="< previous"
              renderOnZeroPageCount={null}
              className="paginationsList"
              forcePage={currentPage - 1}
            />{" "}
          </div>{" "}
        </div>
      )}
    </>
  );
}
