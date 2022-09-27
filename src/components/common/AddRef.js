import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { _addRef } from "../../store/actions/userActions";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function AddRef() {
  let query = useQuery();
  const ref = query.get("ref");
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (ref) {
      window.localStorage.setItem("ref", ref);
      dispatch(_addRef());
      toast.success("Ref added");
      history.push("/minting-box");
    }
  }, [dispatch, history, ref]);

  return null;
}
