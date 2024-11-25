import axios from "axios";
import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";

import { i18n } from "next-i18next";

export enum ContentType {
    JSON = "application/json",
    FORM = "application/x-www-form-urlencoded",
    FORM_DATA = "multipart/form-data",
}

export enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
}

const HttpClient = (baseURL: string) => {

    let organizationId = Helpers.getLocalStorage(Constants.StorageKeys.ORGANIZATION_ID, "");

    const instance = axios.create({
        baseURL,
        timeout: Constants.Api.TIMEOUT,
        headers: {
            "Accept-Language": "vi,en",
            "OrganizationId": organizationId,
            // i18n?.language
        }
    });

    instance.interceptors.response.use(
        (response) => {
            if (Helpers.isDev()) {
                console.log(`response`, response);
            }
          
            return response;
        },
        (error) => {
            if (Helpers.isDev()) {
                console.log(`error`, error);
            }
            if (!Helpers.isNullOrEmpty(error?.response)) {

                const arrValidationErrors = [...error?.response?.data?.responseException?.validationErrors || []].map(el => (el.message as string));
                const stringValidationErrors = arrValidationErrors.length === 0 ? undefined : arrValidationErrors.join("; ");

                throw {
                    code: error?.response?.status,
                    message:
                        stringValidationErrors ||
                        error?.response?.data?.responseException?.exceptionMessage ||
                        error?.response?.data?.message?.Message ||
                        error?.response?.data?.message?.message ||
                        error?.response?.data?.Message ||
                        error?.response?.data?.message ||
                        ""
                }
            } else {
                throw {
                    code: error?.code,
                    message: error?.message
                }
            }
        }
    );

    return instance;
}

export default HttpClient;