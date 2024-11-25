import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserManager as OidcUserManager } from "oidc-client-ts";
import { useDispatch, useSelector } from "react-redux";
import {
  browserName,
  browserVersion,
  deviceType,
  osVersion,
  osName,
} from "react-device-detect";
import { UserManager } from "@src/commons/userManager";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import Constants from "@src/constants";
import { ISessionUser } from "@src/commons/interfaces";
import { RootState } from "@src/store";
import { setAuthInfo } from "@src/store/slice/auth.slice";
import { fetchUserInfo, resetUserInfo } from "@src/store/slice/userInfo.slice";
import axios from "axios";

interface AuthContextType {
  user?: ISessionUser | null;
  loading: boolean;
  signinRedirect: () => Promise<void>;
  signoutRedirect: () => Promise<void>;
  onSwitchAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

const useAuth = () => useContext(AuthContext);

function AuthProvider({
  children,
  hostname,
}: {
  children: React.ReactNode;
  hostname: string;
}) {
  const currentUser = useSelector(
    (state: RootState) => state.authRoot.authInfo
  );
  const [loading, setLoading] = useState(currentUser === undefined);
  const [userManager] = useState<OidcUserManager>(() => UserManager(hostname));
  const dispatch = useDispatch();

  useEffect(() => {
    const handleSignIn = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(
        window.location.hash.replace("#", "?")
      );
      if (
        searchParams.get("code") ||
        searchParams.get("id_token") ||
        searchParams.get("session_state") ||
        hashParams.get("code") ||
        hashParams.get("id_token") ||
        hashParams.get("session_state")
      ) {
        const user = (await userManager.signinCallback()) || null;
        dispatch(setAuthInfo(user));
        if (!Helpers.isNullOrEmpty(user)) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + user?.access_token;
          dispatch(fetchUserInfo());
        }
      } else if (loading) {
        try {
          await userManager.signinSilent();
        } catch (error) {
          dispatch(setAuthInfo(null));
          if (
            !Helpers.isServerside() &&
            window.location.pathname === PathName.LOGIN_REDIRECT
          ) {
            signinRedirect();
          }
        }
      }
    };
    handleSignIn();
  }, []);

  useEffect(() => {
    if (currentUser !== undefined) {
      setLoading(false);

      if (currentUser) {
        handleLoadActiveUser();
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (!userManager) {
      return;
    }
    const handleUserLoaded = async (newUser: User) => {
      if (newUser) {
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + newUser?.access_token;
        dispatch(setAuthInfo({ ...newUser }));
        dispatch(fetchUserInfo());
      } else {
        dispatch(setAuthInfo(null));
      }
    };

    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addSilentRenewError(handleTokenExpired);

    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeSilentRenewError(handleTokenExpired);
    };
  }, [userManager]);

  const handleLoadActiveUser = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const activeUser = searchParams.get("activeUser");
    if (activeUser && activeUser !== currentUser?.profile?.sub) {
      signoutLocal();
      await signinRedirect({ active_user: activeUser });
    }
  };

  const handleTokenExpired = async (error?: any) => {
    if (!Helpers.isServerside()) {
      window.location.href = "/auth/logout-redirect";
    }
  };

  const signinRedirect = async (params?: {
    [key: string]: string | number | boolean;
  }) => {
    try {
      const deviceId = await Helpers.getDeviceId();
      const deviceInfo = JSON.stringify({
        browserName,
        browserVersion,
        deviceType,
        osVersion,
        osName,
      });

      let extraQueryParams: { [key: string]: string | number | boolean } = {
        deviceId,
        deviceInfo,
      };

      if (!Helpers.isNullOrEmpty(extraQueryParams)) {
        extraQueryParams = {
          ...extraQueryParams,
          ...params,
        };
      }

      await userManager.signinRedirect({ extraQueryParams });
    } catch (error) {
      dispatch(setAuthInfo(null));
    }
  };

  const signoutRedirect = async () => {
    const idTokenHint = currentUser?.id_token;
    dispatch(resetUserInfo());
    sessionStorage.clear();
    localStorage.clear();
    const origin =
      typeof window !== "undefined" ? window.location.origin : hostname;
    await userManager.signoutRedirect({
      id_token_hint: idTokenHint,
      post_logout_redirect_uri:
        origin + Constants.IdentityPath.POST_LOGOUT_REDIRECT_URL,
    });
  };

  const onSwitchAccount = async () => {
    signoutLocal();
    await signinRedirect({ switchUser: 1 });
  };

  const signoutLocal = () => {
    dispatch(resetUserInfo());
    sessionStorage.clear();
    localStorage.clear();
  };

  const value = {
    user: currentUser,
    loading,
    signinRedirect,
    signoutRedirect,
    onSwitchAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider, useAuth };
