## Keycloak React / Redux

This is a thin react/redux wrapper for the `keycloak-js` library. It exposes its functionality through a few actions and a reducer that you can include in your project.

The actions available are:

- `setKeycloakReady` - responsible for notifying the app that keycloak is ready
- `setKeycloakAuthenticated(boolean)` - notifies whether the user has been authenticated or not
- `setUserToken(string)` - sets the user's token in the state
- `setKeycloak(instance)` - sets the keycloak instance in the state for access somewhere else

The reducer's state is defined by the following properties:

```js
{
    authenticated: true,
    ready: true,
    instance: KeycloakInstance,
}
```

The library exports a component called `KeycloakWrapper` that should be used within your application. **Important**: use at the top level of your component trees.

**Don't use promiseType: native**. It throws some weird errors and it's better to just stay with the Keycloak implementation.

Example usage:

```jsx
<KeycloakWrapper
  keycloak={
    new Keycloak({
      url: cfg.keycloakUrl,
      realm: cfg.keycloakRealm,
      clientId: cfg.keycloakClientId
    })
  }
  refresh={false}
  keycloakParams={{
    onLoad: "login-required",
    flow: "implicit"
  }}
>
  <App />
</KeycloakWrapper>
```

## Available Scripts

In the project directory, you can run:

### `npm test`

Launches the test runner. It's using jest as the standard testing tool.

### `npm run-script build`

Run this in order to generate the `dist` folder. Otherwise, the new published version won't be available for general use.

Be sure to commit the changes in dist every time there's a new version.
