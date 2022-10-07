import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { _showAppError } from "../../store/actions/settingActions";

export default function ErrorComponent() {
  const { setting } = useSelector((state) => state);
  const { serverError, library } = setting;
  const dispatch = useDispatch();

  useEffect(() => {
    if (serverError) {
      toast.error(
        library[serverError.code]
          ? library[serverError.code]
          : `${library.SOMETHING_WRONG} Error code: ${serverError?.code} [${serverError?.msg}]`
      );
      dispatch(_showAppError(null));
    }
  });

  return <div />;
}
