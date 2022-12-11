import { Action, Reducer } from "redux";
import {SetKeycloakAuthenticatedAction, SetKeycloakReadyAction} from "./actions";

/**
 * The current keycloak authentication status
 */
declare interface KeycloakState {
    authenticated: boolean;
    ready: boolean;
}


type Actions =  SetKeycloakAuthenticatedAction | SetKeycloakAuthenticatedAction;

/**
 * Reducer for the keycloak actions
 */
type KeycloakReducer = Reducer<KeycloakState, Actions>;

export default KeycloakReducer;