import { Edit } from "@mui/icons-material";
import { Box, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ENDPOINT_USER_UPDATE_EMAIL } from "../../settings/endpoint";
import { checkEmail, checkEmpty } from "../../settings/validates";
import { _getNewProfile } from "../../store/actions/userActions";
import { put } from "../../utils/api";
import { CustomLoadingButton } from "../common/CustomButton";
import CustomModal from "../common/CustomModal";

export default function UpdateEmail() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { setting } = useSelector((state) => state);
  const { library } = setting;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const _handleUpdateEmail = (e) => {
    e.preventDefault();
    if (checkEmpty(email)) {
      toast.error(library.PLEASE_ENTER_EMAIL);
    } else if (checkEmail(email)) {
      toast.error(library.INVALID_EMAIL);
    } else {
      setLoading(true);
      put(
        ENDPOINT_USER_UPDATE_EMAIL,
        {
          email,
        },
        () => {
          dispatch(_getNewProfile());
          setLoading(false);
          toast.success(library.SUCCESS);
          setOpen(false);
          setEmail("");
        },
        () => {
          toast.error(library.SOMETHING_WRONG);
          setLoading(false);
        }
      );
    }
  };

  return (
    <>
      <Box ml={1} sx={{ cursor: "pointer" }} onClick={() => setOpen(true)}>
        <Edit fontSize="small" />
      </Box>
      <CustomModal
        open={open}
        isShowCloseButton={!loading}
        _close={() => setOpen(false)}
      >
        <Box
          component="form"
          textAlign="left"
          p={2}
          onSubmit={_handleUpdateEmail}
        >
          <Typography mb={3} variant="h6" fontWeight={500}>
            Update email
          </Typography>
          <TextField
            fullWidth
            sx={{ mb: 3 }}
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomLoadingButton loading={loading} type="submit">
            Update
          </CustomLoadingButton>
        </Box>
      </CustomModal>
    </>
  );
}
