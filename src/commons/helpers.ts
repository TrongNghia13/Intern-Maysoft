import Swal from "sweetalert2";
import DOMPurify from "dompurify";
import moment from "moment-timezone";
import parse from "html-react-parser";

import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";
import { Dispatch } from "@reduxjs/toolkit";
import { NextRouter } from "next/router";
import { browserName, browserVersion, deviceType, osName, osVersion } from "react-device-detect";
import { v4 as uuidv4 } from "uuid";

import Constants, { ASSET_API_URL } from "@src/constants";

import { GlobalStyles } from "@src/constants/global";
import { showSnackbar } from "@src/store/slice/common.slice";
import { AttributeCodes, AttributeReferenceId, EItineraryType, FlightType, RoleCode } from "./enum";
import {
    IAddress,
    IAttribute,
    ICodename,
    IDetailHotel,
    IFlight,
    IFlightDetail,
    IItineraryDetail,
    IMultiLanguageContent,
    IOccupancy,
    IPrice,
    IRate,
    IRoom,
    ITotals,
    IUserInfo,
} from "./interfaces";

const Helpers = {
    /**
     * Check value is string or non.
     *
     * @param {any} value: The value to be tested.
     * @returns {boolean} If data type is string true. Otherwise it returns false.
     */
    isString: (value: any): value is string => {
        return typeof value === "string";
    },

    /**
     * Check value is object or non.
     *
     * @param {any} value: The value to be tested.
     * @returns {boolean} If data type is object true. Otherwise it returns false.
     */
    isObject: (value: any): value is object => {
        return typeof value === "object";
    },

    /**
     * Determine if the argument passed is a JavaScript function object.
     *
     * @param {any} obj: Object to test whether or not it is an array.
     * @returns {boolean} returns a Boolean indicating whether the object is a JavaScript function
     */
    isFunction: (value: any): value is (...args: any) => void => {
        return typeof value === "function";
    },

    /**
     * Check a value is number or non, if number then return true, otherwise return false.
     *
     * @param {string} value: Value can check number
     * @returns {boolean} if number then return true, otherwise return false.
     */
    isNumber: (value: any): value is number => {
        return typeof value === "number";
    },

    isValidEmail: (email: string) => {
        return Constants.RegExp.NEW_EMAIL_ADDRESS.test(email);
    },

    isValidPhoneNumber: (phoneNumber: string) => {
        return phoneNumber.length >= 8;
    },
    /**
     * Check Object is null or String null or empty.
     *
     * @param {object | string} value Object or String
     * @returns {boolean} if null or empty return true, otherwise return false.
     */
    isNullOrEmpty: (value: any): value is undefined | boolean => {
        if (Helpers.isArray(value) && value.length === 0) {
            return true;
        } else return value === undefined || value === null || value === "";
    },

    /**
     * Check value is array or non.
     *
     * @param {any} value: The value to be tested.
     * @returns {boolean} If data type is array true. Otherwise it returns false.
     */
    isArray: (value: any): value is (object | string | number | boolean)[] => {
        return Array.isArray(value);
    },

    /**
     * Trim space character (start, end) of input string.
     *
     * @param {string} value: Value for trim
     * @returns {string} String after trim, space start & end is removed
     */
    trim: (value: string): string => {
        return Helpers.isString(value) ? value.trim() : "";
    },

    /**
     * If value is string return value, otherwise return value.toString
     *
     * @param {string} value: Value
     * @returns {string} String or convert of value to string
     */
    ensureString: (value: any): string => {
        try {
            if (!Helpers.isNullOrEmpty(value)) {
                if (Helpers.isString(value)) {
                    return value;
                } else if (Helpers.isObject(value)) {
                    return JSON.stringify(value);
                } else {
                    return `${value}`;
                }
            }
        } catch (error) {
            return "";
        }
        return "";
    },

    /**
     * @param {string | string[]} value
     * @returns {string} sanitized query string value
     */
    cleanUrlParamsValue: (value?: string | string[]): string => {
        if (Helpers.isString(value)) {
            value = value.replace("?", "");
            return value;
        } else if (Array.isArray(value)) {
            value = value.map((val) => val.replace("?", ""));
            return value[value.length - 1];
        } else {
            return "";
        }
    },

    /**
     * Convert size in bytes to KB, MB, GB or TB
     *
     * @param {number} bytes: Size convert
     * @returns {string} Value formatted include unit.
     */
    bytesToSize: (bytes: number): string => {
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (Helpers.isNullOrEmpty(bytes) || bytes === 0) {
            return "0 Byte";
        }
        const i = Math.floor(Math.floor(Math.log(bytes) / Math.log(1024)));
        return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
    },

    /**
     * Convert date to string with custom format.
     *
     * @param {number | Date} date Date or Timestamp
     * @param {string} format Format string output
     */
    dateToString: (date: number | Date | undefined, format: string): string => {
        if (Helpers.isNullOrEmpty(date)) {
            return "";
        } else if (Helpers.isNumber(date) && `${date}`.length === 10) {
            return moment.unix(date).format(format);
        } else {
            return moment(date).format(format);
        }
    },

    /**
     * Convert string to date.
     *
     * @param {string} dateString string
     */
    stringToDate: (dateString: string): Date => {
        return new Date(dateString);
    },

    /**
     * Convert date to unix time.
     *
     * @param {Date} date Date
     */
    dateToUnixTime: (date?: Date): number => {
        if (!Helpers.isNullOrEmpty(date)) {
            return moment(date).unix();
        }
        return 0;
    },

    fromNow: (date: number | Date): string => {
        return moment(date).fromNow();
    },

    /**
     * Get protocal from url.
     * e.g. URL is https://google.com, protocal output is [https:]
     *
     * @param {string} url URL
     * @returns {string} Protocal of URL, if not a URL return empty string
     */
    getProtocolFromURL: (url: string): string => {
        const urlTrim = Helpers.trim(url);
        const index = urlTrim.indexOf("//");
        if (index > -1) {
            return urlTrim.substring(0, index);
        }
        return "";
    },

    /**
     * Format numbers with leading zeros
     *
     * @param {number} num A number
     * @param {number} size Sring output length
     * @returns {string} String format with leading zero
     */
    zeroPad: (num: number, size: number): string => {
        let result = `${num}`;
        while (result.length < size) {
            result = "0" + result;
        }
        return result;
    },

    /**
     * Copy object properties to another object
     *
     * @param {any} sourceObj Object
     * @param {any} distObj Object
     */
    copyProperties: (sourceObj: any, distObj: any) => {
        for (const key in sourceObj) {
            if (!sourceObj.hasOwnProperty(key)) {
                continue;
            }
            const sourceObjData: any = sourceObj[key];
            if (!Helpers.isNullOrEmpty(sourceObjData)) {
                if (Array.isArray(sourceObjData)) {
                    const distObjData: any = [];
                    Helpers.copyProperties(sourceObjData, distObjData);
                    distObj[key] = distObjData;
                    continue;
                }
                if (Helpers.isObject(sourceObjData)) {
                    const distObjData: any = {};
                    Helpers.copyProperties(sourceObjData, distObjData);
                    distObj[key] = distObjData;
                    continue;
                }
            }
            distObj[key] = sourceObjData;
        }
    },

    /**
     * Clone object
     *
     * @param {T} sourceObj Object
     */
    cloneObject: <T>(sourceObj: T): T => {
        const cloneObj: T = {} as T;
        Helpers.copyProperties(sourceObj, cloneObj);
        return cloneObj;
    },

    /**
     * Get last date of month
     *
     * @param {number} month A number
     * @param {number} year A number
     */
    getLastDateOfMonth: (month: number, year: number): number => {
        const startOfMonth = moment([year, month - 1]);
        const lastOfMonth = moment(startOfMonth).endOf("month");
        return lastOfMonth.toDate().getDate();
    },

    getBase64: (file: Blob, callback: (result: any) => void) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let result = reader.result;
            if (Helpers.isString(reader.result)) {
                const base64Data = reader.result.split(",");
                result = base64Data.length > 0 ? base64Data[1] : "";
            }
            callback(result);
        };
        reader.onerror = (error) => {
            console.log("Error: ", error);
        };
    },

    stringToHTML: (text: string) => {
        return parse(DOMPurify.sanitize(text));
    },

    handleFormatParams(data: any) {
        const params = new URLSearchParams();
        Object.entries(data).forEach(([key, values]) => {
            if (!Helpers.isNullOrEmpty(values)) {
                if (Array.isArray(values)) {
                    if (values.length > 0) {
                        values.forEach((value) => {
                            if (!Helpers.isNullOrEmpty(value)) {
                                params.append(key, value.toString());
                            }
                        });
                    }
                } else {
                    params.append(key, `${values}`);
                }
            }
        });
        return params.toString();
    },

    formatCurrency: (money: string | number): string => {
        // let format = '$1,';
        // if (Strings.getLanguage() === Constants.Language.VI) {
        let format = "$1.";
        // }
        if (Helpers.isString(money)) {
            return money.replace(/(\d)(?=(\d{3})+(?!\d))/g, format);
        }
        return (+money).toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, format);
    },

    getCharacterAvatar: (fullName?: string): string => {
        if (!fullName) {
            return "";
        }
        const itemNames = fullName.split(" ").filter((value: string) => {
            return value.trim().length > 0;
        });
        let fName = "";
        if (itemNames.length >= 2) {
            for (let i = itemNames.length - 2; i < itemNames.length; i++) {
                if (itemNames[i].length > 0) {
                    fName = fName + itemNames[i].substring(0, 1).toUpperCase();
                }
            }
        } else {
            fName = itemNames[0].substring(0, 1).toUpperCase();
        }
        return fName;
    },

    getFileName: (fullFileName: string): string => {
        let fileName = "";
        let index = fullFileName.length - 1;
        while (fullFileName.charAt(index) != "/" && index >= 0) {
            fileName = fullFileName.charAt(index) + fileName;
            index--;
        }
        return fileName;
    },

    getFileExtesion: (fullFileName?: string): string => {
        if (!Helpers.isNullOrEmpty(fullFileName)) {
            return ("." + fullFileName.toLowerCase().split(".").pop()) as string;
        } else {
            return "";
        }
    },

    trimSpaceForwardSlash: (inputString: string): string => {
        if (inputString != null && inputString.length > 0) {
            let modifiedString = inputString;
            while (
                !Helpers.isNullOrEmpty(modifiedString) &&
                (modifiedString[0] === " " ||
                    modifiedString[0] === "/" ||
                    modifiedString[modifiedString.length - 1] === " " ||
                    modifiedString[modifiedString.length - 1] === "/")
            ) {
                modifiedString = modifiedString.trim();
                modifiedString = modifiedString.replace(/^\/+/, "").replace(/\/+$/, "");
            }
            return modifiedString;
        } else {
            return "";
        }
    },

    joinString: (separator: string, ...parts: string[]): string => {
        return parts.join(separator);
    },

    urlJoin: (...parts: (string | undefined | null)[]): string => {
        const urlParts: (string | undefined | null)[] = parts
            .filter((part) => !Helpers.isNullOrEmpty(part) && part && part.length > 0)
            .map((part) => part && Helpers.trimSpaceForwardSlash(part))
            .filter((part) => !Helpers.isNullOrEmpty(part) && part && part.length > 0);

        return urlParts.join("/");
    },

    getFileAccessUrl: (fileId?: string): string => {
        if (Helpers.isNullOrEmpty(fileId) || fileId === "0") {
            return "";
        }
        return ASSET_API_URL + Constants.ApiPath.GET_ASSET_ACCESS_URL + `/${fileId}`;
    },

    getFileDownloadUrl: (fileId?: string): string => {
        if (Helpers.isNullOrEmpty(fileId) || fileId === "0") {
            return "";
        }
        return ASSET_API_URL + Constants.ApiPath.GET_ASSET_DOWNLOAD_URL + `/${fileId}`;
    },

    isYoutubeUrl: (url?: string): boolean => {
        if (Helpers.isNullOrEmpty(url)) {
            return false;
        }

        return url.trim().toLowerCase().replace(".", "").includes("youtube");
    },

    /**
     * Show alert
     *
     * @param {string} message message for display
     * @param {"warning" | "success" | "error" | "info" | "question" | undefined} type type of alert
     */
    showAlert: async (
        message: string,
        type?: "warning" | "success" | "error" | "info" | "question",
        okCallback?: any,
        html?: string | HTMLElement | JQuery | undefined
    ) => {
        const msg = message;
        const okPress = await Swal.fire({
            text: msg,
            icon: type,
            html: html,
            customClass: {
                container: "custom-sweetalert2",
                confirmButton: "custom-sweetalert2-btn-ok",
            },
            allowEnterKey: false,
            allowOutsideClick: false,
        });
        if (okPress && okPress.isConfirmed && okCallback && Helpers.isFunction(okCallback)) {
            okCallback();
        }
    },

    /**
     * Show confirm alert
     *
     * @param {string} message message for display
     * @param {function} okCallback callback handle when click ok
     * @param {function} cancelCallback callback handle when click cancel
     */
    showConfirmAlert: async (
        message: string,
        okCallback: any,
        cancelCallback?: any,
        okButtonMessage?: string,
        cancelButtonMessage?: string,
        html?: string | HTMLElement | JQuery | undefined,
        type?: "warning" | "success" | "error" | "info" | "question"
    ) => {
        const msg = message;
        const okMessage = okButtonMessage || "Ok";
        const cancelMessage = cancelButtonMessage || "Hủy";

        const okPress = await Swal.fire({
            text: msg,
            html: html,
            icon: type || "warning",
            reverseButtons: true,
            showCancelButton: true,
            allowOutsideClick: false,
            confirmButtonText: okMessage,
            cancelButtonText: cancelMessage,
            customClass: {
                container: "custom-sweetalert2",
                confirmButton: "custom-sweetalert2-btn-ok",
                cancelButton: "custom-sweetalert2-btn-cancel",
            },
        });
        if (okPress && okPress.isConfirmed && okCallback && Helpers.isFunction(okCallback)) {
            okCallback();
        } else {
            if (cancelCallback && Helpers.isFunction(cancelCallback)) {
                cancelCallback();
            }
        }
    },

    encodeBase64: (data: any) => {
        return Buffer.from(data).toString("base64");
    },

    decodeBase64: (data: any) => {
        return Buffer.from(data, "base64").toString("ascii");
    },

    isCocCoc: () => {
        const thisWindow: any = window;
        const brands: any[] = thisWindow?.navigator?.userAgentData?.brands || [];
        const indexOfCocCoc = brands?.findIndex((item) => item.brand === Constants.COCCOC_BRAND_NAME);
        return indexOfCocCoc !== -1;
    },

    getUrlParams: (keys: string[]): { [key: string]: string | undefined } => {
        const params = new URLSearchParams(window.location.search);
        let datas: { [key: string]: string | undefined } = {};
        keys.forEach((key) => {
            datas[key] = params.get(key) || undefined;
        });
        return datas;
    },

    isDev: (): boolean => {
        return process.env.NODE_ENV !== "production";
    },

    handleError: (error: any, router?: NextRouter, dispatch?: Dispatch) => {
        if (error?.code === 403) {
            if (router) {
                router.push("/403");
            } else {
                window.location.href = "/403";
            }
        } else if (error?.code === 404) {
            // if (router) {
            //     router.push("/404");
            // } else {
            //     window.location.href = "/404";
            // }
        } else if (error?.code === 401) {
            Helpers.showAlert("Phiên đăng nhập đã hết hạn", "error", () => {
                if (router) {
                    router.push("/auth/logout-redirect");
                } else {
                    window.location.href = "/auth/logout-redirect";
                }
            });
        } else if (error?.code === 400) {
            Helpers.handleException(error, dispatch);
        } else {
            Helpers.handleException(undefined, dispatch);
        }
    },

    handleException: (error?: any, dispatch?: Dispatch) => {
        const defaultMessage = "Đã có phát sinh lỗi trong quá trình xử lý, vui lòng thử lại sau. Xin lỗi vì đã gây bất tiện.";
        const showMessage = (message: string) => {
            if (dispatch) {
                dispatch(showSnackbar({ msg: message, type: "error" }));
            } else {
                Helpers.showAlert(message, "error");
            }
        };

        let message: string | undefined = undefined;

        if (error) {
            const isErrorMessageString = typeof error?.message === "string";
            if (isErrorMessageString) {
                message = error.message;
            } else {
                let mesErr = undefined;
                let validationErr = undefined;

                if (error?.message?.responseException?.validationErrors) {
                    switch ((error?.message?.responseException?.validationErrors || [])[0].message) {
                        default:
                            validationErr = (error?.message?.responseException?.validationErrors || [])[0].message;
                    }
                }

                if (error?.message?.responseException?.exceptionMessage) {
                    switch (error?.message?.responseException?.exceptionMessage) {
                        default:
                            mesErr = error?.message?.responseException?.exceptionMessage;
                    }
                }

                message =
                    validationErr || mesErr || (isErrorMessageString ? error?.message : "") || error?.message?.message || error?.message?.Message;
            }
        }
        showMessage(message ?? defaultMessage);
    },

    // yup (npm package) validation
    handleValidationError: (error: any) => {
        let newErrors: { [key: string]: string } = {};
        if (error.name === "ValidationError") {
            error.inner.forEach((e: any) => {
                const path = `${e.path}`.split(".");
                newErrors[path[0]] = e.errors[0];
            });
        }
        return newErrors;
    },

    isTutor: (userInfo?: IUserInfo) => {
        if (!userInfo) {
            return false;
        }
        return userInfo?.roleCodes?.some((x) => x === RoleCode.TUTOR);
    },

    isAdmin: (userInfo?: IUserInfo) => {
        if (!userInfo) {
            return false;
        }
        return userInfo?.roleCodes?.some((x) => x === RoleCode.ADMIN);
    },

    getUserIds: (sourceItems: any[], key: string) => {
        let mergedArray: string[] = [];
        sourceItems?.forEach((item) => {
            const itemIds = item[key] && item[key].map((x: any) => x.id);
            if (!Helpers.isNullOrEmpty(itemIds)) {
                mergedArray = mergedArray.concat(itemIds);
            }
        });
        const uniqueArray = mergedArray.filter((item, index) => mergedArray.indexOf(item) === index);
        return uniqueArray.filter((item) => item !== undefined);
    },

    getPageNumber: (pageNumber: number, pageSize: number, totalCount: number) => {
        return pageNumber > (Math.ceil((totalCount || 0) / pageSize) || 1) ? Math.ceil((totalCount || 0) / pageSize) || 1 : pageNumber;
    },

    getLastPartUrl: (url: string): string => {
        const parts = url.split("/");
        if (parts.length > 0) {
            return parts[parts.length - 1];
        } else {
            return url;
        }
    },

    getTenantCode: (): string => {
        return Constants.TENANT_CODE;
    },

    isServerside: () => {
        return typeof window === "undefined";
    },

    getContentByLocale(content: IMultiLanguageContent | undefined, locale: string) {
        if (!content) {
            return "";
        }
        return content.value[locale] ?? content.value["vi"] ?? "";
    },

    getDeviceInfo(): { deviceId: string; deviceInfo: string } {
        const deviceId = uuidv4();
        const deviceInfo = JSON.stringify({
            browserName,
            browserVersion,
            deviceType,
            osVersion,
            osName,
        });
        return {
            deviceId,
            deviceInfo,
        };
    },

    async getDeviceId() {
        try {
            const result = await getCurrentBrowserFingerPrint();
            return result;
        } catch (error) {
            return uuidv4();
        }
    },

    currencyMapper(language: string) {
        if (language === Constants.Language.VI) {
            return "VND";
        }
        return "USD";
    },

    addParamsToUrl(url: string, params?: { [key: string]: string }) {
        if (!params) {
            return url;
        }
        let result = url;
        Object.entries(params).forEach(([key, value], index) => {
            const pad = index === 0 ? "?" : "&";
            result += pad + key + "=" + value;
        });
        return result;
    },

    formatDate: (value?: string | Date | number, format?: string): string => {
        const result = value
            ? moment(value)
                  .local()
                  .format(format || "DD/MM/YYYY")
            : "";
        return result;
    },

    getDate: (value?: number | string, defaultString?: string) => {
        if (Helpers.isNullOrEmpty(value) || value === 0 || value === "0") return defaultString;
        return Helpers.formatDate(Number(value) * 1000);
    },

    getRandomElemementInArray: (array: string[]) => {
        return array[Math.floor(Math.random() * array.length)];
    },

    getDefaultValueMultiLanguage: (data: IMultiLanguageContent | undefined, currentLanguage: string) => {
        if (Helpers.isNullOrEmpty(data)) return "";
        if (Helpers.isNullOrEmpty(data.value?.[currentLanguage]) && !Helpers.isNullOrEmpty(data?.value?.[Constants.DefaultLanguage]))
            return data?.value?.[Constants.DefaultLanguage];
        if (Helpers.isNullOrEmpty(data.value?.[currentLanguage])) return "";
        return data.value?.[currentLanguage];
    },

    formatDateName: (date: number, language: string): string => {
        let name = "";
        if (Helpers.isNullOrEmpty(date) || date === 0) {
            return name;
        } else {
            try {
                if (typeof Intl === "undefined") {
                    require("intl");
                    require("intl/locale-data/jsonp/vi");
                }
                const options: Intl.DateTimeFormatOptions = { weekday: "long" };

                name = new Intl.DateTimeFormat(language, options).format(date);
            } catch (error) {
                console.log("formatDateName", error);
            }
            return name;
        }
    },

    formatMothName: (date: number, language: string): string => {
        let name = "";
        if (Helpers.isNullOrEmpty(date) || date === 0) {
            return name;
        } else {
            try {
                if (typeof Intl === "undefined") {
                    require("intl");
                    require("intl/locale-data/jsonp/vi");
                }
                const options: Intl.DateTimeFormatOptions = { month: "long" };

                name = new Intl.DateTimeFormat(language, options).format(date);
            } catch (error) {
                console.log("formatDateName", error);
            }
            return name;
        }
    },

    calcNumberOfAdultAndChild: (data: IOccupancy[]) => {
        const result = (data || []).reduce(
            (acc, cur) => {
                acc.numberOfAdult = acc.numberOfAdult + cur.adultSlot;
                acc.numberOfChild = acc.numberOfChild + cur.childrenOld.length;
                return acc;
            },
            { numberOfAdult: 0, numberOfChild: 0 }
        );
        return result;
    },

    getAttributeValue: (attributes: IAttribute[], attributeCode: AttributeCodes) => {
        return (attributes || []).find((attribute) => attribute.attributeCode === attributeCode)?.attributeValue || "";
    },

    getTotalByKey: (prices: IPrice, key: keyof ITotals) => {
        const result = prices?.totals?.[key]?.billingCurrency;
        return {
            value: result?.value || 0,
            currency: result?.currency || Constants.CURRENCY_DEFAULT,
        };
    },

    getIconByReferencyId: (referenceId: string) => {
        if (referenceId === AttributeReferenceId.wifi) return "wifi";
        if (referenceId === AttributeReferenceId.air_conditioning) return "ac_unit";
        if (referenceId === AttributeReferenceId.laundry_facilities) return "dry_cleaning";
        if (referenceId === AttributeReferenceId.self_parking) return "local_parking";
        if (referenceId === AttributeReferenceId.parking) return "local_parking";
        if (referenceId === AttributeReferenceId.free_parking) return "local_parking";
        if (referenceId === AttributeReferenceId.outdoor_pools) return "pool";
        if (referenceId === AttributeReferenceId.buffet) return "free_breakfast";
        return "";
    },

    getTextByReferencyId: (referenceId: string) => {
        if (referenceId === AttributeReferenceId.wifi) return "free_wifi";
        if (referenceId === AttributeReferenceId.air_conditioning) return "air_conditioning";
        if (referenceId === AttributeReferenceId.laundry_facilities) return "laundry_facilities";
        if (referenceId === AttributeReferenceId.self_parking) return "free_self_parking";
        if (referenceId === AttributeReferenceId.parking) return "free_self_parking";
        if (referenceId === AttributeReferenceId.free_parking) return "free_self_parking";
        if (referenceId === AttributeReferenceId.outdoor_pools) return "pool";
        if (referenceId === AttributeReferenceId.buffet) return "breakfast";
        return "";
    },

    getAddressInfo: (addressInfo: IAddress) => {
        const array = [
            addressInfo?.addressLine,
            addressInfo?.addressLine2,
            addressInfo?.cityName || addressInfo?.provinceName,
            addressInfo?.countryName || addressInfo?.countryCode,
        ].filter((el) => !Helpers.isNullOrEmpty(el));
        if (array.length === 0) return "";
        return array.join(", ");
    },

    getSearchLanguge: (language: string) => {
        if (language === "vi") return "vi-VN";
        if (language === "en") return "en-US";
        return "vi-VN";
    },

    getMultipleAttributeValue: (attributes: IAttribute[], attributeCode: AttributeCodes) => {
        const temp = (attributes || []).filter((attribute) => attribute.attributeCode === attributeCode);
        return temp.map((attribute) => attribute.attributeValue);
    },

    getHighlightAttributes: (attributes: IAttribute[]) => {
        return (attributes || []).filter((item) => Constants.POPULAR_AMENTITY.includes(item.referenceId || ""));
    },

    getDateNameFormat: (time: number, language?: string) => {
        const day = `${Helpers.formatDate(time, "DD")}`;
        const dayName = `${Helpers.formatDateName(time, language || "vi")}`;
        const month = `${Helpers.formatMothName(time, language || "vi")}`;
        return [dayName, `${day} ${month}`].join(", ");
    },

    getStartAndEndTimeOfTrip: (tripsDetail: IItineraryDetail[]) => {
        return (tripsDetail || []).reduce(
            (acc, cur) => {
                const startTime = Number(cur.startTime || 0);
                const endTime = Number(cur.endTime || 0);
                if (acc.startTime === 0) {
                    acc.startTime = startTime;
                }
                if (startTime < acc.startTime) {
                    acc.startTime = startTime;
                }
                if (endTime > acc.endTime) {
                    acc.endTime = endTime;
                }
                return acc;
            },
            {
                startTime: 0,
                endTime: 0,
            }
        );
    },

    formatFlightData: (data: IFlight): IFlightDetail[] => {
        const result: IFlightDetail[] = [];
        let index = 0;

        const convertItineraryType = (type: string) => {
            if (type === EItineraryType.MULTIPLE_TRIP) return FlightType.MultiCity;
            if (type === EItineraryType.ROUND_TRIP) return FlightType.RoundTrip;
            if (type === EItineraryType.ONE_WAY) return FlightType.OneWay;
            return null;
        };

        for (const flight of data.flightSelectedList) {
            for (const classList of flight.classesList) {
                const departDate = moment(Helpers.convertDDMM_To_MMDD(flight.departDT)).tz(flight.arrivalPlaceObj?.timezone).unix();

                const arrivalDate = moment(Helpers.convertDDMM_To_MMDD(flight.arrivalDT)).tz(flight.arrivalPlaceObj?.timezone).unix();

                const itineraryType = convertItineraryType(data.itineraryType);

                result.push({
                    searchKey: data.searchKey,
                    flightId: data.flightId,
                    carrierOperator: flight.carrierOperator,
                    flightNumber: flight.flightNumber,
                    cabinClass: flight.cabinClass,
                    bookingClass: classList.bookingClass, // - Hạng ghế
                    flightDuration: flight.flightDuration,
                    departDT: flight.departDT,
                    arrivalDT: flight.arrivalDT,
                    departDate: departDate, // - Ngày khởi hành
                    departPlace: flight.departPlace, // - Mã sân bay đi
                    arrivalPlace: flight.arrivalPlace, // - Mã sân bay đến
                    arrivalDate: arrivalDate, // - Ngày đến
                    departPlaceObj: flight.departPlaceObj, // - Tên sân bay đến
                    arrivalPlaceObj: flight.arrivalPlaceObj, // - Tên sân bay đi
                    carrierMarketingObj: flight.carrierMarketingObj,
                    carrierOperatorObj: flight.carrierOperatorObj, // - Thông tin tên hãng bay
                    flightType: itineraryType, // - Loại chuyến bay

                    totalFareAmount: flight.feeObj.totalFareAmount, // - Tổng tiền đã bao gồm thuế
                    totalFareBasic: flight.feeObj.totalFareBasic, // - Tổng tiền không bao gồm thuế
                    totalTaxAmount: flight.feeObj.totalTaxAmount, // - Tổng số thuế
                    currency: flight.feeObj?.totalPaxFareAdt?.currency || "VND",
                    passengerQuantity: data.passengerQuantity, // - Hành khách: + Số người lớn; + Số trẻ em; + Số trẻ em (sơ sinh)
                    segmentsList: flight.segmentsList,
                    freeBaggage: flight.freeBaggage,
                });
            }
            index += 1;
        }
        return result;
    },

    getEItineraryType: (type?: FlightType | null) => {
        if (type === FlightType.MultiCity) return "Nhiều chặng";
        if (type === FlightType.RoundTrip) return "Khứ hồi";
        if (type === FlightType.OneWay) return "Bay thẳng";
        return "";
    },

    getFlightName: (data: IFlightDetail) => {
        return [
            "Chuyến bay",
            Helpers.getEItineraryType(data?.flightType).toLocaleLowerCase(),
            [data?.departPlaceObj?.name, data?.arrivalPlaceObj?.name].join(" - "),
        ].join(" ");
    },

    getGuestsOfFlight: (data: IFlightDetail) => {
        return data.passengerQuantity?.adt || 0 + data.passengerQuantity?.chd || 0 + data.passengerQuantity?.inf || 0;
    },

    convertDDMM_To_MMDD: (value: string) => {
        const valueSplit = value.split("/");

        const arrTemp = [valueSplit?.[1], valueSplit?.[0], valueSplit?.[2]];

        const valueRext = arrTemp.join("/");

        return valueRext;
    },

    getFirstAndLastname: (fullName: string) => {
        const result = { firstName: "", lastName: "" };
        if (Helpers.isNullOrEmpty(result)) return result;
        const temp = fullName.split(" ");
        if (temp.length >= 2) {
            result.firstName = temp[temp.length - 1];
            result.lastName = temp.splice(0, temp.length - 1).join(" ");
        }
        if (temp.length === 1) {
            result.firstName = temp[0];
        }
        return result;
    },

    getCurrentRoomAndRateOfHotel: (detail: IDetailHotel, roomId: string, rateId: string): IDetailHotel => {
        const room = detail.rooms.find((room) => room.referenceId === roomId);
        const rate = room?.rates.find((rate) => rate.referenceId === rateId);

        if (Helpers.isNullOrEmpty(room?.referenceId)) return detail;

        if (Helpers.isNullOrEmpty(rate?.referenceId))
            return {
                ...detail,
                rooms: [room as IRoom],
            };

        return {
            ...detail,
            rooms: [
                {
                    ...(room as IRoom),
                    rates: [
                        {
                            ...(rate as IRate),
                        },
                    ],
                },
            ],
        };
    },

    toCamelCase: (string: string) => {
        return string.charAt(0).toLocaleLowerCase() + string.slice(1);
    },

    toCamelCaseObj: (obj: any) => {
        if (typeof obj !== "object") return obj;
        if (Helpers.isNullOrEmpty(obj)) return obj;
        const result: object = {};
        for (const [key, value] of Object.entries(obj)) {
            let newValue;
            if (Array.isArray(value)) {
                newValue = value.length === 0 ? [] : value.map((el) => Helpers.toCamelCaseObj(el));
            } else {
                newValue = Helpers.toCamelCaseObj(value);
            }
            Object.assign(result, {
                [Helpers.toCamelCase(key)]: newValue,
            });
        }
        return result;
    },
    removeVietnameseTones: (str: string) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, " ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        return str;
    },

    setLocalStorage: setFromBrowserStorage("local"),
    getLocalStorage: getFromBrowserStorage("local"),

    setSessionStorage: setFromBrowserStorage("session"),
    getSessionStorage: getFromBrowserStorage("session"),
    removeSessionStorage: removeFromBrowserStorage("session"),

    getValueOfCodeName: (code: string | number, data: ICodename[]) => {
        return data.find((el) => el.code === code)?.name || "";
    },
    getDateValue: (value: number | string | undefined) => {
        return Helpers.isNullOrEmpty(value) || value === 0 || value === "0" ? undefined : Number(value || 0) * 1000;
    },

    formatDuration: (minutes: number, isShowZeroMinutes = false, language: string) => {
        const hours = Math.floor(minutes / 60);
        const minutesReminder = minutes - hours * 60;
        if (minutesReminder === 0) {
            return isShowZeroMinutes
                ? language == Constants.Language.VI
                    ? `${hours}g ${minutesReminder}p`
                    : `${hours}h ${minutesReminder}m`
                : language == Constants.Language.VI
                ? `${hours}g`
                : `${hours}h`;
        }

        return language == Constants.Language.VI ? `${hours}g ${minutesReminder}p` : `${hours}h ${minutesReminder}m`;
    },

    getCurrency: (currency: string) => {
        if (Helpers.isNullOrEmpty(currency) || currency.toUpperCase() === "VND") return "đ";
        return currency;
    },

    getVietnameseDateFormat: (date: number) => {
        if(Helpers.isNullOrEmpty(date) || date === 0 || String(date) === "0") return "";
        const newDate = moment(date * 1000);
        const day = newDate.day();
        const dateFormat = newDate.format(Constants.DateFormat.DDMMYYYY);
        return [DAY_LIST[day], dateFormat].join(", ");
    },

    converStringToJson: (value?: any): any => {
        if (Helpers.isNullOrEmpty(value) || value === "undefined" || value === "null") {
            return undefined;
        } else {
            try {
                const newValue = JSON.parse(value);
                return newValue;
            } catch (error) {
                return undefined;
            }
        }
    },
};

const DAY_LIST = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];


function setFromBrowserStorage(storage: "local" | "session") {
    return (key: string, value: any) => {
        const s = storage === "local" ? localStorage : sessionStorage;
        s.setItem(key, JSON.stringify(value));
    };
}
function getFromBrowserStorage(storage: "local" | "session") {
    return (key: string, defaultValue?: any) => {
        const s = storage === "local" ? localStorage : sessionStorage;
        const value = s.getItem(key);
        if (!Helpers.isNullOrEmpty(value) && value !== "undefined" && value !== "null") {
            return JSON.parse(value || "");
        } else {
            return defaultValue;
        }
    };
}
// remove from storage
function removeFromBrowserStorage(storage: "local" | "session") {
    return (key: string) => {
        const s = storage === "local" ? localStorage : sessionStorage;
        s.removeItem(key);
    };
}

export default Helpers;
