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
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React from "react";
import { CustomLoadingButton } from "../components/common/CustomButton";
import { get, post } from "../utils/api";
import { EndpointConstant } from "../settings/endpoint";

const imgSrc = `/images/ig-ing.png`;

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
  width: "90%",
  paddingLeft: "10%",
  height: "100%",
  objectFit: "contain",
}));

const SwapForm = styled(Box)(({ theme }) => ({
  padding: theme.spacing(5),
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
}));

export default function SwapToING() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    get(
      `/nft/swap/my-nfts`,
      (data) => {
        const items = [];
        for (const [key, value] of Object.entries(data)) {
          // console.log(`${key}: ${value}`);
          const arrText = key.split("_");
          let nftType;
          if (arrText[0] === "ANGEL") {
            nftType = 0;
          } else if (arrText[0] === "MINION") {
            nftType = 1;
          } else {
            nftType = 2;
          }
          items.push({
            key,
            label: key.toLocaleLowerCase().replaceAll("_", " "),
            nftType,
            nftLevel: Number(key.charAt(key.length - 1)) - 1,
            amount: value,
          });
        }
        console.log(items);
        setData(items)
      },
      (error) => { }
    );
  }, []);

  return (
    <CustomFixedBox>
      <Container>
        <CustomBox>
          <Grid container>
            <Grid item md={6} xs={12}>
              <CustomImage src={imgSrc} />
            </Grid>
            <Grid item md={6} xs={12}>
              <SwapING data={data} />
            </Grid>
          </Grid>
        </CustomBox>
      </Container>
    </CustomFixedBox>
  );
}

function SwapING({ data = [] }) {
  const [loading, setLoading] = React.useState(false);
  const [selectedNft, setSelectedNft] = React.useState([]);
  const [priceAmount, setPriceAmount] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [nftConfig, setNftConfig] = React.useState([]);

  const handleChange = (e) => {
    setLoading(true);
    if (e.target.value !== undefined)
      setSelectedNft(data[e.target.value])
    else {
      setNftConfig([])
      setNftConfig([])
      setPriceAmount(0)
      setTotal(0)
    }
  };

  React.useEffect(() => {

  }, []);
  React.useEffect(() => {
    if (selectedNft !== []) {
      get(
        `/swap-nft-to-ing-lock/item?NftType=${selectedNft.nftType}&NftLevel=${selectedNft.nftLevel}`,
        (data) => {
          console.log(data);
          setNftConfig(data)
          setPriceAmount(data.basePrice * selectedNft.amount)
          setTotal((data.basePrice * selectedNft.amount) * data.percentage / 100)

          setLoading(false);
        },
        (error) => {
          console.log(error);
        }
      );
      post(
        `/swap-nft-to-ing-lock/item-price`,
        {
          nftType: selectedNft.nftType,
          nftLevel: selectedNft.nftLevel
        },
        (data) => {
          console.log(data);
          setTotal(data)
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, [selectedNft]);

  const handleSwap = (e) => {
    e.preventDefault()
    setLoading(true);
    post(
      `/swap-nft-to-ing-lock/swap-old-nft`,
      {
        nftType: selectedNft.nftType,
        nftLevel: selectedNft.nftLevel
      },
      (data) => {
        console.log(data);
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );
  };

  return (
    <SwapForm component="form" onSubmit={handleSwap}>
      <Typography variant="h6">Swap</Typography>
      <CustomBox mt={2} sx={{ padding: { xs: '2rem 1rem', sm: '3rem 1.5rem' } }}>
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
              value={selectedNft?.key || undefined}
              label="NFT type"
              onChange={handleChange}
              sx={{ textTransform: 'capitalize' }}
            >
              <MenuItem value={undefined}>None</MenuItem>
              {data?.map((nftType, index) => {
                return (
                  <MenuItem value={index} key={index} sx={{ textTransform: 'capitalize' }}>
                    {nftType?.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Typography fontWeight={900} variant="h6" sx={{ padding: '0 0.5rem' }}>
            {nftConfig?.basePrice || 0}
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
      <CustomBox mt={5}
        sx={{ padding: { xs: '2rem 1rem', sm: '3rem 1.5rem' } }}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          textAlign={"left"}
          justifyContent={"space-between"}
        >
          <Typography fontWeight={900} variant="h6" sx={{ padding: '0 0.5rem' }}>
            {priceAmount}
          </Typography>
          <CloseIcon />
          <Typography fontWeight={900} variant="h6" sx={{ padding: '0 0.5rem' }}>
            {nftConfig?.percentage || 0}%
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
            label="Total"
          />
        </Stack>
      </CustomBox>
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
                  checked={true}
                  //   onChange={handleChange}
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
    </SwapForm>
  );
}
