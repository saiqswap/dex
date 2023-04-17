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
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import { toast } from "react-toastify";
import { CustomLoadingButton } from "../components/common/CustomButton";
import CustomModal from "../components/common/CustomModal";
import { CancelButton, SignButton } from "../components/header/SignPopup";
import { formatNumberWithDecimal } from "../settings/format";
import { get, post } from "../utils/api";

const imgSrc = `/images/swap-ing.png`;

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
  width: "80%",
  // paddingLeft: "10%",
  // height: "100%",
  objectFit: "contain",
  margin: "auto",
}));

const SwapForm = styled(Box)(({ theme }) => ({
  padding: theme.spacing(5),
  [theme.breakpoints.down("md")]: {
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

  React.useEffect(() => {
    get(
      `/swap-nft-to-ing-lock/item`,
      (data) => {
        data.sort((a, b) => b.nftType - a.nftType);
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
          <Grid container spacing={5} alignItems={"center"}>
            <Grid item md={6} xs={12}>
              <CustomImage src={imgSrc} />
            </Grid>
            <Grid item md={6} xs={12}>
              <SwapING />
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

function SwapING() {
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
        setData(items);
      },
      (error) => {}
    );
    get(
      `/swap-nft-to-ing-lock/item`,
      (data) => {
        setNftConfig(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [sync]);

  const handleConfirm = (e) => {
    e.preventDefault();
    if (value && !selectedNft) {
      toast.error("Please select type of NFT for swap !!!");
    } else if (!agree) {
      toast.error("Please read and agree Infinity Games Term of Service");
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
        },
        (error) => {
          toast.error(error.msg);
          setLoading(false);
        }
      );
    }
  };

  React.useEffect(() => {
    if (data && nftConfig) {
      data.forEach((nft) => {
        const findConfig = nftConfig.find(
          (config) =>
            nft.nftTypeText === config.nftType &&
            nft.nftLevelText === config.nftLevel
        );
        if (findConfig) {
          nft.basePrice = findConfig.basePrice;
          nft.percentage = findConfig.percentage;
          nft.total =
            nft.amount * ((findConfig.basePrice * findConfig.percentage) / 100);
        }
      });
      setAllNFT(data);
    }
  }, [data, nftConfig]);

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
      {!value ? (
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
          <Typography variant="caption">
            Note: ING received after swap is locked for 120 days, but you can
            purchase NODE NFTs using locked ING even during the lock period.
          </Typography>
          <Stack
            direction="row"
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  name="antoine"
                />
              }
              label={
                <Typography variant="caption">
                  I agree to the Infinity Games Term of Service.
                </Typography>
              }
            />
            <CustomLoadingButton
              variant="contained"
              sx={{ width: 100 }}
              loading={loading}
              type="submit"
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
              <Typography>Type: {selectedNft?.label}</Typography>
            ) : (
              <Typography>Type: ALL</Typography>
            )}
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
              <td>{row?.nftType}</td>
              <td>{row?.nftLevel}</td>
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
