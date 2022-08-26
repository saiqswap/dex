import { Box, Container, Grid, Hidden } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import History from "../components/profile/History";
import MyAccount from "../components/profile/MyAccount";
import MyItems from "../components/profile/MyItems";
import MyWallet from "../components/profile/MyWallet";
import UserMenu from "../components/profile/UserMenu";
import "../styles/profile.scss";

const Profile = () => {
  const { comp } = useParams();
  const { user } = useSelector((state) => state);
  const { information } = user;
  const history = useHistory();

  // useEffect(() => {
  //   if (!information) {
  //     history.push("/");
  //   }
  // }, [history, information]);

  return (
    <Box mt={10}>
      <Container className="profile-page" maxWidth={"xl"}>
        <Grid container spacing={2}>
          <Hidden mdDown>
            <Grid item md={4} lg={3}>
              <UserMenu component={comp} />
            </Grid>
          </Hidden>
          <Grid item xs={12} md={8} lg={9} style={{ paddingLeft: 30 }}>
            <RenderContent component={comp} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;

const RenderContent = ({ component }) => {
  const Routes = {
    account: <MyAccount />,
    "my-items": <MyItems />,
    history: <History />,
    wallet: <MyWallet />,
  };
  return Routes[component] ? Routes[component] : null;
};
