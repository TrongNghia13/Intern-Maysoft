import { UserManager as OidcUserManager, WebStorageStateStore } from "oidc-client-ts";
import SecureStorageStore from "./secureLocalStorage";
import Constants from "../constants";

export const UserManager = (hostname: string): OidcUserManager => {
    const origin = typeof window !== "undefined" ? window.location.origin : hostname;
    return new OidcUserManager({
        authority: process.env.NEXT_PUBLIC_IDENTITY_URL || "",
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID || "",
        client_secret: "secret",
        redirect_uri: origin + Constants.IdentityPath.REDIRECT_URI,
        post_logout_redirect_uri: origin + Constants.IdentityPath.POST_LOGOUT_REDIRECT_URL,
        response_type: "code",
        scope: "openid profile offline_access IdentityServerApi",
        loadUserInfo: true,
        includeIdTokenInSilentRenew: true,
        accessTokenExpiringNotificationTimeInSeconds: 180,
        userStore: new WebStorageStateStore({ store: new SecureStorageStore() }),
        revokeTokensOnSignout: true,
    });
}