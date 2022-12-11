import * as at from "./action-types";

export const setKeycloakReady = () => {
  return {
    type: at.SET_KEYCLOAK_READY,
  };
};

export const setKeycloakAuthenticated = (authenticated) => {
  return {
    type: at.SET_KEYCLOAK_AUTHENTICATED,
    authenticated,
  };
};

export const setKeycloak = (keycloak) => {
  return {
    type: at.SET_KEYCLOAK,
    keycloak,
  };
};

export const setUserToken = (token) => {
  return {
    type: at.SET_USER_TOKEN,
    token,
  };
};
