export const ENDPOINT_POST_USER_LOGIN = `/user/login-by-email`;
export const ENDPOINT_POST_USER_REGISTER_OTP = `/user/send-otp`;
export const ENDPOINT_POST_REGISTER = `/user/register`;
export const ENDPOINT_GET_PROFILE = `/user/profile`;
export const ENDPOINT_PUT_FORGOT_PASSWORD = `/user/forgot-password`;
export const ENDPOINT_PUT_RESET_PASSWORD = `/user/reset-password`;
export const ENDPOINT_PUT_CHANGE_PASSWORD = `/user/password`;
export const ENDPOINT_GET_POST_GA_CODE = `/user/ga`;
export const ENDPOINT_GET_ADDRESS = `/fund/address`;
export const ENDPOINT_GET_DEPOSIT = `/fund/get-deposit`;
export const ENDPOINT_GET_WITHDRAW = `/fund/get-withdraw`;
export const ENDPOINT_GET_VALIDATE_ADDRESS = `/fund/validate-address`;
export const ENDPOINT_POST_WITHDRAW_TRANSFER = `/fund/withdraw`;

export const ENDPOINT_GET_LOGIN_ACTIVITY = `/user-service/login-activity`;
export const ENDPOINT_ACTIVE_USER = `/user-service/user/active`;
export const ENDPOINT_DELETE_DISABLE_ACCOUNT = `/user-service/user/disable`;
export const ENDPOINT_GET_TRANSACTIONS = `/fund-service/transaction/list`;
export const ENDPOINT_GET_SECURITY = `/user-service/user/security`;
export const ENDPOINT_GET_LOGIN_DEVICE = `/user-service/device`;
export const ENDPOINT_POST_VERIFY = `/user-service/user/identity-verification`;
export const ENDPOINT_GET_REFERRAL_LIST = `/user-service/referral/list`;
export const ENDPOINT_GET_FUND = `/fund-service/fund/list`;
export const ENDPOINT_GET_SWAP_HISTORY = `/swap-service/transaction/list`;
export const ENDPOINT_GET_WITHDRAW_HISTORY = `/fund-service/withdraw/list`;
export const ENDPOINT_GET_DEPOSIT_HISTORY = `/fund-service/deposit/list`;
export const ENDPOINT_GET_SWAP_PRODUCT_LIST = `/swap-service/product`;
export const ENDPOINT_GET_FUND_LOGS = `/fund-service/fund/log`;
export const ENDPOINT_GET_REFERRAL_STATISTIC = `/user-service/referral/statistic`;

export const ENDPOINT_GET_PACKAGE = `/home/package`;
export const ENDPOINT_GET_BALANCE = `/fund/balance`;
export const ENDPOINT_GET_POST_LOT = `/lot`;
export const ENDPOINT_GET_BINARY_TREE = `/referral/binary-tree`;
export const ENDPOINT_GET_F1_MEMBER = `/referral/get-f1`;
export const ENDPOINT_GET_SEARCH_POSITION = `/referral/search-binary-position`;
export const ENDPOINT_ADD_BINARY_TREE = `/referral/place-binary`;
export const ENDPOINT_POST_TRANSACTION_MINE = `/transaction/get-mine-tx`;
export const ENDPOINT_POST_TRANSACTION_MATCHING = `/transaction/get-matching-com`;
export const ENDPOINT_POST_TRANSACTION_DIRECT = `/transaction/get-direct-com`;
export const ENDPOINT_POST_TRANSACTION_BINARY = `/transaction/get-binary-com`;
export const ENDPOINT_POST_TRANSACTION = `/transaction/get-tx`;
export const ENDPOINT_GET_ACHIEVEMENT = `/home/dashboard`;
export const ENDPOINT_POST_CREATE_MEMBER = `/user/create`;
export const ENDPOINT_POST_KYC_UPLOAD = `/kyc/upload`;
export const ENDPOINT_POST_SEND_KYC = `/kyc`;
export const ENDPOINT_POST_SWAP = `/swap`;
export const ENDPOINT_LOGIN_WITH_GOOGLE = `/user/login-by-google`;

//ganet
export const ENDPOINT_GET_ALL_USER = `/user/get-all`;
export const ENDPOINT_GET_FOLLOWER = `/sn/get-followers`;
export const ENDPOINT_GET_FOLLOWING = `/sn/get-following`;
export const ENDPOINT_GET_FOLLOWED = `/sn/follower-ids`;
export const ENDPOINT_USER = `/user`;
export const ENDPOINT_NEWS_FEED = `/sn/get-posts`;
export const ENDPOINT_FEED_DETAIL = `/sn/post`;
export const ENDPOINT_UPLOAD = `/upload`;
export const ENDPOINT_DONATE = `/sn/donate`;
export const ENDPOINT_FOLLOW = `/sn/follow`;

//Comment
export const ENDPOINT_COMMENT = `/sn/comment`;
export const ENDPOINT_GET_COMMENT = `/sn/get-comments`;

//Browse token
export const BROWSE_TOKEN = `https://testnet.bscscan.com/token/`;

//nft
export const ENDPOINT_GET_NFT_TRANSACTION = `/moralis/get-nft-transfers`;
export const ENDPOINT_MARKETPLACE = `/nft/query-marketplace`;
export const ENDPOINT_NFT = `/nft`;
export const ENDPOINT_NFT_ONCHAIN_LIST = `/moralis/get-tokens`;
export const ENDPOINT_NFT_LISTING = `/nft/listing`;
export const ENDPOINT_NFT_DELIST = `/nft/delist`;
export const ENDPOINT_NFT_BUY = `/nft/buy`;
export const ENDPOINT_MY_NFT = `/nft/my-nfts`;

//minting box
export const ENDPOINT_PRESALE_PRODUCT_SC_INPUT = `/presale/product-sc-input`;
export const ENDPOINT_PRESALE_TRIGGER_PAID_PRODUCT = `/presale/trigger-paid-product`;
export const ENPOINT_PRESALE_GET_TRANSACTION_LIST = `/presale/transaction/get-list`;
