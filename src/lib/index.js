import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "./actions";
import * as actionTypes from "./action-types";
import keycloakReducer from "./reducers";
import PropTypes from "prop-types";

class KeycloakWrapper extends Component {
  state = {
    refreshInterval: null,
    expired: null,
    keycloak: undefined,
  };

  async componentDidMount() {
    const { dispatch, keycloak, refresh, keycloakParams } = this.props;
    this.setState({ keycloak });
    await this.initKeycloak(dispatch, keycloak, keycloakParams, refresh);
  }

  expiredIntervalFunction = () => {
    const { expired, keycloak } = this.state;
    const { dispatch } = this.props;
    if (keycloak.isTokenExpired()) {
      console.log("Token has expired");
      keycloak.clearToken();
      clearInterval(expired);
      this.setState({ expired: null });
      dispatch(actions.setKeycloakAuthenticated(false));
    }
  };

  refreshIntervalFunction = () => {
    const { refreshInterval, keycloak } = this.state;
    const { dispatch, keycloakParams } = this.props;
    keycloak
      .updateToken(30)
      .then((refreshed) => {
        console.log(refreshed ? "Token refreshed" : "Token still valid");
        dispatch(actions.setKeycloak(keycloak));
        dispatch(actions.setUserToken(keycloak.idTokenParsed));
      })
      .catch((er) => {
        console.error("Could not refresh token ", er);
        if (keycloakParams["flow"] === "implicit") {
          console.error(
            "Cannot refresh tokens when using Implict Flow, try Hybrid"
          );
        } else {
          clearInterval(refreshInterval);
          this.setState({ refreshInterval: null });
          keycloak.clearToken();
          dispatch(actions.setKeycloakAuthenticated(false));
        }
      });
  };

  initKeycloakSuccess = async (authenticated, dispatch, keycloak, refresh) => {
    console.log("Keycloak authenticated: ", authenticated);
    dispatch(actions.setKeycloak(keycloak));
    dispatch(actions.setUserToken(keycloak.idTokenParsed));
    dispatch(actions.setKeycloakReady());
    dispatch(actions.setKeycloakAuthenticated(authenticated));
    const { expired } = this.state;
    if (expired) {
      clearInterval(expired);
    }

    if (authenticated) {
      const expiredFct = setInterval(this.expiredIntervalFunction, 3000);
      this.setState({ expired: expiredFct });
    }

    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    // keep our token alive as long as possible
    if (authenticated && refresh) {
      const refreshIntervalFct = setInterval(
        this.refreshIntervalFunction,
        30000
      );
      this.setState({ refreshInterval: refreshIntervalFct });
    }
  };

  initKeycloakFailure = (e) => {
    console.log("Failed to load the user profile!", e);
  };

  initKeycloak = async (
    dispatch,
    keycloak,
    keycloakParams = { onLoad: "check-sso" },
    refresh = true
  ) => {
    var promise = keycloak.init(keycloakParams);
    if (keycloakParams.promiseType === "native") {
      try {
        var authenticated = await promise;
        await this.initKeycloakSuccess(
          authenticated,
          dispatch,
          keycloak,
          refresh
        );
      } catch (err) {
        this.initKeycloakFailure(err);
      }
    } else {
      console.log("Using Keycloak promises");
      promise
        .success((authenticated) =>
          this.initKeycloakSuccess(authenticated, dispatch, keycloak, refresh)
        )
        .error((e) => this.initKeycloakFailure(e));
    }
  };

  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}

KeycloakWrapper.propTypes = {
  keycloak: PropTypes.object.isRequired,
  refresh: PropTypes.bool,
  keycloakParams: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
};

export { actions, actionTypes, keycloakReducer };

export { KeycloakWrapper };
export default connect()(KeycloakWrapper);
