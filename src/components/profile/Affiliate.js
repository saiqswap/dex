import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EndpointConstant } from "../../settings/endpoint";
import { formatAmount } from "../../settings/format";
import { post } from "../../utils/api";
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
    { key: "amount", label: "Commission", format: (e) => `${formatAmount(e)}` },
  ],
};

const needSymbol = ["amount", "price"];

export default function Affiliate() {
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
      EndpointConstant.MY_COMMISSION_HISTORY,
      param,
      (data) => {
        setData(data);
      },
      (err) => {
        toast.error(err);
      }
    );
  }, [page]);

  return (
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
                    {col.format ? col.format(row[col.key], row) : row[col.key]}
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
  );
}
