import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import { develop, local, production, staging } from "./environment";
import { formatAddress } from "./format";
export const ACCESS_TOKEN_KEY = "CBt3gpbqeMdWPNG1";
export const DEVICE_KEY = "uU5tEUmAgvBWArsv";
export const SCOPES_KEY = "AhBcmvr1EkMdPnL5";
export const S3_URL = "/images/";
export const PROJECT_LOCATION = "GLOBAL";
export const hostname = window.location.hostname.replace("www.", "");

//setup environment
export let AppConfig = production;
if ([""].includes(hostname)) {
  AppConfig = local;
} else if (
  ["localhost", "marketplaceinfinity.feliciastation.com"].includes(hostname)
) {
  AppConfig = develop;
} else if (["marketplace.megdev.co"].includes(hostname)) {
  AppConfig = staging;
} else {
  AppConfig = production;
}
export const { API, image_url } = AppConfig;
export const explorer_url = `${AppConfig.ETHERSCAN_LINK}/tx`;

export const makeID = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const deviceInfo = () => {
  var navUserAgent = navigator.userAgent;
  var browserName = navigator.appName;
  var browserVersion = "" + parseFloat(navigator.appVersion);
  // var majorVersion = parseInt(navigator.appVersion, 10);
  var tempNameOffset, tempVersionOffset, tempVersion;

  if ((tempVersionOffset = navUserAgent.indexOf("Opera")) !== -1) {
    browserName = "Opera";
    browserVersion = navUserAgent.substring(tempVersionOffset + 6);
    if ((tempVersionOffset = navUserAgent.indexOf("Version")) !== -1)
      browserVersion = navUserAgent.substring(tempVersionOffset + 8);
  } else if ((tempVersionOffset = navUserAgent.indexOf("MSIE")) !== -1) {
    browserName = "Microsoft Internet Explorer";
    browserVersion = navUserAgent.substring(tempVersionOffset + 5);
  } else if ((tempVersionOffset = navUserAgent.indexOf("Chrome")) !== -1) {
    browserName = "Chrome";
    browserVersion = navUserAgent.substring(tempVersionOffset + 7);
  } else if ((tempVersionOffset = navUserAgent.indexOf("Safari")) !== -1) {
    browserName = "Safari";
    browserVersion = navUserAgent.substring(tempVersionOffset + 7);
    if ((tempVersionOffset = navUserAgent.indexOf("Version")) !== -1)
      browserVersion = navUserAgent.substring(tempVersionOffset + 8);
  } else if ((tempVersionOffset = navUserAgent.indexOf("Firefox")) !== -1) {
    browserName = "Firefox";
    browserVersion = navUserAgent.substring(tempVersionOffset + 8);
  } else if (
    (tempNameOffset = navUserAgent.lastIndexOf(" ") + 1) <
    (tempVersionOffset = navUserAgent.lastIndexOf("/"))
  ) {
    browserName = navUserAgent.substring(tempNameOffset, tempVersionOffset);
    browserVersion = navUserAgent.substring(tempVersionOffset + 1);
    if (browserName.toLowerCase() === browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }

  // trim version
  if ((tempVersion = browserVersion.indexOf(";")) !== -1)
    browserVersion = browserVersion.substring(0, tempVersion);
  if ((tempVersion = browserVersion.indexOf(" ")) !== -1)
    browserVersion = browserVersion.substring(0, tempVersion);

  var OSName = "Unknown OS";
  if (navigator.appVersion.indexOf("Win") !== -1) OSName = "Windows";
  if (navigator.appVersion.indexOf("Mac") !== -1) OSName = "MacOS";
  if (navigator.appVersion.indexOf("X11") !== -1) OSName = "UNIX";
  if (navigator.appVersion.indexOf("Linux") !== -1) OSName = "Linux";

  return browserName + " V" + browserVersion + " (" + OSName + ")";
};

export const CustomToast = (type, content) => {
  if (type === "error") {
    toast.error(
      <div
        style={{
          display: "flex",
          alignContent: "center",
        }}
      >
        <Typography variant="body2">{content}</Typography>
      </div>
    );
  } else {
    toast.success(
      <div
        style={{
          display: "flex",
          alignContent: "center",
        }}
      >
        <Typography variant="body2">{content}.</Typography>
      </div>
    );
  }
};

export function getLinkHash(data) {
  if (data) {
    const { type, network, txId } = data;
    if (txId) {
      if (type === "EXTERNAL") {
        let address = null;
        if (network === "TRC20" || network === "TRX") {
          address = `https://tronscan.org/#/transaction/${txId}`;
        }
        if (network === "ERC20" || network === "ETH") {
          address = `https://etherscan.io/tx/${txId}`;
        }
        if (network === "EOS") {
          address = `https://bloks.io/transaction/${txId}`;
        }
        if (network === "BTC") {
          address = `https://www.blockchain.com/btc/tx/${txId}`;
        }
        if (network === "FIL") {
          address = `https://filfox.info/zh/message/${txId}`;
        }
        return (
          <a href={address} target="_blank" rel="noreferrer">
            {formatAddress(data.txId)}
          </a>
        );
      } else {
        return formatAddress(txId);
      }
    } else return null;
  } else {
    return null;
  }
}

//random number from 1 to limit
export function randomNumber(limit) {
  return Math.floor(Math.random() * limit) + 1;
}
