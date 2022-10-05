import styled from "@emotion/styled";
import { Facebook, Instagram, Telegram, Twitter } from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Title from "../components/box-minting/Title";
import AddPartnerRef from "../components/common/AddPartnerRef";
import BackgroundComponent from "../components/common/BackgroundComponent";
import Loader from "../components/common/Loader";
import ListingAds from "../components/pre-sale/ListingAds";
import PurchaseForm from "../components/pre-sale/PurchaseForm";
import { _getPreSaleRoundList } from "../store/actions/preSaleActions";
const CountdownStack = ({ children }) => (
  <Stack
    sx={{
      background: "rgba(255,255,255,0.1)",
      backdropFilter: "blur(20px)",
      width: "100px",
      height: "100px",
      color: "#fff",
      borderRadius: "10px",
    }}
    justifyContent="center"
  >
    {children}
  </Stack>
);
const countDownRenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return "";
  } else {
    return (
      <Stack direction="row" spacing={1}>
        <CountdownStack>
          <Typography fontSize="2.5rem" textAlign="center">
            {days < 10 ? "0" : ""}
            {days}
          </Typography>
          <Typography fontSize="1rem" mt="-0.5rem" textAlign="center">
            days
          </Typography>
        </CountdownStack>
        <CountdownStack>
          <Typography fontSize="2.5rem" textAlign="center">
            {hours < 10 ? "0" : ""}
            {hours}
          </Typography>
          <Typography fontSize="1rem" mt="-0.5rem" textAlign="center">
            hours
          </Typography>
        </CountdownStack>
        <CountdownStack>
          <Typography fontSize="2.5rem" textAlign="center">
            {minutes < 10 ? "0" : ""}
            {minutes}
          </Typography>
          <Typography fontSize="1rem" mt="-0.5rem" textAlign="center">
            min
          </Typography>
        </CountdownStack>
        <CountdownStack>
          <Typography fontSize="2.5rem" textAlign="center">
            {seconds < 10 ? "0" : ""}
            {seconds}
          </Typography>
          <Typography fontSize="1rem" mt="-0.5rem" textAlign="center">
            sec
          </Typography>
        </CountdownStack>
      </Stack>
    );
  }
};
const socials = [
  {
    icon: <Facebook fontSize="small" />,
    link: "https://www.facebook.com/InfinityAngel.io/",
  },
  {
    icon: <Twitter fontSize="small" />,
    link: "https://twitter.com/InfinityAngelio",
  },
  {
    icon: <Instagram fontSize="small" />,
    link: "https://www.instagram.com/infinity_angel_official/",
  },
  {
    icon: <Telegram fontSize="small" />,
    link: "https://t.me/infinityangel_global",
  },
  {
    icon: <TipsAndUpdatesIcon fontSize="small" />,
    link: "https://doc.infinityangel.io/economy/monetary-system/infinity-universe-gem-ing",
  },
];
const BackButton = styled(Button)(({ theme }) => ({
  borderRadius: "7px!important",
  border: "1px solid var(--border-color)",
  backgroundColor: "rgba(0, 51, 98, 0.1)!important",
  backdropFilter: "blur(20px)",
  padding: "6px 16px",
  marginBottom: theme.spacing(2),
}));

export default function PreSaleRound() {
  const { round } = useParams();
  const [data, setData] = useState(null);
  const { setting, preSale } = useSelector((state) => state);
  const { library } = setting;
  const history = useHistory();
  const { preSaleRoundList } = preSale;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(_getPreSaleRoundList());
    const timer = setInterval(() => {
      dispatch(_getPreSaleRoundList());
    }, 10000);
    return () => clearInterval(timer);
  }, [dispatch]);

  useEffect(() => {
    if (preSaleRoundList) {
      const checkRound = preSaleRoundList[round - 1];
      if (checkRound) {
        setData(checkRound);
      } else {
        setData("UNKNOWN");
      }
    }
  }, [preSaleRoundList, round]);

  useEffect(() => {
    if (data === "UNKNOWN") {
      history.push("/");
    }
  }, [data, history]);

  return (
    <BackgroundComponent>
      {data ? (
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          {data && (
            <Grid container spacing={5}>
              <Info data={data} />
              <PurchaseForm data={data} />
              {/* <Grid item xs={12}>
                <Divider />
              </Grid> */}
              {/* <Grid item xs={12}>
                <Notice data={data} />
              </Grid> */}
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Information library={library} />
              </Grid>
            </Grid>
          )}
        </Container>
      ) : (
        <Loader />
      )}

      <AddPartnerRef />
    </BackgroundComponent>
  );
}

const SocialComponent = () => {
  return (
    <Box
      display="flex"
      sx={{
        " button": {
          minWidth: "unset",
        },
      }}
    >
      {socials.map((s, index) => (
        <IconButton
          component={Link}
          href={s.link}
          target="_blank"
          key={index}
          sx={{
            mr: 1,
            bgcolor: "rgba(0, 51, 98, 0.1)!important",
            backdropFilter: "blur(20px)",
          }}
        >
          {s.icon}
        </IconButton>
      ))}
    </Box>
  );
};

const Notice = ({ data }) => {
  const { setting } = useSelector((state) => state);
  const { library } = setting;

  return (
    <Box
      textAlign="left"
      //  py={1} px={2}
    >
      <Typography
        variant="h6"
        mt={2}
        color="primary"
        sx={{
          textTransform: "uppercase",
        }}
      >
        {library.NOTICE}
      </Typography>
      <ul style={{ marginLeft: "1rem", listStyle: "outside" }}>
        {data.notices?.map((item, index) => (
          <li key={index}>
            <Typography variant="body2">{library[item]}</Typography>
          </li>
        ))}
        <li>
          <Typography variant="body2">{library.PRESALE_NOTICE_3}</Typography>
        </li>
        <li>
          <Typography variant="body2">{library.PRESALE_NOTICE_4}</Typography>
        </li>
        <li>
          <Typography variant="body2">{library.PRESALE_NOTICE_5}</Typography>
        </li>
      </ul>
    </Box>
  );
};

const Information = ({ library }) => {
  return (
    <Box textAlign="left" py={1} px={2}>
      <Typography
        variant="h6"
        mt={2}
        color="primary"
        sx={{ textTransform: "uppercase" }}
      >
        {library.INFORMATION}
      </Typography>
      <Typography mt={1}>{library.PRESALE_INFORMATION_1}</Typography>
      <Typography variant="body2" mt={1} mb={1}>
        {library.PRESALE_INFORMATION_2}
      </Typography>
      <Typography variant="body2">{library.PRESALE_INFORMATION_3}</Typography>
    </Box>
  );
};

const Info = ({ data }) => {
  const history = useHistory();
  const now = moment().utc().unix() * 1000;
  const dispatch = useDispatch();
  const { setting } = useSelector((state) => state);
  const { library } = setting;

  const _getStatusProduct = (product) => {
    const { startAt, endAt, currentSold, totalSupply } = product;
    const start = startAt * 1000;
    const end = endAt * 1000;
    let status = "BUY_NOW";
    if (now - end > 0) {
      status = "END_TIME";
    }
    if (start - now > 0) {
      status = "COMING_SOON";
    }
    let tempMinimum = (1 / parseFloat(data.USDPrice)) * data.minUSD;
    if (totalSupply - currentSold <= tempMinimum || product.isStaticEnd) {
      status = "SOLD_OUT";
    }
    return status;
  };

  const status = _getStatusProduct(data);
  let countdownComponent = null;
  let countdownTitle = null;
  if (status === "COMING_SOON") {
    countdownTitle = library.ING_PRESALE_STARTS_IN;
    countdownComponent = (
      <Countdown
        date={Date.now() + (data.startAt * 1000 - now)}
        renderer={(props) => countDownRenderer(props)}
        onComplete={() => dispatch(_getPreSaleRoundList())}
      />
    );
  }
  if (status === "BUY_NOW") {
    countdownTitle = library.ING_PRESALE_ENDS_IN;
    countdownComponent = (
      <Countdown
        date={Date.now() + (data.endAt * 1000 - now)}
        renderer={(props) => countDownRenderer(props)}
        onComplete={() => dispatch(_getPreSaleRoundList())}
      />
    );
  }

  return (
    <Grid item xs={12} md={6} lg={7}>
      <BackButton onClick={() => history.push("/")}>
        <ArrowBackIosIcon fontSize="small" />
        <Typography>{library.BACK}</Typography>
      </BackButton>
      <Box mb={2}>
        <Title
          variant="h4"
          sx={{
            fontWeight: 500,
            textAlign: "left",
          }}
        >
          {library.ING_TITLE}
        </Title>
      </Box>
      <SocialComponent />
      <INGInfo />
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} lg={6}>
          <Title variant="h5" sx={{ textAlign: "left", mt: 2 }}>
            {countdownTitle}
          </Title>
          <Box
            sx={{
              transform: "scale(0.7)",
              marginLeft: "-18%",
            }}
          >
            {countdownComponent}
          </Box>
        </Grid>
        <Grid item xs={12} lg={6}>
          {data.key === 3 ? <ListingAds /> : null}
        </Grid>
      </Grid>
      <Notice data={data} />
    </Grid>
  );
};

const INGInfo = () => {
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  return (
    <Box textAlign="left" mt={2}>
      <ul
        style={{
          marginLeft: "1rem",
          listStyle: "outside",
          opacity: 0.9,
          lineHeight: "24px",
        }}
      >
        {[0, 1, 2, 3].map((item, index) => (
          <li key={index}>
            <Typography variant="body2" key={index}>
              {library[`ING_INFORMATION_${index + 1}`]}
            </Typography>
          </li>
        ))}
      </ul>
    </Box>
  );
};
