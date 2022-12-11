import * as at from "./action-types";

const initialState = {
  ready: false,
  authenticated: false,
  instance: {},
  userToken: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case at.SET_KEYCLOAK_READY:
      return {
        ...state,
        ready: true,
      };
    case at.SET_KEYCLOAK_AUTHENTICATED:
      return {
        ...state,
        authenticated: action.authenticated,
      };
    case at.SET_KEYCLOAK:
      return {
        ...state,
        instance: action.keycloak,
      };
    case at.SET_USER_TOKEN:
      return {
        ...state,
        userToken: action.token,
      };
    default:
      return state;
  }
};
