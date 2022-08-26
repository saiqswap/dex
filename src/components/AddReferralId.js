import { useEffect, useMemo } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import Homepage from "../pages/Homepage";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const AddReferralId = () => {
  let query = useQuery();
  const history = useHistory();

  useEffect(() => {
    const referral = query.get("referral");

    if (referral) {
      localStorage.setItem("referral", referral);
    }
    // history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Homepage />;
};

export default AddReferralId;
