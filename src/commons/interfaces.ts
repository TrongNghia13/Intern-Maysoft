import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ConfirmStatus, ConfirmStatusBooking, FlightType, ItineraryType, PaymentStatus, RequestType } from "./enum";
import { boolean, number } from "yup";

export type TLanguage = "en" | "vi";

export interface IMultiLanguageContent {
    code?: string;
    searchText?: string;
    value: { [key: string]: string };
}


export interface IRecordMenuDetail {
    clientId: string
    tenantCode: string
    serviceCode: string
    id: string
    gene: string
    icon: string
    iconUrl: string
    menuType: number
    title: IMultiLanguageContent
    isExternal: number
    parentMenu: string
    searchText: string
    screenName: string
    resourceURI: string
    externalUrl: string
    displayOrder: number
    targetResource: string
    extraInformation: string
    status: number
    createTime: string
    createUser: string
    updateTime: string
    updateUser: string
}

export interface ICodename {
    id?: string;
    name: string;
    group?: string;
    code: string | number;
    detail?: any;
}

export interface IInput {
    code?: string;
    value?: any;
    error?: string;
}

export interface IPagedList<T> {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    items: T[];
    selectedItems?: T[];
}

export interface ISessionUser {
    id_token?: string;
    session_state: string | null;
    access_token: string;
    refresh_token?: string;
    token_type: string;
    scope?: string;
    profile: any;
    expires_at?: number;
}

export interface IMenuItem {
    icon?: any;
    title: string;
    path?: string;
    externalPath?: string;
}

export interface IUserInfo {
    firstLogin?: boolean;
    status: number;
    isExternalUser: number;
    userProfile: IUserProfile;
    organizations?: IOrganization[];
    currentServiceOrganizations?: IOrganization[];
    organizationGroupRoles: IOrganizationGroupRole[];
    organizationUserProfiles: IOrganizationUserProfile[];
    roleIds: string[];
    roleCodes: string[];
    groupUsers: IGroupUser[];
    defaultCurrency?: string;
    id: string;
    email: string;
    userName: string;
    emailConfirmed: boolean;
    normalizedEmail: string;
    normalizedUserName: string;
    passwordHash: any;
    securityStamp: any;
    phoneNumber: string;
    concurrencyStamp: string;
    twoFactorEnabled: boolean;
    phoneNumberConfirmed: boolean;
    lockoutEnd: any;
    lockoutEnabled: boolean;
    accessFailedCount: number;
}

export interface IUserProfile {
    id: string;
    identityId: string;
    organizationId: string;
    userName: string;
    email: string;
    phoneNumber: string;
    avatarId: string;
    avatarUrl: string;
    fullName: string;
    birthDate: any;
    gender: number;
    idCardNo: string;
    idCardIssuedPlace: string;
    idCardIssuedDate: number;
    socialInsuranceCode: string;
    employmentDate: number;
    terminationtDate: number;
    userType?: number;
    introduction: IMultiLanguageContent;
    userExpertisedList?: IExpertised[];
    location?: string;

    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IOrganization {
    currency: string;
    location: string;
    tenantCode: string;
    organizationCode: string;
    type: number;
    name: IMultiLanguageContent;
    description: IMultiLanguageContent;
    gene: string;
    logoId?: string;
    logoUrl?: string;
    searchText: string;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IOrganizationUserProfile {
    userId: string;
    organizationId: string;
    userType: number;
    userCode: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | number;
    gender: number;
    employmentDate: string | number;
    terminationtDate: string | number;
    idCardNo: string;
    idCardIssuedDate: string | number;
    idCardIssuedPlace: string;
    socialInsuranceCode: string;
    extraInformation: string;
    activeStatus: number;
    email: string;
    phoneNumber: string;
    passportNo: string;
    passportExpiredDate: string | number;
    passportIssuedPlace: string;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
    nationality: string;
}

export interface IOrganizationGroupRole {
    organizationId: string;
    groupId: string;
    roleType: number;
}
export interface IGroupUser {
    groupId: string;
    groupType: number;
    organizationId: string;
    groupGene?: string;
    groupName?: IMultiLanguageContent;
    groupDescription?: IMultiLanguageContent;
    organizationName?: IMultiLanguageContent;
    userId: string;
    userTitle: string;
    startTime: string;
    endTime: string;
    manager: number;
    default: number;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
    
}

export interface IExpertised {
    userId?: string;
    id?: string;
    type?: number;
    tagId?: string;
    yearOfExperience?: number;
    description?: IMultiLanguageContent;
}

export interface IUserAuthorization {
    menus?: string[];
    menuDetails?: IRecordMenuDetail[];
    roleResourcePermissions?: IRoleResourcePermission[];
    userAuthorizationResponse?: IUserAuthorizationResponse[];
}

export interface IRoleResourcePermission {
    resourceId: string;
    serviceCode: string;
    resourceURI: string;
    roleCode: string;
    resourceCode: string;
    permission: number;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IUserAuthorizationResponse {
    roleType: number;
    roleLevel: number;
    roleName: string;
    description: string;
    userId: string;
    tenantCode: string;
    serviceCode: string;
    groupId: string;
    roleCode: string;
    title: IMultiLanguageContent;
    startTime: string;
    endTime: string;
    activeStatus: number;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface ISiteConfig {
    title: IMultiLanguageContent;
    description: IMultiLanguageContent;
    logoUrl: string;
    faviconUrl: string;
    bannerUrl: string;
    metaData: IMetaData;
    style: IStyle;
}
export interface IMetaData {
    "og:title": string;
    "og:type": string;
    "og:url": string;
    "og:description": string;
}

export interface IStyle {
    fontFamily: string;
    header: IColor;
    body: IColor;
    footer: IColor;
    link: IColor;
    heading: IColor;
    subtitle: IColor;
    button: IColor;
}

export interface IColorPalette {
    primary: string;
    secondary: string;
    accent: string;
}

export interface IColor {
    background?: string;
    color: string;
    focus?: string;
}

// Asset
export interface IAssetInfo {
    id: string;
    tenantCode?: string;
    serviceCode?: string;
    organizationId?: string;
    storageType?: number;
    provider?: string;
    location?: string;
    bucket?: string;
    uploadURI?: string;
    fileType?: string;
    fileName?: string;
    metaData?: string;
    accessUrl?: string;
    accessMode: number;
    external: number;
    published: number;
    encrypted: number;
    processingStatus: number;
    originalFile: string;
    createTime?: string;
    createUser?: string;
    updateTime?: string;
    updateUser?: string;
}

export interface ICreateUrlAssetRequest {
    serviceCode?: string;
    tenantCode?: string;
    organizationId?: string;
    url: string[];
}

export interface IAppSetting {
    type: number;
    tenantCode: string;
    serviceCode: string;
    organizationId: string;
    clientId: string;
    name: IMultiLanguageContent;
    description: IMultiLanguageContent;
    appUri: string;
    setting: string;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IItemRoute {
    gene: string;
    title: string;
    isVisible?: boolean;

    iconName?: string;
    icon?: JSX.Element;
    hidenIcon?: boolean;

    screenPath?: string;
    subMenu?: IItemRoute[];
    target?: "_self" | "_blank" | "_parent" | "_top";
}

export interface ISwiperListProps {
    itemPath: string;
    data?: any[] | null;
    isStudentCourse?: boolean;
    isInstructorCourse?: boolean;
    itemWrapperComponent: React.FC<any>;
    mode?: "public" | "enrolled" | "enrollable" | "manage";
}

export interface IOccupancy {
    adultSlot: number;
    userIds?: string[];
    childrenOld: number[];
}

export interface ISearch {
    id: string;
    serviceCode: string;
    tenantCode: string;
    organizationId: string;
    partnerName: string;
    partnerCode: string;
    avatarUrl: string;
    avatarId: string;
    partnerType: number;
    individual: number;
    referralCode: string;
    referenceId: string;
    externalId: string;
    address_AddressLine: string;
    address_AddressLine2: string;
    address_WardName: string;
    address_DistrictName: string;
    address_CityName: string;
    address_ProvinceName: string;
    address_CountryCode: string;
    address_PostalCode: string;
    address_Longitude: number;
    address_Lattitude: number;
    attributeValues: string[];
}

export interface IDetailHotel {
    propertyId: string;
    name: string;
    address: IAddress;
    phone: string;
    faxNumber: any;
    taxNumber: any;
    photos: IPhoto[];
    attributes: IAttribute[];
    rooms: IRoom[];
}

export interface IAddress {
    addressLine: string;
    addressLine2: any;
    cityName: string;
    provinceName: string;
    countryName: any;
    countryCode: string;
    postalCode: string;
    longtitude: number;
    latitude: number;
}

export interface IPhoto {
    photoUrl: string;
    photoId: string;
    displayOrder: number;
    pixels: string;
    tag: string;
}

export interface IAttribute {
    sourceType: number;
    valueType: number;
    attributeCode: string;
    attributeName: IMultiLanguageContent;
    attributeValue: string;
    referenceId?: string;
    tags?: string[];
}

export interface IRoom {
    referenceId: string;
    name: string;
    attributes: IAttribute[];
    photos: IPhoto[];
    rates: IRate[];

    //custom
    selectedRate: string;
    quantity: number;
}

export interface IRate {
    name: string;
    bedId: string;
    referenceId: string;
    refunable: boolean;
    available: number;
    cancelPenalties: ICancelPenalty[];
    nonRefunableRanges: any[];
    prices: IPrice[];
}

export interface ICancelPenalty {
    startTime: string;
    endTime: string;
    nights: string;
    currency: string;
    percent: any;
    amount: any;
}

export interface IPrice {
    occupancy: string;
    totals: ITotals;
}

export interface ITotals {
    inclusive: ITotalPrice; //- provides the total price including taxes and fees. This does not include property collected fees such as resort, mandatory taxes, and mandatory fees.
    exclusive: ITotalPrice; //- provides the total price excluding taxes and fees.
    propertyInclusive: ITotalPrice; // - provides the total price including taxes, fees, and property collected fees such as resort, mandatory taxes, and mandatory fees.
    inclusiveStrikethrough: ITotalPrice; // - provides the tax inclusive total price with any property funded discounts added back. Can be used to merchandise the savings due to a discount.
    strikethrough: ITotalPrice; // - provides the tax exclusive total price with any property funded discounts added back. Can be used to merchandise the savings due to a discount.

    propertyInclusiveStrikethrough: ITotalPrice; // - provides the tax, fees, and property collected fees inclusive total price with any property funded discounts added back. Can be used to merchandise the savings due to a discount.
    marketingFee: ITotalPrice; // - provides the potential owed earnings per transaction.
    grossProfit: ITotalPrice; // - provides the estimated gross profit per transaction.
    minimumSellingPrice: ITotalPrice; // - provides the minimum selling price.
    propertyFees: ITotalPrice; // - provides the total of the fees collected by the property.
}

export interface ITotalPrice {
    requestCurrency: ICurrencyValue;
    billingCurrency: ICurrencyValue;
}

export interface ICurrencyValue {
    value: number;
    currency: string;
}

export interface IOptionalAttributes {
    wifi: boolean;
    parking: boolean;
    reserve: boolean;
}

export interface IInfoRoomGuest {
    firstName: string;
    lastName: string;
}

export interface IRequestCreateBooking {
    serviceCode: string;
    organizationId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    countryPhoneNumber: string;
    email: string;
    startTime: number;
    endTime: number;
    location: string;
    currency: string;
    bookingDetailRequests: IBookingDetailRequest[];
    supplierCode: string;
    propertyId: string;
}

export interface IBookingDetailRequest {
    type: number;
    // room
    roomId?: string;
    bedGroupId?: string;
    itemId?: string;

    quantity: number;
    occupancy: IOccupancy[];
    bookingInfoRequest: IBookingInfoRequest[];

    // flight
    bookingClass?: string;
    bookingNo?: string;
    extraInfo?: string;
    unitPrice?: number;
    amount?: number;
}

export interface IBookingInfoRequest {
    firstName: string;
    lastName: string;
}

export interface IResponseCreateBooking {
    sellerName: string;
    sellerPhoneNumber: string;
    sellerEmail: string;
    buyerName: string;
    supplierName: string;
    brandName: string;
    brandAddress: string;
    manufacturerName: string;
    createUserName: string;
    location: string;
    organization: string;
    bookingDetails: IBookingDetail[];
    type: number;
    bookingCode: string;
    tenantCode: string;
    serviceCode: string;
    organizationId: string;
    buyer: string;
    seller: string;
    name: string;
    phoneNumber: string;
    email: string;
    startTime: string;
    endTime: string;
    totalAmount: number;
    quoteAmount: number;
    bookingQuantity: number;
    currency: string;
    adultSlot: number;
    childrenSlot: number;
    childrenSlotDetail: any;
    note: string;
    confirmStatus: number;
    orderId: string;
    referenceCode: string;
    supplierId: string;
    supplierCode: string;
    brandId: string;
    manufacturerId: string;
    extraInfo: string;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IBookingDetail {
    itemName: any;
    itemSku: any;
    itemStatus: number;
    itemAttributes: any[];
    itemPhotos: any;
    itineraryType?: number;
    bookingId: string;
    itemId: string;
    description: any;
    unitPrice: number;
    unitCost: number;
    quantity: number;
    amount: number;
    extraInfo: string;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IDetailBooking {
    sellerName: any;
    sellerPhoneNumber: any;
    sellerEmail: any;
    buyerName: any;
    supplierName: any;
    brandName: any;
    brandAddress: any;
    manufacturerName: string;
    createUserName: string;
    location: any;
    organization: IOrganization;
    bookingDetails: IBookingDetail[];
    type: number;
    bookingCode: string;
    tenantCode: string;
    serviceCode: string;
    organizationId: string;
    buyer: string;
    seller: string;
    name: string;
    phoneNumber: string;
    email: string;
    startTime: string;
    endTime: string;
    totalAmount: number;
    quoteAmount: number;
    bookingQuantity: number;
    currency: string;
    adultSlot: number;
    childrenSlot: number;
    childrenSlotDetail: any;
    description: any;
    confirmStatus: number;
    orderId: any;
    referenceCode: any;
    supplierId: any;
    supplierCode: string;
    brandId: any;
    manufacturerId: string;
    extraInfo: any;
    members: string[];
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export type IUser = {
    groupDefaulId: ReactI18NextChildren;
    roleId: string;
    groupId: string;
    userName: string;
    fullName: any;
    email: string;
    phoneNumber: any;
    avatarUrl: any;
    avatarId: any;
    organizationUserProfile: IOrganizationUserProfile;
    organizationProfiles: any;
    groups: any;
    groupUsers: string
    userRoles: IUserRole[];
    invitation: any;
    id: string;
    status: number;
    createTime: string;
    createUser: any;
    updateTime: any;
    updateUser: any;
    groupName:string;
    roleName:string;
};

export interface IUserRole {
    detail: any;
    code: string;
    tenantName: any;
    serviceName: any;
    organizationId: any;
    roleId: string;
    roleName: string;
    roleType: number;
    roleLevel: number;
    userId: string;
    tenantCode: any;
    serviceCode: string;
    groupId: string;
    roleCode: string;
    title: any;
    startTime: string;
    endTime: string;
    activeStatus: number;
    id: string;
    status: number;
    createTime: any;
    createUser: any;
    updateTime: any;
    updateUser: any;
}

export interface IFilter {
    name: string;
    key?: string;
    checked: boolean;
    description?: string;
    Icon?: OverridableComponent<SvgIconTypeMap>;
}

export interface IPriceRange {
    min: number;
    max: number;
}

export interface IPassengerQuantity {
    adt: number;
    chd: number;
    inf: number;
}

export interface IFlight {
    searchKey: string;
    flightId: string;
    // flightIdsList: string[];
    flightSelectedList: IFlightSelectedList[];
    passengerQuantity: IPassengerQuantity;
    itineraryType: string;
}

export interface IFreeBaggage {
    name: string;
    code: string;
    isHandBaggage: boolean;
    quantity: number;
    paxType: number;
}

export interface IFlightSelectedList {
    itineraryKey: string;
    stopNumber: number;
    departPlace: string;
    departDT: string;
    departDate: number;
    arrivalPlace: string;
    arrivalDT: string;
    arrivalDate: number;
    carrierMarketing: string;
    carrierOperator: string;
    flightNumber: string;
    currency: string;
    isFirstFlight: boolean;
    flightDuration: number;
    segmentsList: ISegmentsList[];
    classesList: IClassesList[];
    bookingClass: string;
    departPlaceObj: IPlaceObj;
    arrivalPlaceObj: IPlaceObj;
    carrierMarketingObj: IMultiLanguageContentByDeepTech;
    carrierOperatorObj: IMultiLanguageContentByDeepTech;
    feeObj: IFeeObj;
    cabinClass: string;
    freeBaggage: IFreeBaggage[];
}

export interface ISegmentsList {
    index: number;
    departPlace: string;
    departDate: number;
    arrivalPlace: string;
    arrivalDate: number;
    carrierMarketing: string;
    carrierOperator: string;
    flightNumber: string;
    aircraft: string;
    flightDuration: number;
    departTerminal: string;
    arrivalTerminal: string;

    departDT: string;
    arrivalDT: string;
    departPlaceObj: IPlaceObj;
    arrivalPlaceObj: IPlaceObj;
    carrierMarketingObj: IMultiLanguageContentByDeepTech;
    carrierOperatorObj: IMultiLanguageContentByDeepTech;
}

export interface IClassesList {
    flightId: string;
    itineraryId: string;
    availability: number;
    cabinClass: string;
    bookingClass: string;
    fareBasis: string;
    totalFareAmount: number;
    totalFareBasic: number;
    totalTaxAmount: number;
    vat: number;
    nextItineraryKeyList: string[];
    displayPrice: number;
    displayProfit: number;
    flightsList: IFlightsList[];
}

export interface IFlightsList {
    flightId: string;
    prevItineraryClass: string;
    itineraryClass: string;
    totalFareAmount: number;
    totalFareBasic: number;
    totalTaxAmount: number;
    totalPaxFareAdt: ITotalPaxFareAdt;
    vat: number;
    displayPrice: number;
    displayProfit: number;
    itineraryIndex: number;
}

export interface ITotalPaxFareAdt {
    paxType: number;
    fareAmount: number;
    fareBasic: number;
    taxAmount: number;
    currency: string;
    serviceFee: number;
    displayPrice: number;
    displayProfit: number;
}

export interface IPlaceObj {
    id: string;
    country: string;
    countryCode: string;
    city: string;
    cityCode: string;
    code: string;
    name: string;
    lat: number;
    lon: number;
    timezone: string;
}

export interface IMultiLanguageContentByDeepTech {
    code: string;
    name: {
        vi: string;
        en: string;
    };
    group: string;
    logoUrl: string;
}

export interface IFeeObj {
    totalFareAmount: number;
    totalFareBasic: number;
    totalTaxAmount: number;
    totalPaxFareAdt: ITotalPaxFareAdt2;
    vat: number;
    displayPrice: number;
    displayProfit: number;
}

export interface ITotalPaxFareAdt2 {
    paxType: number;
    fareAmount: number;
    fareBasic: number;
    taxAmount: number;
    currency: string;
    serviceFee: number;
    displayPrice: number;
    displayProfit: number;
}

export interface IItinerary {
    itineraryDetails: IItineraryDetail[] | null;
    itineraryMembers: IItineraryMember[];
    tenantCode: string;
    serviceCode: string;
    organizationId: string;
    code: any;
    name: string;
    description: any;
    searchText: string;
    amountBooking: number;
    taxBooking: number;
    serviceFee: number;
    confirmStatus: number;
    policyCompliance: number;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IItineraryMember {
    userProfile?: ItineraryMemberProfile;
    itineraryId: string;
    detailId: string;
    userId: string;
    fullname: any;
    flowId: string;
    confirmStatus: number;
    policyCompliance: number;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface ItineraryMemberProfile {
    email: string;
    fullName?: string;
    avatarId?: string;
    avatarUrl?: string;
    identityId: string;
    phoneNumber?: string;
    location?: string;
}

export interface IItineraryDetail {
    comfirmStatusBooking: number;
    bookingId: any;
    confirmStatus: ConfirmStatus;
    confirmStatusBooking: ConfirmStatusBooking;
    paymentStatus: PaymentStatus;
    bookingDetailId: any;
    userIds: any;
    orderId: string | undefined;
    needApprove: RequestType;

    itineraryId: string;
    type: ItineraryType;
    itemId: string;
    note: any;
    startTime: string;
    endTime: string;
    amountBooking: number;
    taxBooking: number;
    serviceFee: number;
    estimateQuantity: number;
    estimateAmount: number;
    policyCompliance: number;
    sequence: number;
    bookingNo: any;
    bookingClass: any;
    extraInfo: string;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;

    itineraryMembers: IItineraryMember[];
    detailExtraInfos?: {
        bookingDetailId?: string;
        itineraryDetailId?: string;
        extraInfo?: string; // IFlightItineraryDetailBookingDetailExtraInfo;
        bookingCode?: string;
    }[];

    //custom
    hiddenHeader?: boolean;
}
// Begin flight booking detail extraInfo
export interface IFlightItineraryDetailBookingDetailExtraInfo {
    IndexCompareData: number
    Leg: number
    SessionId: any
    ConfirmedPrice: number
    BookingCode: any
    SearchKey: string
    SupplierCode: string
    Occupancy: IOccupancy[]
    FlightId: string
    CarrierOperator: string
    CarrierOperatorName: any
    CarrierMarketingObj: FlightCarrierMarketingObj;
    CarrierOperatorObj: FlightCarrierOperatorObj
    FlightNumber: string
    CabinClass: string
    BookingClass: string
    FlightDuration: number
    DepartDate: number
    DepartPlace: string
    DepartPlaceName: any
    ArrivalPlace: string
    ArrivalPlaceName: any
    ArrivalDate: number
    DepartPlaceObj: DepartPlaceObj
    ArrivalPlaceObj: ArrivalPlaceObj
    FlightType: number
    TotalFareAmount: number
    TotalFareBasic: number
    TotalTaxAmount: number
    Currency: string
    ArrivalDT: string
    DepartDT: string
    Amount: number
    IssueTicketInfo: string; // IssueTicketInfo;
    LastTicketDate: string
    SegmentsList: SegmentsList[]
    ResultBookingErr: any
    IsInternational: boolean
    FreeBaggage: FreeBaggage[]
}
interface FlightCarrierMarketingObj {
    Code: string
    LogoUrl: string
    Name: IMultiLanguageContent;
}
type FlightCarrierOperatorObj = FlightCarrierMarketingObj;
interface DepartPlaceObj {
    Id: string
    Country: string
    CountryCode: string
    City: string
    CityCode: string
    Code: string
    Name: string
    Timezone: string
}
type ArrivalPlaceObj = DepartPlaceObj;
export interface IssueTicketInfo {
    is_success: boolean
    error_code: any
    Booking: any;
}


interface Itinerary {
    reservation_code: string
}

export interface SegmentsList {
    Index: number
    departPlace: any
    depart_place: any
    DepartPlaceName: any
    departDate: any
    arrival_place: any
    arrivalPlace: any
    ArrivalPlaceName: any
    arrival_date: any
    arrivalDate: any
    DepartPlaceObj: DepartPlaceObj
    ArrivalPlaceObj: ArrivalPlaceObj
    carrier_operator: any
    carrierOperator: any
    carrier_operator_name: any
    carrierOperatorName: any
    CarrierMarketingObj: FlightCarrierMarketingObj
    CarrierOperatorObj: FlightCarrierOperatorObj
    flight_number: any
    aircraft: string
    flight_duration: number
    depart_terminal: any
    arrival_terminal: any
    DepartDT: string
    ArrivalDT: string
}
export interface FreeBaggage {
    Name: string
    Code: any
    IsHandBaggage: boolean
    Quantity: number
    PaxType: number
}
// End flight booking detail extraInfo

export interface IHotelExtraInformation {
    currency: string;
    occupancy: IOccupancy[];
    propertyId: string;
    roomId: string;
    itemId: string;
    bedGroupId: string;
    roomName: any;
    infoRoomGuest: any;
    adultQuantity: number;
    childQuantity: number;
    tax: number;
    amount: number;
    bedType: any;
    links: any;
}

export type IFlightDetail = {
    searchKey: string;
    flightId: string;
    carrierOperator: string;
    flightNumber: string;
    cabinClass: string;
    bookingClass: string;
    flightDuration: number;
    departDate: number;
    departDT?: string;
    departPlace: string;
    arrivalPlace: string;
    arrivalDT?: string;
    arrivalDate: number;
    departPlaceObj: IPlaceObj;
    arrivalPlaceObj: IPlaceObj;
    carrierMarketingObj: IMultiLanguageContentByDeepTech;
    carrierOperatorObj: IMultiLanguageContentByDeepTech;
    flightType: FlightType | null;
    totalFareAmount: number;
    totalFareBasic: number;
    totalTaxAmount: number;
    currency: string;
    passengerQuantity: IPassengerQuantity;
    segmentsList: ISegmentsList[];
    freeBaggage: IFreeBaggage[];
};

export type IFlightExtraInformation = IFlightDetail & {
    supplierCode: string;
    occupancy: IOccupancy[];
    isInternational: boolean;
};

export interface IPriceWithCurrency {
    value: number;
    currency: string;
}

export interface IResponseConfirmDetailItinerary {
    isSuccess: true;
    value: string;
    mesCode: string;
    userIdErr: any;
    itineraryDetailIds: string[];
}
export interface IResponseConfirmDetailItineraryError {
    isSuccess: false;
    statusCode?: number;
    mesCode?: string;
    userIdErr?: string[];
    result: {
        itineraryDetailIds?: string[];
        needApprove?: number;
        bookingFlightResponse?: {
            session_id?: string;
            booking?: any;
            new_fare_amount_info?: any;
            is_success: boolean;
            statusCode?: number;
            error_code?: string;
            error_msg?: string;
        };
    }[];
    // statusCode: number;
    // isSuccess: false;
    // mesCode: string;
    // userIdErr: any;
    // itineraryDetailIds: string[];
}

export interface IOrder {
    type: number;
    tenantCode: string;
    serviceCode: string;
    organizationId: string;
    groupId: any;
    seller: string;
    buyer: string;
    shippingMethod: number;
    shippingAddress: any;
    paymentMethod: number;
    billingAddress: any;
    orderCode: string;
    orderDate: string;
    discount: number;
    amount: number;
    tax: number;
    currency: string;
    location: any;
    note: any;
    paymentStatus: number;
    orderStatus: number;
    referenceId: any;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface ICountry {
    parentName: any;
    type: number;
    code: string;
    name: string;
    parentDivision: any;
    gene: string;
    timeZone: string;
    currency: string;
    id: string;
    status: number;
    createTime: string;
    createUser: any;
    updateTime: string;
    updateUser: string;
}