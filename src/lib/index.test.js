import React from "react";
import KeycloakWrapper, {
  KeycloakWrapper as OriginalKeycloakWrapper
} from "./index";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import {
  setKeycloakAuthenticated,
  setKeycloakReady,
  setKeycloak,
  setUserToken
} from "./actions";
import { shallow, mount } from "enzyme";

const mockStore = configureStore();
let store;
let keycloak;

beforeEach(() => {
  store = mockStore({});
  keycloak = mockKeycloak();
});

const mockKeycloak = () => {
  return {
    url: "http://cern.ch",
    realm: "master",
    clientId: "management-portal",
    init: jest.fn(),
    updateToken: jest.fn(),
    clearToken: jest.fn()
  };
};

const createComponent = (
  refresh = false,
  keycloakParams = {
    onLoad: "login-required",
    flow: "implicit",
    promiseType: "native"
  }
) => {
  return mount(
    <Provider store={store}>
      <KeycloakWrapper
        store={store}
        keycloak={keycloak}
        dispatch={store.dispatch}
        refresh={refresh}
        keycloakParams={keycloakParams}
      />
    </Provider>
  );
};

const waitForAsync = () => new Promise(resolve => setImmediate(resolve));

test("initialize the wrapper successfully", () => {
  shallow(
    <Provider store={store}>
      <KeycloakWrapper
        keycloak={keycloak}
        refresh={false}
        keycloakParams={{
          onLoad: "login-required",
          flow: "implicit",
          promiseType: "native"
        }}
      />
    </Provider>
  );
});

test("authentication failed", async () => {
  keycloak.init.mockResolvedValue(false);

  const keycloakWrapper = createComponent();
  // fix here: https://github.com/airbnb/enzyme/issues/1587#issuecomment-442498202
  await waitForAsync();
  keycloakWrapper.update();

  expect(keycloak.init.mock.calls).toHaveLength(1);
  expect(keycloak.init.mock.calls[0][0]).toEqual({
    flow: "implicit",
    onLoad: "login-required",
    promiseType: "native"
  });
  const actions = store.getActions();
  const expectedPayload = [
    setKeycloak(keycloak),
    setUserToken(undefined),
    setKeycloakReady(),
    setKeycloakAuthenticated(false)
  ];
  expect(actions).toEqual(expectedPayload);
});

test("authentication success", async () => {
  keycloak.init.mockResolvedValue(true);
  const keycloakWrapper = createComponent();
  await waitForAsync();

  expect(keycloak.init.mock.calls).toHaveLength(1);
  expect(keycloak.init.mock.calls[0][0]).toEqual({
    flow: "implicit",
    onLoad: "login-required",
    promiseType: "native"
  });
  const actions = store.getActions();
  const expectedPayload = [
    setKeycloak(keycloak),
    setUserToken(undefined),
    setKeycloakReady(),
    setKeycloakAuthenticated(true)
  ];
  expect(actions).toEqual(expectedPayload);
  expect(
    keycloakWrapper.find(OriginalKeycloakWrapper).state("expired")
  ).toBeTruthy();
  expect(
    keycloakWrapper.find(OriginalKeycloakWrapper).state("refreshInterval")
  ).toBeNull();
});

test("auth with refresh success", async () => {
  keycloak.init.mockResolvedValue(true);
  const keycloakWrapper = createComponent(true);
  await waitForAsync();

  expect(keycloak.init.mock.calls).toHaveLength(1);
  expect(keycloak.init.mock.calls[0][0]).toEqual({
    flow: "implicit",
    onLoad: "login-required",
    promiseType: "native"
  });
  const actions = store.getActions();
  const expectedPayload = [
    setKeycloak(keycloak),
    setUserToken(undefined),
    setKeycloakReady(),
    setKeycloakAuthenticated(true)
  ];
  expect(actions).toEqual(expectedPayload);
  expect(
    keycloakWrapper.find(OriginalKeycloakWrapper).state("expired")
  ).toBeTruthy();
  expect(
    keycloakWrapper.find(OriginalKeycloakWrapper).state("refreshInterval")
  ).toBeTruthy();
});
