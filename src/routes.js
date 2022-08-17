import BoxesPage from "./pages/BoxesPage";
import Summon from "./pages/Summon";
import Profile from "./pages/Profile";
import ReferralLink from "./pages/ReferralLink";
import ResearchInstitute from "./pages/ResearchInstitute";
import Marketplace from "./pages/Marketplace";
import NFTDetail from "./pages/NFTDetail";
import BoxMinting from "./pages/BoxMinting";
import ErrorPage from "./pages/ErrorPage";
import { Redirect } from "react-router-dom";

const routes = [
  {
    exact: true,
    path: "/minting-box",
    component: BoxMinting,
    type: "guest",
    isActive: true,
    title: "Box Minting",
  },
  {
    exact: true,
    path: "/marketplace",
    component: Marketplace,
    type: "guest",
    isActive: true,
  },
  {
    exact: false,
    path: "/nft/:id",
    component: NFTDetail,
    type: "guest",
    isActive: true,
  },
  {
    exact: false,
    path: "/summon",
    component: Summon,
    type: "guest",
    isActive: true,
    title: "Summon",
  },
  {
    exact: false,
    path: "/profile/:comp",
    component: Profile,
    type: "private",
    isActive: true,
    title: "Profile",
  },
  {
    exact: false,
    path: "/referral-link",
    component: ReferralLink,
    type: "guest",
    isActive: true,
  },
  {
    exact: false,
    path: "/research-institute/:comp",
    component: ResearchInstitute,
    type: "guest",
    isActive: true,
    title: "Research Institute",
  },
  {
    exact: false,
    path: "/boxes",
    component: BoxesPage,
    type: "guest",
    isActive: true,
    title: "Buy Box",
  },
  {
    exact: true,
    path: "/",
    children: (
      <Redirect
        to={{
          pathname: "/marketplace",
        }}
      />
    ),
    type: "guest",
    isActive: true,
  },
  {
    path: "*",
    component: ErrorPage,
  },
];

export default routes;
