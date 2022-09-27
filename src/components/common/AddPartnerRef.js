import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { _addPartnerRef } from "../../store/actions/userActions";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function AddPartnerRef() {
  let query = useQuery();
  const ref = query.get("ref");
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (ref) {
      window.localStorage.setItem("partner-ref", ref);
      dispatch(_addPartnerRef());
      toast.success("Ref added");
      history.push("/pre-sale");
    }
  }, [dispatch, history, ref]);

  return null;
}
