import { TLanguage } from "@src/commons/interfaces";
import { AttributeReferenceId } from "@src/commons/enum";

const ASSET_API_URL = process.env.NEXT_PUBLIC_ASSET_API_URL || "";

const IDENTITY_DOMAIN = process.env.NEXT_PUBLIC_IDENTITY_URL || "";
const IDENTITY_API_URL = `${IDENTITY_DOMAIN}/api`;

const SALE_DOMAIN = process.env.NEXT_PUBLIC_SALE_URL || "";
const SALE_API_URL = process.env.NEXT_PUBLIC_SALE_API_URL || "";

const CHECKOUT_DOMAIN = process.env.NEXT_PUBLIC_CHECKOUT_URL || "";

const SEARCH_API_URL = process.env.NEXT_PUBLIC_SEARCH_API_URL || "";
const COMMON_API_URL = process.env.NEXT_PUBLIC_COMMON_API_URL || "";
const BOOKING_API_URL = process.env.NEXT_PUBLIC_BOOKING_API_URL || "";
const MAYWORK_API_URL = process.env.NEXT_PUBLIC_MAYWORK_API_URL || "";

export {
    IDENTITY_DOMAIN,
    IDENTITY_API_URL,
    SALE_DOMAIN,
    SALE_API_URL,
    CHECKOUT_DOMAIN,
    ASSET_API_URL,
    SEARCH_API_URL,
    COMMON_API_URL,
    MAYWORK_API_URL,
    BOOKING_API_URL,
};

const Constants = {
    /**
     * Config for api.
     */
    Api: {
        /** Timeout for each request:  */
        TIMEOUT: 180 * 1000,
    },
    CURRENCY_DEFAULT: "VND",
    ORGANIZATION_ID_DEFAULT: "569629891478163456",

    POPULAR_AMENTITY: [
        AttributeReferenceId.wifi,
        AttributeReferenceId.air_conditioning,
        AttributeReferenceId.laundry_facilities,
        AttributeReferenceId.self_parking,
        AttributeReferenceId.outdoor_pools,
        AttributeReferenceId.parking,
        AttributeReferenceId.free_parking,
        AttributeReferenceId.outdoor_pools,
        AttributeReferenceId.buffet,
    ] as string[],
    IMAGE_PIXELS_RANGE: ["70px", "350px", "1000px"],

    /**
     * Cloud Storage config
     */
    CloudStorage: {
        TEMP_FOLDER: "temp",
        AVATAR_FOLDER: "avatar",
        ORGANIZATION_IMAGE_FOLDER: "org_image",
        EDITOR_CONTENT_FOLDER: "editor_content",
    },

    IdentityPath: {
        REDIRECT_URI: "/auth/callback",
        POST_LOGOUT_REDIRECT_URL: "/",
    },

    /**
     * Return code from Api
     */
    ApiCode: {
        // Code from server api
        SUCCESS: 200,
        NOT_AUTHORIZE: 401,

        // Code from local app
        CONNECTION_TIMEOUT: "CONNECTION_TIMEOUT",
        INTERNAL_SERVER: "INTERNAL_SERVER",
        UNKNOWN_NETWORK: "UNKNOWN_NETWORK",
    },

    /**
     * Setting path for Api
     */
    ApiPath: {
        // auth
        LOGIN: "/auth/login",
        LOGOUT: "/auth/logout",
        REGISTER: "/User/Register",
        UPDATE_PASSWORD: "/user/changepassword",

        // common
        UPLOAD_FILE: "/File/Upload",
        UPLOAD_IMAGE: "/Image/Upload",

        // CODENAME
        CODE_NAME: {
            GET_BY_GROUP: "/Codename/GetByGroup",
            CREATE: "/Codename/Create",
            UPDATE: "/Codename/Update",
        },

        // Booking
        BOOKING: {
            GETPAGED: "/Booking/GetPaged",
            DELETE: "/Booking/Delete",
            CANCEL: "/Booking/Cancel",
            UPDATE: "/Booking/Update",

            CREATE: "/Booking/Create",
            DETAIL: "/Booking/Detail",
            CONFIRM: "/Booking/Confirm",
            CONFIRM_MULITPLE: "/Booking/ConfirmMultiple",
            DETAIL_BY_ORDER_ID: "/Booking/DetailByOrderId",
        },

        // Itinerary
        ITINERARY: {
            CREATE: "/Itinerary/Create",
            CREATE_BY_BOOKING: "/Itinerary/CreateByBooking",
            UPDATE: "/Itinerary/Update",
            UPDATE_MEMBER_DETAIL: "/Itinerary/UpdateMemberDetail",
            UPDATE_ITINERARY: "/Itinerary/UpdateItinerary",
            DETAIL: "/Itinerary/Detail",
            DELETE: "/Itinerary/Delete",
            GET_PAGED: "/Itinerary/GetPaged",
            DELETE_ITINERARY_DETAIL: "/Itinerary/DeleteItineraryDetail",
            ADD_BOOKING_ITINERARY: "/Itinerary/AddBookingItinerary",
            UPDATE_MEMBER: "/Itinerary/UpdateMember",
            CONFIRM_DETAILS: "/Itinerary/ConfirmDetails",
            COUNT_IITNERARY: "/Itinerary/CountItinerary",
            GET_LIST_DETAIL: "/Itinerary/GetListDetail",
            SUBMIT_REQUEST: "/Itinerary/SubmitRequest",
        },

        ITINERARY_DETAIL: {
            DETAIL: "/ItineraryDetail/Detail",
            CANCEL: "/ItineraryDetail/Cancel"
        },

        FLIGHT: {
            ISSUE: "/Flight/Issue",
            RETRIEVE_BOOKING: "/Flight/RetrieveBooking",
        },

        // ASSET
        GET_M3U8_URL: "/GetM3u8Url",
        GET_ASSET_INFO: "/GetAssetInfo",
        SET_ACTIVE_BY_ID: "/SetActiveById",
        CREATE_URL_ASSET: "/CreateUrlAsset",
        GET_ASSET_ACCESS_URL: "/GetAccessUrl",
        GET_ASSET_DOWNLOAD_URL: "/GetDownloadUrl",
        GET_EXTERNAL_URL_IDS: "/GetExternalUrlIds",

        // SHOPPING CART
        SHOPPING_CART: {
            CREATE: "/ShoppingCart/Create",
        },
        // ORDER
        ORDER: {
            GET_PAGED: "/Order/GetPaged",
            CREATE: "Order/Create",
            PRICING: "Order/Pricing",
            PRICING_MULTIPLE: "Order/PricingMultiple",
            DETAIL: "/Order/Detail",
            CANCEL: "/Order/Cancel",
            UPDATE: "/Order/Update",
            GET_BY_IDS: "/Order/GetByIds",
            CONFIRM_PAYMENT: "/Order/ConfirmPayment",
            GET_ORDER_DETAIL_BY_ID: "/Order/GetOrderDetailByIds",
            UPDATE_AND_PAYMENT: "/Order/UpdateAndPayment",
        },

        // PAYMENT ACCOUNT
        PAYMENT_ACCOUNT: {
            GETPAGED: "/PaymentAccount/GetPaged",
            CREATE: "/PaymentAccount/Create",
            UPDATE: "/PaymentAccount/Update",
            DETAIL: "/PaymentAccount/Detail",
            DELETE: "/PaymentAccount/Delete",
            SET_DEFAULT: "/PaymentAccount/SetDefault",
        },

        // BOOKING POLICY
        BOOKING_POLICY: {
            GETPAGED: "/BookingPolicy/GetPaged",
            CREATE: "/BookingPolicy/Create",
            UPDATE: "/BookingPolicy/Update",
            DETAIL: "/BookingPolicy/Detail",
            DELETE: "/BookingPolicy/Delete",
            GET_BY_CONDITION: "BookingPolicy/GetByCondition",
        },

        // BUDGET
        BUDGET: {
            CREATE: "/Budget/Create",
            UPDATE: "/Budget/Update",
            DETAIL: "/Budget/Detail",
            DELETE: "/Budget/Delete",
            GET_ALL: "/Budget/GetAll",
            GET_PAGED: "/Budget/GetPaged",
        },

        SEARCH: {
            QUERY: "/Search/entity/Query",
        },

        ATTRIBUTE: {
            GET_BY_CODE: "/Attribute/GetByCode",
        },

        ADMINISTRATIVE_DIVISION: {
            GET_ALL: "/AdministrativeDivision/GetAll",
        },

        // #region WORKFLOW
        WORKFLOW: {
            GET_ALL: "/Workflow/GetAll",
            GET_PAGED: "/Workflow/GetPaged",
            DETAIL: "/Workflow/Detail",
            UPDATE: "/Workflow/Update",
            CREATE: "/Workflow/Create",
            DELETE: "/Workflow/Delete",
            FULL_UPDATE: "/Workflow/FullUpdate",
        },

        WORKFLOW_CRITERIA: {
            GET_BY_CASECODE: "/WorkflowCriteria/GetByCaseCode",
        },
        // #endregion WORKFLOW
    },

    /**
     * Request methods
     */
    Methods: {
        GET: "GET",
        PUT: "PUT",
        POST: "POST",
        PATCH: "PATCH",
        DELETE: "DELETE",
    },

    /**
     * Styles for app.
     *
     * Color refer
     * @see https://www.rapidtables.com/web/color/index.html
     * @see https://www.w3schools.com/w3css/w3css_colors.asp
     */
    Styles: {
        // =====================================================================
        // Common color
        // =====================================================================
        PRIMARY_COLOR: "#1A73E8",
        BLACK_COLOR: "#000000",
        BLUE_COLOR: "#0000FF",
        GRAY_COLOR: "#808080",
        GREEN_COLOR: "#008000",
        LIGHTGRAY_COLOR: "#D3D3D3",
        RED_COLOR: "#FF0000",
        WHITE_COLOR: "#FFFFFF",

        // =====================================================================
        // Console log style
        // Color refer at: https://www.w3schools.com/w3css/w3css_colors.asp
        // =====================================================================
        CONSOLE_LOG_DONE_ERROR: "border: 2px solid #F44336; color: #000000", // Red
        CONSOLE_LOG_DONE_SUCCESS: "border: 2px solid #4CAF50; color: #000000", // Green
        CONSOLE_LOG_ERROR: "background: #F44336; color: #FFFFFF", // Red
        CONSOLE_LOG_NOTICE: "background: #FF9800; color: #000000; font-size: x-large", // Orange
        CONSOLE_LOG_PREPARE: "border: 2px solid #2196F3; color: #000000", // Blue
        CONSOLE_LOG_START: "background: #2196F3; color: #FFFFFF", // Blue
        CONSOLE_LOG_SUCCESS: "background: #4CAF50; color: #FFFFFF", // Green
    },

    /**
     * Regex Expression
     */
    RegExp: {
        EMAIL_ADDRESS: new RegExp(
            /(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/
        ),
        NEW_EMAIL_ADDRESS: new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),

        PASSWORD: new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&._])[A-Za-z\d@$!%*#?&._]{6,255}/),
        PHONE_NUMBER: new RegExp(/^(?:0)?([1|3|5|7|8|9]{1})?([0-9]{8})$/),
        WEBSITE_URL: new RegExp(
            /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim
        ),
    },

    /**
     * Storage keys
     */
    StorageKeys: {
        FROM: "from",
        ORGANIZATION_ID: "ORGANIZATION_ID",
        DATA_TRIPS: "DATA_TRIPS",
        TRIPS: "TRIPS",
        DATA_BOOKINGS: "DATA_BOOKINGS",
        DATA_PAYMENTS: "DATA_PAYMENTS",
        RECENT_SEARCHES: "RECENT_SEARCHES",
        TRAVELERS_ALSO_VIEWED: "TRAVELERS_ALSO_VIEWED",
        ADD_TRIP_NOT_LOGIN: "ADD_TRIP_NOT_LOGIN",

        PATH_NAME_SETTING: "PATH_NAME_SETTING",
    },

    /**
     * Cookie keys
     */
    CookieNames: {
        LANGUAGE: "lang",
        SESSION_ID: "sessionId",
    },

    EventName: {
        TOKEN_EXPIRED: "TOKEN_EXPIRED",
        CHOOSE_ORGANIZATION: "CHOOSE_ORGANIZATION",
    },

    /**
     * Language
     */
    Language: {
        EN: "en" as TLanguage,
        VI: "vi" as TLanguage,
    },

    /**
     * Debounce time for action
     */
    DEBOUNCE_TIME: 400,
    MAX_AVATAR_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_VIDEO_FILE_SIZE: 30 * 1024 * 1024, // 30MB
    ROW_PER_PAGE: 9,
    ROW_PER_PAGE_20: 20,
    ROW_PER_PAGE_OPTIONS: [20, 50, 100],
    PAGE_SIZE: 12,
    DefaultLanguage: "vi",

    DateFormat: {
        DDMMYYYY: "DD/MM/YYYY",
        DDMMYYYY_HHMM: "DD/MM/YYYY HH:mm",
    },

    COCCOC_BRAND_NAME: "CocCoc",

    TENANT_CODE: "MTRAVEL",
    SERVICE_CODE: "00000C",
    SETTING_CODE: "000000",
    CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID as string,

    GOOGLE_API: {
        CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_API_CLIENT_ID as string,
        LOGIN_SCOPES: ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events"],
    },

    FONT_SIZE: {
        TEXT: "1rem",
        TITLE: "1.6rem",
        SMALL_TEXT: "0.9375rem",
        LARGE_TITLE: "2rem",
    },

    PAGE_QUERY_KEY: {
        ACTIVE_TAB: "t",
        SEARCH_TEXT: "searchText",
        PAGE_NUMBER: "page",
        TRIP_DETAIL: {
            FROM_TAB: "fromTab",
        }
    },

    PAGE_LOCALSTORAGE_KEY: {
        TRIP_DETAIL: {
            RESELECT: "itinerary/detail/reselect/",
        },
    },

     // Codename keys
     CODENAME_ALL: "ALL",

     ResourceURI: {
         TRIP: "booking/trip",
         INVOICE: "booking/invoice",
 
         BUDGET: "sale/budget",
         POLICY: "booking/policy",
         PAYMENT: "booking/paymentAccount",
 
         ROLE: "identity/role",
         STAFF: "booking/staff",
         GROUP: "booking/group",
         ORGANIZATION: "booking/organization",
         WORKFLOW: "maywork/work_flow",
         DEMOPAGE: "booking/demoPage"
 
     },
 
     MenuResourceURI: {
         TRIP: "booking/trip",
         INVOICE: "booking/invoice",
         SETTING: "booking/setting",
         DASHBOARD: "booking/dashboard",
     },
};

export default Constants;
