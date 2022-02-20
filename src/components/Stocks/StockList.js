import React, { useState, useEffect } from "react";
import "./Stocks.css";
import { MdEdit, MdDelete } from "react-icons/md";
import { BASE_URL } from "../../resources/constants";

function StockList() {
  const [tickerOutput, setTickerOuput] = useState([]);
  const [cryptoOutput, setCryptoOutput] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [editTicker, setEditTicker] = useState("");
  const [editUpper, setEditUpper] = useState("");
  const [editLower, setEditLower] = useState("");
  const [option, setOption] = useState("");
  const [editType, setEditType] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [getError, setGetError] = useState("");
  const [postError, setPostError] = useState("");

  function getPriceData() {
    fetch(`${BASE_URL}/getStocks`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setGetError(data.error);
          return;
        }

        var stocks = [];
        var cryptos = [];

        data.forEach((ticker) => {
          if (ticker.type === "stock") {
            stocks.push(ticker);
          } else if (ticker.type === "crypto") {
            cryptos.push(ticker);
          }
        });

        setCryptoOutput(cryptos);
        setTickerOuput(stocks);
      });
  }

  function showModal(
    ticker = "",
    upper = "",
    lower = "",
    type = "",
    status = ""
  ) {
    setEditTicker(ticker);
    setEditUpper(upper);
    setEditLower(lower);
    setEditType(type);
    setEditStatus(status);
    setPostError("");

    setModalShow(true);
  }

  function deleteTicker(ticker) {
    fetch(`${BASE_URL}/deleteTicker/${ticker}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        getPriceData();
      });
  }

  function handleTickerEdit() {
    if (
      !editTicker ||
      !editLower ||
      !editUpper ||
      !editTicker ||
      !editStatus ||
      editLower > editUpper
    ) {
      setPostError("Invalid input.");
      return;
    }

    const myTicker = JSON.stringify({
      ticker: editTicker,
      lower: editLower,
      upper: editUpper,
      type: editType,
      status: editStatus,
    });

    if (option === "Add") {
      fetch(`${BASE_URL}/addTicker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: myTicker,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setPostError(data.error);
            return;
          }
          setModalShow(false);
          getPriceData();
        });
    } else if (option === "Edit") {
      fetch(`${BASE_URL}/updateTicker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: myTicker,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setPostError(data.error);
            return;
          }
          setModalShow(false);
          getPriceData();
        });
    }
  }

  useEffect(() => {
    const intervalID = setInterval(() => {
      getPriceData();
    }, 1000 * 90);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  useEffect(() => {
    getPriceData();
  }, []);

  return (
    <div>
      <input
        className="AddButton"
        type="button"
        onClick={() => {
          setOption("Add");
          showModal();
        }}
        value="ADD TICKER"
      ></input>
      {getError ? <span className="Error">{getError}</span> : ""}
      <div className="Crypto-Header">CRYPTO</div>
      <div className="StockList">
        {cryptoOutput.map((crypto) => {
          var status = "HOLD";
          var cardBackground = {
            background: "#ECA72C",
          };

          if (crypto.price >= crypto.upper) {
            status = "SELL";
            cardBackground = {
              background: "red",
            };
          } else if (crypto.price <= crypto.lower) {
            status = "BUY";
            cardBackground = {
              background: "green",
            };
          }

          return (
            <div style={cardBackground} className="Content">
              <div className="TickerPrice">
                <h1>{crypto.ticker}</h1>
                <p className="Price">{crypto.price}</p>
              </div>
              <div className="StatusDiv">
                <p className="Status">{status}</p>
                <MdDelete onClick={() => deleteTicker(crypto.ticker)} />
                &nbsp;&nbsp;
                <MdEdit
                  onClick={() => {
                    setOption("Edit");
                    showModal(
                      crypto.ticker,
                      crypto.upper,
                      crypto.lower,
                      crypto.type,
                      crypto.status
                    );
                  }}
                />
                <p>
                  {crypto.status === "bought" ? "Should Sell" : "Should Buy"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="Stock-Header">STONKS</div>
      <div className="StockList">
        {tickerOutput.map((out) => {
          var status = "HOLD";
          var cardBackground = {
            background: "#ECA72C",
          };

          if (out.price >= out.upper) {
            status = "SELL";
            cardBackground = {
              background: "red",
            };
          } else if (out.price <= out.lower) {
            status = "BUY";
            cardBackground = {
              background: "green",
            };
          }

          return (
            <div style={cardBackground} className="Content">
              <div className="TickerPrice">
                <h1>{out.ticker}</h1>
                <p className="Price">{out.price.toFixed(2)}</p>
              </div>
              <div className="StatusDiv">
                <p className="Status">{status}</p>
                <MdDelete onClick={() => deleteTicker(out.ticker)} />
                &nbsp;&nbsp;
                <MdEdit
                  onClick={() => {
                    setOption("Edit");
                    showModal(
                      out.ticker,
                      out.upper,
                      out.lower,
                      out.type,
                      out.status
                    );
                  }}
                />
                <p>{out.status === "bought" ? "Should Sell" : "Should Buy"}</p>
              </div>
            </div>
          );
        })}
      </div>
      {modalShow ? (
        <div className="EditModalBg">
          <div className="EditModal">
            {postError ? <span className="Error">{postError}</span> : ""}
            {option === "Add" ? (
              <input
                type="text"
                id="ticker"
                placeholder="Ticker..."
                value={editTicker}
                onChange={(e) => setEditTicker(e.target.value)}
              ></input>
            ) : (
              <h1>{editTicker}</h1>
            )}
            <input
              type="text"
              id="upper"
              placeholder="Upper Bound..."
              value={editUpper}
              onChange={(e) => setEditUpper(e.target.value)}
            ></input>
            <input
              type="text"
              id="lower"
              placeholder="Lower Bound..."
              value={editLower}
              onChange={(e) => setEditLower(e.target.value)}
            ></input>
            <span>
              <input
                type="radio"
                name="type"
                id="stock"
                value="stock"
                onClick={(e) => setEditType(e.target.value)}
              ></input>{" "}
              Stock
              <input
                type="radio"
                name="type"
                id="crypto"
                value="crypto"
                onClick={(e) => setEditType(e.target.value)}
              ></input>{" "}
              Crypto
            </span>
            <br />
            <span>
              <input
                type="radio"
                name="status"
                id="bought"
                value="bought"
                onClick={(e) => setEditStatus(e.target.value)}
              ></input>{" "}
              Bought
              <input
                type="radio"
                name="status"
                id="sold"
                value="sold"
                onClick={(e) => setEditStatus(e.target.value)}
              ></input>{" "}
              Sold
            </span>

            <div className="InputDiv">
              <input
                className="SubmitButton"
                type="button"
                value="SUBMIT"
                onClick={() => handleTickerEdit()}
              ></input>
              <input
                className="CancelButton"
                type="button"
                value="CANCEL"
                onClick={() => setModalShow(false)}
              ></input>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default StockList;
