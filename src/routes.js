import BoxesPage from "./pages/BoxesPage";
import BoxMinting from "./pages/BoxMinting";
import ErrorPage from "./pages/ErrorPage";
import Homepage from "./pages/Homepage";
import Marketplace from "./pages/Marketplace";
import NFTDetail from "./pages/NFTDetail";
import PresalePage from "./pages/PresalePage";
import PreSaleRound from "./pages/PreSaleRound";
import PreSaleStatistic from "./pages/PreSaleStatistic";
import Profile from "./pages/Profile";
import ReferralLink from "./pages/ReferralLink";
import ResearchInstitute from "./pages/ResearchInstitute";
import Summon from "./pages/Summon";
import SwapPage from "./pages/SwapPage";

const routes = [
  {
    exact: true,
    path: "/swap",
    component: SwapPage,
    type: "guest",
    isActive: true,
    title: "Swap INC to ING",
  },
  // {
  //   exact: true,
  //   path: "/pre-sale/statistic",
  //   component: PreSaleStatistic,
  //   type: "guest",
  //   isActive: true,
  // },
  // {
  //   exact: true,
  //   path: "/pre-sale/:round",
  //   component: PreSaleRound,
  //   type: "guest",
  //   isActive: true,
  // },
  // {
  //   exact: true,
  //   path: "/pre-sale",
  //   component: PresalePage,
  //   type: "guest",
  //   isActive: true,
  // },
  {
    exact: true,
    path: "/minting-box",
    component: BoxMinting,
    type: "guest",
    isActive: true,
    title: "Box Minting",
  },
  // {
  //   exact: true,
  //   path: "/marketplace",
  //   component: Marketplace,
  //   type: "guest",
  //   isActive: true,
  // },
  {
    exact: false,
    path: "/nft-detail/:id",
    component: NFTDetail,
    type: "guest",
    isActive: true,
  },
  {
    exact: false,
    path: "/summon",
    component: Summon,
    isActive: true,
    title: "Summon",
    type: "private",
  },
  {
    exact: false,
    path: "/research-institute/:comp",
    component: ResearchInstitute,
    type: "private",
    isActive: true,
    title: "Research Institute",
  },
  // {
  //   exact: false,
  //   path: "/boxes",
  //   component: BoxesPage,
  //   type: "guest",
  //   isActive: true,
  //   title: "Buy Box",
  // },
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
    exact: true,
    path: "/",
    component: Homepage,
    type: "guest",
    isActive: true,
  },
  {
    path: "*",
    component: ErrorPage,
  },
];

export default routes;
