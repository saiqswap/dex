import { combineReducers } from "redux";
import { MintingReducer } from "./reducers/mintingReducer";
import { PreSaleReducer } from "./reducers/preSaleReducer";
import { RiReducer } from "./reducers/riReducer";
import { SettingReducer } from "./reducers/settingReducer";
import { UserReducer } from "./reducers/userReducer";

const rootReducer = combineReducers({
  setting: SettingReducer,
  user: UserReducer,
  minting: MintingReducer,
  preSale: PreSaleReducer,
  riStore: RiReducer,
});

export default rootReducer;
