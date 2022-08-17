import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import "../styles/boxes-page.scss";
import { Container, Grid, Hidden, Typography } from "@mui/material";
import { get, post } from "../utils/api";
import { parseUnits } from "ethers/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { checkBeforeBuy, getReceipt, purchaseBox } from "../onchain/onchain";
import { _getBalance } from "../store/actions/userActions";
import BoxItem from "../components/boxes/BoxItem";
import Loader from "../components/common/Loader";

const BoxesPage = () => {
  return (
    <Box>
      <BoxesContainer />
    </Box>
  );
};

export default BoxesPage;

const BoxesContainer = () => {
  const dispatch = useDispatch();
  const [boxes, setBoxes] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, setting } = useSelector((state) => state);
  const { metamaskProvider, walletAddress } = user;
  const { config } = setting;
  const [mounted, setMounted] = useState(true);
  const [template, setTemplate] = useState(null);
  let interval;

  const _clearInterval = () => {
    clearInterval(interval);
  };

  const handleGetBoxes = () => {
    get("/market/boxes-for-sell", (result) => {
      if (mounted) {
        setBoxes(result);
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    const param = {
      page: 1,
      pageSize: 200,
      getMeta: false,
    };
    post(
      "/nft/templates",
      param,
      (result) => {
        setTemplate(result.items);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    handleGetBoxes();
    return () => setMounted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const _handleErrorCallback = (error) => {
    toast.error(error.message);
    // console.log(error);
    setLoading(false);
  };

  const _handlePurchaseBox = (box) => {
    const purchaseToken = config.contracts.find(
      (e) => e.contractAddress === box.paymentContract
    );
    setLoading(true);

    var boxScPrice = parseUnits(box.price.toString(), purchaseToken.decimals);

    checkBeforeBuy(
      config.purchaseContract,
      box.paymentContract,
      boxScPrice,
      walletAddress,
      _handleErrorCallback
    ).then((result) => {
      if (result) {
        get(
          `/market/box-sc-input?boxId=${box.id}&qty=1`,
          (data) => {
            purchaseBox(
              data,
              boxScPrice,
              box.paymentContract,
              config,
              _handleErrorCallback
            ).then((e) => {
              getReceipt(e, metamaskProvider).then((result) => {
                if (result) {
                  post(
                    `/market/trigger-paid-box?txHash=${e}`,
                    {},
                    (data) => {
                      interval = setInterval(() => {
                        get(`/nft/my-box-by-hash?txHash=${e}`, (data) => {
                          if (data) {
                            _clearInterval();
                            setLoading(false);
                            toast.success(
                              `Congratulations ! You own a Box. Please go to Summon page to unbox.`
                            );
                            handleGetBoxes();
                            dispatch(
                              _getBalance(walletAddress, metamaskProvider)
                            );
                          }
                        });
                      }, 5000);
                    },
                    (error) => {
                      console.log(error);
                      setLoading(false);
                    }
                  );
                }
              });
            });
          },
          (error) => {
            console.log(error);
            setLoading(false);
          }
        );
      }
    });
  };

  return (
    <div
      className="boxes-page"
      style={{ background: "url(/images/backgrounds/background.png)" }}
    >
      <Container>
        <Hidden smDown>
          <div className="banner">
            <Typography variant="h4" className="custom-font" fontWeight={700}>
              <img src="/images/boxes/text.png" width="100%" alt="" />
            </Typography>
            <Typography variant="h6" className="custom-font">
              There are three types of Infinity Angel: Angel Box, Minion Parts
              Box and Costume Box. Infinity Angel Boxes have a certain item drop
              rate. Higher the quality of the Infinity Angel Box, higher the
              chance of dropping high quality Angels / Minion Parts / Costume.
            </Typography>
          </div>
        </Hidden>
        <Grid
          container
          className="box-container"
          spacing={4}
          justifyContent="center"
        >
          {boxes ? (
            boxes.map((item, index) => (
              <BoxItem
                data={item}
                key={index}
                _handlePurchaseBox={_handlePurchaseBox}
                loading={loading}
                template={template && template}
              />
            ))
          ) : (
            <div>
              <Loader />
            </div>
          )}
        </Grid>
      </Container>
    </div>
  );
};
