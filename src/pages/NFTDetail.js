import { ArrowForward } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import Loader from "../components/common/Loader";
import ItemDetail from "../components/item-detail/ItemDetail";
import { API } from "../settings";
import {
  formatAddress,
  formatAmount,
  _linkToBlockChain,
} from "../settings/format";
import { _getMyItems } from "../store/actions/userActions";
import "../styles/marketplace-angel-detail.scss";
import { defaultHeaders, post } from "../utils/api";
import { getAccessToken } from "../utils/auth";

export default function NFTDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { user, setting } = useSelector((state) => state);
  const [transaction, setTransaction] = useState([]);
  const { myItems, information } = user;
  const { config } = setting;
  const dispatch = useDispatch();
  const history = useHistory();

  const _handleReload = () =>
    setTimeout(() => {
      dispatch(_getMyItems());
    }, 3000);

  useEffect(() => {
    getNftTransaction(id, (result) => {
      setTransaction(result);
    });
  }, [id]);

  useEffect(() => {
    if (config && myItems) {
      getNftDetail(id, (result) => {
        let check = false;
        let isRenderBtnByOwner = null;
        if (myItems && information) {
          check = myItems.find((e) => e.tokenId.toString() === id);
          if (check) {
            isRenderBtnByOwner = true;
          } else {
            isRenderBtnByOwner = false;
          }
        }
        setData({
          ...result,
          tokenId: id,
          isOwner: check,
          isRenderBtnByOwner,
          paymentInformation: config.contracts.find(
            (e) => e.contractAddress === result.paymentContract
          ),
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myItems, config]);

  useEffect(() => {
    if (config) {
      if (!myItems) {
        getNftDetail(id, (result) => {
          if (result.tokenId) {
            setData({
              ...result,
              tokenId: id,
              paymentInformation: config.contracts.find(
                (e) => e.contractAddress === result.paymentContract
              ),
            });
          } else {
            history.push("/marketplace");
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return (
    <Container maxWidth="lg" className="detail-page nft-detail">
      <Grid container>
        <Grid item xs={12}>
          {data && <ItemDetail data={data} _handleReload={_handleReload} />}
          {!data && <Loader />}
        </Grid>
        {transaction && transaction.items && transaction.items.length > 0 && (
          <Grid item xs={12} className="transaction-history">
            <Box>
              <h2 className="custom-font">History</h2>
              {transaction.items.map((item, index) => (
                <Card key={index} className="transaction-item">
                  <CardContent className="transaction">
                    <div>
                      <div className="text-opacity">
                        {formatAddress(item.fromAddress)}
                      </div>
                      <div className="price">
                        <div>
                          {formatAmount(
                            item.amount.toString().replace("-", "")
                          )}
                        </div>{" "}
                        &nbsp;
                        <div>{item.coin}</div>
                      </div>
                    </div>
                    <div className="text-opacity">
                      <ArrowForward />
                    </div>
                    <div className="text-opacity">
                      <div>{formatAddress(item.toAddress)}</div>
                      <div>
                        {moment(item.createdTime).format("YYYY-MM-DD HH:mm:ss")}
                      </div>
                    </div>
                  </CardContent>
                  <Box textAlign="center">
                    Tx Hash:{" "}
                    <Typography
                      component={Link}
                      href={_linkToBlockChain(`/tx/${item.txHash}`)}
                      target="_blank"
                    >
                      {formatAddress(item.txHash)}{" "}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

function getNftDetail(id, successCallback, errorCallback) {
  let url = `${API}/nft?tokenId=${id}`;
  let headers = defaultHeaders;
  headers["Authorization"] = "bearer " + getAccessToken();
  fetch(url, {
    method: "GET",
    headers: headers,
    body: null,
  }).then((r) => {
    if (successCallback) {
      r.json().then((result) => {
        successCallback(result);
      });
    }
  });
}

function getNftTransaction(tokenId, successCallback, errorCallback) {
  let params = {
    types: ["BUY_NFT"],
    refId: tokenId,
    page: 1,
    pageSize: 100,
  };
  post(
    "/nft-transaction/anonymous/list",
    params,
    (result) => {
      successCallback(result);
    },
    () => {
      errorCallback();
    }
  );
}
