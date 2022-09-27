import { combineReducers } from "redux";
import { FeedDetailReducer } from "./reducers/feedDetailReducer";
import { GeneralReducer } from "./reducers/generalReducer";
import { MintingReducer } from "./reducers/mintingReducer";
import { PreSaleReducer } from "./reducers/preSaleReducer";
import { SettingReducer } from "./reducers/settingReducer";
import { UserReducer } from "./reducers/userReducer";

const rootReducer = combineReducers({
  setting: SettingReducer,
  user: UserReducer,
  general: GeneralReducer,
  feed: FeedDetailReducer,
  minting: MintingReducer,
  preSale: PreSaleReducer,
});

export default rootReducer;
