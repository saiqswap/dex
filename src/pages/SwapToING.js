import { ArrowRightAlt } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CustomLoadingButton } from "../components/common/CustomButton";
import CustomModal from "../components/common/CustomModal";
import { CancelButton, SignButton } from "../components/header/SignPopup";
import { AppConfig } from "../settings";
import { formatNumberWithDecimal } from "../settings/format";
import { get, post } from "../utils/api";
import useResponsive from "../hooks/useResponsive";

const imgSrc = `/images/swap-ingl.png`;

const CustomFixedBox = styled(Box)(({ theme }) => ({
  position: "fixed",
  width: "100vw",
  height: "100vh",
  background: "url('/images/backgrounds/background.png')",
  overflow: "auto",
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(20),
}));

const CustomBox = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  backdropFilter: "blur(20px)",
  border: "1px solid var(--border-color)",
  borderRadius: theme.spacing(2),
  width: "100%",
}));

const CustomImage = styled("img")(({ theme }) => ({
  width: "70%",
  // paddingLeft: "10%",
  // height: "100%",
  objectFit: "contain",
  margin: "auto",
}));

const SwapForm = styled(Box)(({ theme }) => ({
  padding: theme.spacing(5),
  borderLeft: "1px solid var(--border-color)",
  [theme.breakpoints.down("md")]: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    padding: theme.spacing(2),
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function SwapToING() {
  const [config, setConfig] = React.useState(null);
  const [INGLBalance, setINGLBalance] = React.useState("");
  const { setting, user } = useSelector((state) => state);
  const { applicationConfig } = setting;
  const { walletAddress } = user;

  React.useEffect(() => {
    if (applicationConfig && walletAddress) {
      syncBalance();
    }
  }, [applicationConfig, walletAddress]);

  const syncBalance = async () => {
    (async () => {
      try {
        const config =
          applicationConfig.CHAIN_CONFIG[applicationConfig.CHAIN_TYPE];
        const provider = new ethers.providers.StaticJsonRpcProvider(
          config.rpcUrls[0]
        );
        const contractInstance = new ethers.Contract(
          applicationConfig.ADDRESS_INGL,
          AppConfig.BLOCKCHAIN.ERC20_ABI,
          provider
        );
        var balance = await contractInstance.balanceOf(walletAddress);
        console.log(balance);
        setINGLBalance(formatNumberWithDecimal(formatEther(balance), 4));
      } catch (error) {
        console.log(error);
        setINGLBalance(0);
      }
    })();
  };

  React.useEffect(() => {
    get(
      `/swap-nft-to-ing-lock/item`,
      (data) => {
        data.sort(
          (a, b) =>
            a.nftType.toLowerCase().localeCompare(b.nftType.toLowerCase()) ||
            a.nftLevel.toLowerCase().localeCompare(b.nftLevel.toLowerCase())
        );
        setConfig(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <CustomFixedBox>
      <Container>
        <CustomBox>
          <Grid container alignItems={"center"}>
            <Grid item md={6} xs={12}>
              <CustomImage src={imgSrc} />
              {walletAddress ? (
                <Box textAlign={"center"}>
                  <Typography
                    mt={5}
                    textAlign={"center"}
                    onClick={syncBalance}
                    sx={{ cursor: "pointer" }}
                  >
                    Owned:{" "}
                    <span style={{ fontSize: "1.2rem", fontWeight: 900 }}>
                      {INGLBalance}{" "}
                    </span>{" "}
                    INGL (ING Lock)
                  </Typography>
                  <Typography variant="caption">
                    (Click balance to sync data onchain)
                  </Typography>
                </Box>
              ) : null}
            </Grid>
            <Grid item md={6} xs={12}>
              <SwapING syncBalance={syncBalance} />
            </Grid>
            <Grid item xs={12}>
              <PriceList data={config} />
            </Grid>
          </Grid>
        </CustomBox>
      </Container>
    </CustomFixedBox>
  );
}

function SwapING({ syncBalance }) {
  const [loading, setLoading] = React.useState(false);
  const [selectedNft, setSelectedNft] = React.useState(null);
  const [total, setTotal] = React.useState(0);
  const [nftConfig, setNftConfig] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [data, setData] = React.useState(null);
  const [allNFT, setAllNFT] = React.useState(null);
  const [sync, setSync] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);
  const [agree, setAgree] = React.useState(false);
  const [totalAllNFT, setTotalAllNFT] = React.useState(0);
  const { user } = useSelector((state) => state);
  const { information } = user;
  var isDesktop = useResponsive("up", "sm");

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange = (e) => {
    const find = allNFT.find((n) => n.key === e.target.value);
    if (e.target.value !== undefined) setSelectedNft(find);
    else {
      setTotal(0);
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (value && !selectedNft) {
      toast.error("Please select type of NFT for swap !!!");
    } else if (!agree) {
      toast.error("Please read and agree Infinity Angel Term of Service");
    } else {
      setConfirming(true);
    }
  };

  const handleSwap = () => {
    setConfirming(false);
    setLoading(true);
    if (value) {
      post(
        `/swap-nft-to-ing-lock/swap-old-nft`,
        {
          nftType: selectedNft.nftType,
          nftLevel: selectedNft.nftLevel,
        },
        () => {
          toast.success("Success");
          setLoading(false);
          setSync(!sync);
          setTotal(0);
          setSelectedNft(null);
          syncBalance();
        },
        (error) => {
          toast.error(error.msg);
          setLoading(false);
        }
      );
    } else {
      post(
        `/swap-nft-to-ing-lock/swap-old-nft`,
        {
          nftType: null,
          nftLevel: null,
        },
        () => {
          toast.success("Success");
          setLoading(false);
          setSync(!sync);
          syncBalance();
        },
        (error) => {
          toast.error(error.msg);
          setLoading(false);
        }
      );
    }
  };

  React.useEffect(() => {
    if (selectedNft) {
      post(
        `/swap-nft-to-ing-lock/item-price`,
        {
          nftType: selectedNft.nftType,
          nftLevel: selectedNft.nftLevel,
        },
        (data) => {
          setTotal(data);
          setLoading(false);
        },
        (error) => {
          console.log(error.msg);
          setLoading(false);
        }
      );
    }
  }, [selectedNft]);

  React.useEffect(() => {
    get(
      `/nft/swap/my-nfts`,
      (data) => {
        const items = [];
        for (const [key, value] of Object.entries(data)) {
          const arrText = key.split("_");
          let nftType;
          if (arrText[0] === "ANGEL") {
            nftType = 0;
          } else if (arrText[0] === "MINION") {
            nftType = 1;
          } else {
            nftType = 2;
          }
          if (value) {
            items.push({
              key,
              label: key.toLocaleLowerCase().replaceAll("_", " "),
              nftType,
              nftLevel: Number(key.charAt(key.length - 1)) - 1,
              amount: value,
              nftTypeText: arrText[0],
              nftLevelText: `TIER_${Number(key.charAt(key.length - 1))}`,
            });
          }
        }
        setData([...items]);
      },
      () => {}
    );
    get(
      `/swap-nft-to-ing-lock/item`,
      (data) => {
        data.sort(function (a, b) {
          return a.nftType - b.nftType || a.nftLevel - b.nftLevel;
        });
        setNftConfig([...data]);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [sync]);

  React.useEffect(() => {
    if (data && nftConfig) {
      let tempTotalAllING = 0;
      data.forEach((nft) => {
        const findConfig = nftConfig.find(
          (config) =>
            nft.nftTypeText === config.nftType.split("_")[0] &&
            nft.nftLevelText === config.nftLevel
        );
        if (findConfig) {
          const total =
            nft.amount * ((findConfig.basePrice * findConfig.percentage) / 100);
          tempTotalAllING += total;
          nft.basePrice = findConfig.basePrice;
          nft.percentage = findConfig.percentage;
          nft.total = total;
        }
      });
      setAllNFT(data);
      setTotalAllNFT(tempTotalAllING);
    }
  }, [data, nftConfig, sync]);

  return (
    <SwapForm component="form" onSubmit={handleConfirm}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChangeTab}
          aria-label="basic tabs example"
          sx={{
            ".MuiButtonBase-root": {
              padding: "8.8px 16px",
              borderRadius: "7px",
              border: "unset",
              "&.Mui-selected": { background: "rgba(255, 255, 255, 0.1)" },
            },
          }}
        >
          <Tab
            label={
              <Typography className="custom-font">
                Swap all (Recommend)
              </Typography>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <Typography className="custom-font">Swap by type</Typography>
            }
            {...a11yProps(1)}
            sx={{
              ".MuiButtonBase-root": {
                padding: "8.8px 16px",
                borderRadius: "7px",
                border: "unset",
                "&.Mui-selected": { background: "rgba(255, 255, 255, 0.1)" },
              },
            }}
          />
        </Tabs>
      </Box>
      {!information ? (
        <Box
          height={350}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography variant="body1" fontWeight={700}>
            Please login to get your NFT(s).
          </Typography>
        </Box>
      ) : !value ? (
        <SwapAllDetails data={allNFT} />
      ) : (
        <>
          <CustomBox
            mt={2}
            sx={{ padding: { xs: "2rem 1rem", sm: "3rem 1.5rem" } }}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <FormControl sx={{ width: 200 }}>
                <InputLabel id="demo-simple-select-label">NFT type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedNft?.key ? selectedNft?.key : ""}
                  label="NFT type"
                  onChange={handleChange}
                  sx={{ textTransform: "capitalize" }}
                >
                  <MenuItem value={""}>None</MenuItem>
                  {allNFT?.map((nft, index) => {
                    return (
                      <MenuItem
                        value={nft.key}
                        key={nft.key}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {nft?.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Typography
                fontWeight={900}
                variant="h6"
                sx={{ padding: "0 0.5rem" }}
              >
                {selectedNft?.basePrice || 0}
              </Typography>
              <CloseIcon />
              <TextField
                sx={{ width: 100, textAlign: "center" }}
                InputProps={{
                  sx: { color: "white" },
                }}
                label="Amount"
                value={selectedNft?.amount || 0}
              />
            </Stack>
          </CustomBox>
          <CustomBox
            mt={5}
            sx={{ padding: { xs: "2rem 1rem", sm: "3rem 1.5rem" } }}
          >
            <Stack
              direction={"row"}
              alignItems={"center"}
              textAlign={"left"}
              justifyContent={"space-between"}
            >
              <Typography
                fontWeight={900}
                variant="h6"
                sx={{ padding: "0 0.5rem" }}
              >
                {formatNumberWithDecimal(
                  selectedNft?.amount * selectedNft?.basePrice
                )}
              </Typography>
              <CloseIcon />
              <Typography
                fontWeight={900}
                variant="h6"
                sx={{ padding: "0 0.5rem" }}
              >
                {selectedNft?.percentage || 0}%
              </Typography>
              <Box>
                <ArrowRightAlt fontSize="large" />
              </Box>
              <TextField
                sx={{ width: 200 }}
                InputProps={{
                  sx: { color: "white" },
                }}
                value={total}
                label="Total ING will receive"
              />
            </Stack>
          </CustomBox>
        </>
      )}
      <Box mt={5}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" my={2}>
            Note: ING received after swap is locked for 120 days, but you can
            purchase NODE NFTs using locked ING even during the lock period.
          </Typography>
          <Stack
            direction={isDesktop ? "row" : "column"}
            alignItems={isDesktop ? "center" : ""}
            justifyContent={"space-between"}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  name="antoine"
                  disabled={!information}
                />
              }
              label={
                <Typography variant="caption">
                  I agree to the{" "}
                  <Link
                    href="https://docs.google.com/document/d/1g08gnUzfheQRkowTbv0ME4UudXbe86ZOE2P1_4TGPxo/edit"
                    target="_blank"
                  >
                    Infinity Angel Term of Service
                  </Link>
                  .
                </Typography>
              }
              sx={{ my: 2 }}
            />
            <CustomLoadingButton
              variant="contained"
              sx={{ width: "100px!important" }}
              loading={loading}
              type="submit"
              disabled={!information}
            >
              Swap
            </CustomLoadingButton>
          </Stack>
        </Box>
      </Box>
      <CustomModal open={confirming}>
        <Box py={5} px={3}>
          <Typography variant="h5">
            Are you sure for swap this items to ING Lock ?
          </Typography>
          <Box my={5}>
            {value ? (
              <Typography style={{ textTransform: "capitalize" }}>
                Type: {selectedNft?.label}
              </Typography>
            ) : (
              <Typography>Type: All of NTFs</Typography>
            )}
            <Typography>
              You will receive:{" "}
              {formatNumberWithDecimal(!value ? totalAllNFT : total, 2)} ING
              Lock
            </Typography>
          </Box>
          <Box
            sx={(theme) => ({
              display: "flex",
              justifyContent: "space-between",
              [theme.breakpoints.down("sm")]: {
                display: "block",
              },
            })}
          >
            <CancelButton onClick={() => setConfirming(false)}>
              Cancel
            </CancelButton>
            <Box width={12}></Box>
            <SignButton onClick={handleSwap}>Confirm</SignButton>
          </Box>
        </Box>
      </CustomModal>
    </SwapForm>
  );
}

const SwapAllDetails = ({ data }) => {
  return (
    <Box width={"100%"} overflow={"auto"} height={350} mt={1}>
      <table className="custom-table">
        <thead>
          <tr>
            <TableTH className="custom-font">Type</TableTH>
            <TableTH className="custom-font">Amount</TableTH>
            <TableTH className="custom-font">Total</TableTH>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <tr key={index}>
              <td style={{ textTransform: "capitalize" }}>{row?.label}</td>
              <td>{row?.amount}</td>
              <td>{formatNumberWithDecimal(row?.total, 2)} ING</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

const PriceList = ({ data }) => {
  return (
    <Box width={"100%"} overflow={"auto"}>
      <table className="custom-table">
        <thead>
          <tr>
            <TableTH className="custom-font">Type</TableTH>
            <TableTH className="custom-font">Level</TableTH>
            <TableTH className="custom-font">Price</TableTH>
            <TableTH className="custom-font">Bonus</TableTH>
            <TableTH className="custom-font">Total</TableTH>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, index) => (
            <tr key={index}>
              <td style={{ textTransform: "capitalize" }}>
                {row?.nftType.replaceAll("_", " ").toLocaleLowerCase()}
              </td>
              <td style={{ textTransform: "capitalize" }}>
                {row?.nftLevel.replaceAll("_", " ").toLocaleLowerCase()}
              </td>
              <td>{row?.basePrice} ING</td>
              <td>{row?.percentage}%</td>
              <td>{(row?.basePrice * row?.percentage) / 100} ING</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

const TableTH = styled("th")(({ theme }) => ({
  wordBreak: "keep-all",
}));
