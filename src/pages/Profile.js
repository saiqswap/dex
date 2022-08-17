import { Container, Grid } from "@mui/material";
import React from "react";
import { useParams } from "react-router";
import History from "../components/profile/History";
import MyAccount from "../components/profile/MyAccount";
import MyItems from "../components/profile/MyItems";
import MyWallet from "../components/profile/MyWallet";
import UserMenu from "../components/profile/UserMenu";
import "../styles/profile.scss";

const Profile = () => {
  const { comp } = useParams();

  return (
    <>
      <Container className="profile-page" maxWidth={"xl"}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <UserMenu component={comp} />
          </Grid>
          <Grid item xs={9} style={{ paddingLeft: 30 }}>
            <RenderContent component={comp} />
          </Grid>
        </Grid>
      </Container>
    </>
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
