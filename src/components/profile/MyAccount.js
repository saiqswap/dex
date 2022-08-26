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
  // title: "NFT History",
  type: ["BUY_NFT", "DELIST", "LISTING"],
  columns: [
    { key: "senderEmail", label: "EMAIL", format: (e) => `${e}` },
    {
      key: "boxType",
      label: "BOX_TYPE",
      format: (e) => `${e.replace("_", " ")}`,
    },
    { key: "price", label: "PRICE", format: (e) => `${formatAmount(e)}` },
  ],
};

const needSymbol = ["amount", "price"];

const MyAccount = () => {
  const { user, setting } = useSelector((state) => state);
  const history = useHistory();
  const { information } = user;
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const { library } = setting;

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
        {library.ACCOUNT_SETTING}
      </Typography>
      <Divider className="mt-20" />
      <p className="mt-20 opacity-05">{library.EMAIL}</p>
      <p className="email">{information.email}</p>
      <p className="mt-20 opacity-05">{library.REFERRAL_LINK}</p>
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
        {library.AFFILIATE}
      </Typography>
      <Divider className="mt-20" />
      <div>
        <table className="custom-table">
          <thead>
            <tr>
              {menu.columns.map((col, index) => (
                <th className="custom-font" key={index}>
                  {library[col.label]}
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
                  {library.NO_RECORDS_FOUND}
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
