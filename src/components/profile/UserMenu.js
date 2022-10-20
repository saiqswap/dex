import { Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard/lib/Component";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { PROFILE_MENUS, RI_USER_TYPE } from "../../settings/constants";
import { formatAddress } from "../../settings/format";
import UserAvatar from "../common/UserAvatar";

const UserMenu = ({ component }) => {
  const { user, setting } = useSelector((state) => state);
  const history = useHistory();
  const { information, walletAddress, riUserType } = user;
  const { library } = setting;

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
        {PROFILE_MENUS.map(
          (item, index) =>
            (item.key !== "ri-factory" ||
              (item.key === "ri-factory" &&
                riUserType === RI_USER_TYPE.ROOT)) && (
              <li
                key={index}
                className={component === item.key ? "active" : ""}
              >
                <Link to={item.url}>
                  <Button className="custom-font" startIcon={item.icon}>
                    {library[item.label]}
                  </Button>
                </Link>
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default UserMenu;
