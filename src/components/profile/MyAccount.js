import { ContentCopyRounded } from "@mui/icons-material";
import {
  Container,
  Divider,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { formatAmount } from "../../settings/format";
import { post } from "../../utils/api";
import CopyBox from "../common/CopyBox";
import Loader from "../common/Loader";

const menu = {
  title: "NFT History",
  type: ["BUY_NFT", "DELIST", "LISTING"],
  columns: [
    { key: "senderEmail", label: "Email", format: (e) => `${e}` },
    {
      key: "boxType",
      label: "Box type",
      format: (e) => `${e.replace("_", " ")}`,
    },
    { key: "price", label: "Price", format: (e) => `${formatAmount(e)}` },
  ],
};

const needSymbol = ["amount", "price"];

const MyAccount = () => {
  const { user } = useSelector((state) => state);
  const history = useHistory();
  const { information } = user;
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const param = {
      page: page,
      pageSize: 10,
      search: "",
      orderBy: "",
      getMeta: false,
      filters: {},
    };
    post(
      "/affiliate/my-commission-history",
      param,
      (data) => {
        setData(data);
        console.log(data.items);
      },
      (err) => {
        toast.error(err);
      }
    );
  }, [page]);

  useEffect(() => {
    if (!user) history.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!information) return null;
  return (
    <Container maxWidth="xl" className="account-page">
      <Typography variant="h5" className="custom-font">
        Account Setting
      </Typography>
      <Divider className="mt-20" />
      <p className="mt-20 opacity-05">Name</p>
      <p className="username">{information.username}</p>
      <p className="mt-20 opacity-05">Email address</p>
      <p className="email">{information.email}</p>
      <p className="mt-20 opacity-05">Referral link</p>
      <p className="referral">
        <CopyBox
          content={`${window.location.origin}/referral-link?referral=${information.id}`}
        >
          <small style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: 16 }}>
            {window.location.origin}/referral-link?referral={information.id}
          </small>
          <IconButton
            style={{
              marginLeft: 10,
              padding: 2,
              background: "transparent",
              border: "none",
            }}
          >
            <ContentCopyRounded
              sx={{ fontSize: 14, fill: "rgba(255, 255, 255, 0.6)" }}
            />
          </IconButton>
        </CopyBox>
      </p>
      <Typography
        variant="h5"
        className="custom-font"
        style={{ marginTop: "50px" }}
      >
        Affiliate
      </Typography>
      <Divider className="mt-20" />
      <div>
        <table className="custom-table">
          <thead>
            <tr>
              {menu.columns.map((col, index) => (
                <th className="custom-font" key={index}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data &&
              data.items.map((row, index) => (
                <tr key={index}>
                  {menu.columns.map((col) => (
                    <td key={col.key}>
                      {col.format
                        ? col.format(row[col.key], row)
                        : row[col.key]}
                      {needSymbol.includes(col.key) && " " + row.coin}
                    </td>
                  ))}
                </tr>
              ))}
            {data && data.itemCount === 0 && (
              <tr>
                <td className="blank" colSpan={menu.columns.length}>
                  NO RECORD
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {data ? (
          <Pagination
            count={data.pageCount}
            variant="outlined"
            shape="rounded"
            onChange={(e, nextPage) => setPage(nextPage)}
            defaultPage={page}
          />
        ) : (
          <Loader />
        )}
      </div>
    </Container>
  );
};

export default MyAccount;
