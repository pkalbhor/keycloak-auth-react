import keycloakReducer from "./reducers";
import { setKeycloakAuthenticated, setKeycloakReady } from "./actions";

test("test reducer with invalid action", () => {
  expect(keycloakReducer(undefined, { type: "INVALID" })).toEqual({
    ready: false,
    authenticated: false,
    instance: {},
    userToken: {},
  });
});

test("test reducer keycloak ready action", () => {
  expect(keycloakReducer(undefined, setKeycloakReady())).toEqual({
    authenticated: false,
    ready: true,
    instance: {},
    userToken: {},
  });
});

test("test reducer keycloak authenticated action", () => {
  const state1 = keycloakReducer(undefined, setKeycloakAuthenticated(true));
  expect(state1).toEqual({
    authenticated: true,
    ready: false,
    instance: {},
    userToken: {},
  });

  const state2 = keycloakReducer(state1, setKeycloakReady());
  const state3 = keycloakReducer(state2, setKeycloakAuthenticated(false));
  expect(state3).toEqual({
    authenticated: false,
    ready: true,
    instance: {},
    userToken: {},
  });
});
