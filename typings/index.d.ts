/// <reference types="keycloak-js" />
/// <reference types="redux" />

import { Store, Reducer } from "redux";
import * as actions from "./actions";
import * as actionTypes from "./action-types";
import keycloakReducer from "./reducers";

declare class KeycloakWrapper {
  /**
   * @see {@link Keycloak.KeycloakInstance}
   */
  keycloak: Keycloak.KeycloakInstance;

  /**
   * The URL of the keycloak instance
   */
  url: string;

  /**
   * The Keycloak realm to use
   */
  realm: string;

  /**
   * The clientId of your application
   */
  clientId: string;

  /**
   * Creates a wrapper for the Keycloak module
   * @param url The url of the keycloak instance
   * @param realm The realm
   * @param clientId The app's client ID
   */
  constructor(url: string, realm: string, clientId: string);

  initKeycloak(
    store: Store,
    keycloakParams: Keycloak.KeycloakInitOptions,
    refresh?: boolean
  ): Promise<void>;
}

export { keycloakReducer, actions, actionTypes };

export default KeycloakWrapper;
