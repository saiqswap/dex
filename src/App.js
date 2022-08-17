import { ThemeProvider } from "@emotion/react";
import { createTheme, Hidden } from "@mui/material";
import { Box } from "@mui/system";
import "animate.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BottomMenu from "./components/BottomMenu";
import Header from "./components/Header";
import ErrorPage from "./pages/ErrorPage";
import routes from "./routes";
import { DEFAULT_PROJECT_TITLE } from "./settings/constants";
import {
  _getMintingBoxList,
  _getUserMintingBoxes,
} from "./store/actions/mintingActions";
import {
  _changeLanguage,
  _getConfig,
  _getTemplates,
} from "./store/actions/settingActions";
import { _getMyItems, _getNewProfile } from "./store/actions/userActions";
import "./styles/main.scss";
import { isLoggedIn } from "./utils/auth";
const theme = createTheme({
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
    fontSize: 16,
    color: "var(--text-color)",
  },
});

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    document.getElementsByTagName("html")[0].setAttribute("dark", true);
    dispatch(_getConfig());
    dispatch(_getMintingBoxList());
    dispatch(_getTemplates());
    dispatch(_changeLanguage(localStorage.getItem("lang")));
    if (isLoggedIn()) {
      dispatch(_getNewProfile());
      dispatch(_getMyItems());
      dispatch(_getUserMintingBoxes());
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Header />
          <ModalSwitch />
        </div>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ThemeProvider>
  );
}

export default App;

function ModalSwitch() {
  let location = useLocation();
  let background = location.state && location.state.background;

  return (
    <Switch location={background || location}>
      {routes.map((item, index) => (
        <AuthRoute
          exact={item.exact}
          path={item.path}
          component={item.component}
          type={item.type}
          title={item.title}
          children={item.children}
          key={index}
          isActive={item.isActive}
        />
      ))}
    </Switch>
  );
}

const AuthRoute = (props) => {
  const { type, title, isActive } = props;
  const loggedIn = isLoggedIn();

  useEffect(() => {
    if (title) {
      document.title = title + " | " + DEFAULT_PROJECT_TITLE;
    } else {
      document.title = DEFAULT_PROJECT_TITLE;
    }
  }, [title]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  if (type === "login" && loggedIn) {
    return <Redirect to="/" />;
  }
  if (type === "private" && !loggedIn) {
    return <Redirect to="/login" />;
  }
  return (
    <>
      <Box pt={5} pb={5} minHeight="100vh">
        {isActive ? <Route {...props} /> : <ErrorPage />}
      </Box>
      <Hidden mdUp>
        <BottomMenu />
      </Hidden>
    </>
  );
};
