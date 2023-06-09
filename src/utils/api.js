import { logout } from "../utils/auth";
import { API, CustomToast } from "../settings";
import { getAccessToken } from "./auth";
export const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export function get(endpoint, successCallback, errorCallback) {
  myFetch("GET", endpoint, undefined, successCallback, errorCallback);
}

export function post(endpoint, body, successCallback, errorCallback) {
  myFetch("POST", endpoint, body, successCallback, errorCallback);
}

export function put(endpoint, body, successCallback, errorCallback) {
  myFetch("PUT", endpoint, body, successCallback, errorCallback);
}

export function _delete(endpoint, body, successCallback, errorCallback) {
  myFetch("DELETE", endpoint, body, successCallback, errorCallback);
}

export const alertError = (error) => {
  alert(error.code + (error.msg ? ": " + error.msg : ""));
};

function myFetch(method, endpoint, body, successCallback, errorCallback) {
  let url = API + endpoint;

  body = JSON.stringify(body);

  let headers = defaultHeaders;
  headers["Authorization"] = "bearer " + getAccessToken();

  let response = null;

  if (body === undefined)
    response = fetch(url, {
      method: method,
      headers: headers,
    });
  else {
    response = fetch(url, {
      method: method,
      headers: headers,
      body: body,
    });
  }
  handleResponse(response, successCallback, errorCallback);
}

const handleResponse = (response, successCallback, errorCallback) => {
  response.then((r) => {
    if (r.status === 200) {
      if (successCallback) {
        r.json().then((result) => {
          if (result.success) {
            successCallback(result.data);
          } else {
            if (errorCallback) {
              errorCallback(result.error);
            } else {
              console.log(result.error);
            }
          }
        });
      }
    } else if (r.status === 403) {
      throwError(errorCallback, "Forbidden");
      CustomToast("error", "Forbidden");
    } else if (r.status === 401) {
      console.log("Unauthorized");
      logout();
    } else if (r.status === 500) {
      throwError(null, "Internal server error");
    } else if (r.status === 502) {
      throwError(null, "Service unavailable");
    } else if (r.status === 526) {
      throwError(null, "Please connect to VPN");
    } else {
      errorCallback("Undefined");
      console.log("Undefined");
      // throwError(null, "Undefined");
    }
  });
};

const throwError = (errorCallback, message) => {
  if (errorCallback) errorCallback(message);
  else showError(message);
};

const showError = (message) => {
  alert("ERR: " + message);
};
