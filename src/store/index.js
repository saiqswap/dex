import { combineReducers } from "redux";
import { FeedDetailReducer } from "./reducers/feedDetailReducer";
import { GeneralReducer } from "./reducers/generalReducer";
import { MintingReducer } from "./reducers/mintingReducer";
import { SettingReducer } from "./reducers/settingReducer";
import { UserReducer } from "./reducers/userReducer";

const rootReducer = combineReducers({
  setting: SettingReducer,
  user: UserReducer,
  general: GeneralReducer,
  feed: FeedDetailReducer,
  minting: MintingReducer,
});

export default rootReducer;
