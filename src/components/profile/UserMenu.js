import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { formatAddress } from "../../settings/format";
import UserAvatar from "../common/UserAvatar";

const menus = [
  {
    icon: <AccountBoxIcon />,
    url: "/profile/account",
    label: "Account",
    key: "account",
  },
  {
    icon: <WidgetsIcon />,
    url: "/profile/my-items?type=angel",
    label: "My Items",
    key: "my-items",
  },
  {
    icon: <HistoryEduIcon />,
    url: "/profile/history",
    label: "History",
    key: "history",
  },
  {
    icon: <AccountBalanceWalletIcon />,
    url: "/profile/wallet",
    label: "Wallet",
    key: "wallet",
  },
];

const UserMenu = ({ component }) => {
  const { user } = useSelector((state) => state);
  const history = useHistory();
  const { information, walletAddress } = user;

  useEffect(() => {
    if (!user) history.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!information) return null;
  return (
    <div className="user-menu">
      <UserAvatar className="avatar" id={information.id} size="large" />
      <Typography textAlign={"center"} className="mt-20 ">
        {information.email.replace("@gmail.com", "")}
      </Typography>
      {walletAddress && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
            justifyContent: "center",
          }}
        >
          <Typography>Metamask: </Typography>
          <Button variant="outlined" className="ml-10 ">
            <CopyToClipboard
              text={`${walletAddress}`}
              onCopy={() => toast.success("copped")}
            >
              <span style={{ cursor: "pointer" }}>
                {formatAddress(walletAddress, 5)}
              </span>
            </CopyToClipboard>
          </Button>
        </div>
      )}
      <ul className="menus custom-font">
        {menus.map((item, index) => (
          <li key={index} className={component === item.key ? "active" : ""}>
            <Link to={item.url}>
              <Button className="custom-font" startIcon={item.icon}>
                {item.label}
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserMenu;
