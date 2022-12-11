import { SET_KEYCLOAK_AUTHENTICATED, SET_KEYCLOAK_READY } from "./action-types";
import { Action } from "redux";

export interface SetKeycloakReadyAction extends Action<string> {
  type: "SET_KEYCLOAK_READY";
}

export interface SetKeycloakAuthenticatedAction extends Action<string> {
  type: string | SET_KEYCLOAK_AUTHENTICATED;
  authenticated: boolean;
}

export function setKeycloakReady(): SetKeycloakReadyAction;
export function setKeycloakAuthenticated(
  authenticated: boolean
): SetKeycloakAuthenticatedAction;
