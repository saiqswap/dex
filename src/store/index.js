import { combineReducers } from "redux";
import { MintingReducer } from "./reducers/mintingReducer";
import { PreSaleReducer } from "./reducers/preSaleReducer";
import { SettingReducer } from "./reducers/settingReducer";
import { UserReducer } from "./reducers/userReducer";

const rootReducer = combineReducers({
  setting: SettingReducer,
  user: UserReducer,
  minting: MintingReducer,
  preSale: PreSaleReducer,
});

export default rootReducer;
