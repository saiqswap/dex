import ErrorPage from "../pages/ErrorPage";
import Homepage from "../pages/Homepage";
import Profile from "../pages/Profile";
import ReferralLink from "../pages/ReferralLink";

const productionRoutes = [
  // {
  //   exact: true,
  //   path: "/minting-box",
  //   component: BoxMinting,
  //   type: "guest",
  //   isActive: true,
  //   title: "Box Minting",
  // },
  // {
  //   exact: true,
  //   path: "/marketplace",
  //   component: Marketplace,
  //   type: "guest",
  //   isActive: true,
  // },
  // {
  //   exact: false,
  //   path: "/nft/:id",
  //   component: NFTDetail,
  //   type: "guest",
  //   isActive: true,
  // },
  // {
  //   exact: false,
  //   path: "/summon",
  //   component: Summon,
  //   type: "guest",
  //   isActive: true,
  //   title: "Summon",
  // },
  // {
  //   exact: false,
  //   path: "/research-institute/:comp",
  //   component: ResearchInstitute,
  //   type: "guest",
  //   isActive: true,
  //   title: "Research Institute",
  // },
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

export default productionRoutes;
