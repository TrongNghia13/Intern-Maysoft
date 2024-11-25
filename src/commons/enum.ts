export enum FileAccessMode {
    Public = 0,
    Authenticated = 1,
    Internal = 2,
    Private = 4,
}

export enum FileProcessingStatus {
    Unprocessed = 0,
    Processing = 1,
    Processed = 2,
}

export enum IsTrue {
    False = 0,
    True = 1,
}

export enum Mode {
    Create = 0,
    Update = 1,
    View = 2,
}

export enum AdministrativeDivisionType {
    Country = 1,
    Province = 2,
    DistrictCity = 3,
    Ward = 4,
}
//

export enum RoleType {
    ServiceAdmin = 0,
    Default = 128,
    OrganizationOwner = 252,
    OrganizationAdmin = 253,
    GroupAdmin = 254,
    Member = 255,
    Custom = 300,
    Membership = 400,
}

export enum RoleLevel {
    SuperAdmin = 0,
    ServiceAdmin = 1,
    Default = 100,
    Owner = 101,
    Admin = 500,
    GroupAdmin = 1000,
    Member = 1500,
    Custom = 2000,
    Membership = 5000,
}

export enum RoleCode {
    STUDENT = "000009",
    TUTOR = "00000A",
    ADMIN = "00000B",
}

export enum GroupUserDefault {
    None = 1,
    Default = 2,
}

export enum GroupType {
    Company = 0,
    Department = 1,
    BranchStore = 2,
    Other = 128,
}

// BOOKING_POLICY

export enum PolicyCriteriaCode {
    Domestic = "000001",
    International = "000002",
    BookingTime = "000003",
    FlightClass = "000004",
    CabinClass = "000005",
    StarClass = "000006",
    FlightTime = "000007",
}

export enum CabinClass {
    EconomyClass = "ECONOMY_CLASS",
    PremiumEconomyClass = "PREMIUM_ECONOMY_CLASS",
    BusinessClass = "BUSINESS_CLASS",
    FirstClass = "FIRST_CLASS",
}

export enum BookingTypePolicy {
    OneWay = 1,
    RoundTrip = 2,
    MultiCity = 4,
}

export enum CompareType {
    Equal,
    NotEqual,
    LessThan,
    GreaterThan,
    LessThanEqual,
    GreaterThanEqual,
}

export enum CabinClassType {
    EconomyClass = 1,
    PremiumEconomyClass = 2,
    BusinessClass = 3,
    FirstClass = 4,
}

export enum AttributeReferenceId {
    wifi = "amenities_property_2390",
    air_conditioning = "amenities_rooms_1",
    laundry_facilities = "amenities_property_369",
    self_parking = "amenities_property_3862",
    outdoor_pools = "amenities_property_2821",

    free_parking = "amenities_property_3861",
    parking = "amenities_property_3863",
    buffet = "amenities_property_4647",
}

export enum AttributeCodes {
    "partner_booking_category" = "partner_booking_category",
    "partner_booking_rank" = "partner_booking_rank",
    "partner_booking_business_model_expedia_collect" = "partner_booking_business_model_expedia_collect", // Thanh toán ngay lúc đặt hàng
    "partner_booking_business_model_property_collect" = "partner_booking_business_model_property_collect", // Thanh toán tại khách sạn
    "partner_booking_ratings_property_rating" = "partner_booking_ratings_property_rating", // Đánh giá (sao),
    "partner_booking_checkin_begin_time" = "partner_booking_checkin_begin_time", // Thời gian bắt đầu
    "partner_booking_checkin_end_time" = "partner_booking_checkin_end_time", // Thời gian kêt thúc checkin
    "partner_booking_checkin_instructions" = "partner_booking_checkin_instructions", // Hướng dẫn nhận phòng
    "partner_booking_checkin_special_instructions" = "partner_booking_checkin_special_instructions", //Hướng dẫn đặc biệt khi nhận phòng
    "partner_booking_checkin_min_age" = "partner_booking_checkin_min_age", // Độ tuổi tối thiểu để nhận phòng
    "partner_booking_checkout_time" = "partner_booking_checkout_time", // Thời gian trả phòng
    "partner_booking_fee_mandatory" = "partner_booking_fee_mandatory", // Phí bắt buộc
    "partner_booking_fee_optional" = "partner_booking_fee_optional", // Phí tùy chọn
    "partner_booking_policies_know_before_go" = "partner_booking_policies_know_before_go", // Điều bạn cần biết trước khi đặt phòng (policy)
    "partner_booking_attribute_pets" = "partner_booking_attribute_pets", // Các quy định về thú cưng
    "partner_booking_attribute_general" = "partner_booking_attribute_general", // Quy định chung
    "partner_booking_amenities_property" = "partner_booking_amenities_property", // Tiện nghi chung
    "partner_booking_onsite_payment_currency" = "partner_booking_onsite_payment_currency", // Đơn vị tiền tệ thanh toán
    "partner_booking_onsite_payment_type" = "partner_booking_onsite_payment_type", // Phương thức thanh toán trực tiếp
    "partner_booking_description_dining" = "partner_booking_description_dining", // Mô tả phòng ăn,
    "partner_booking_description_room" = "partner_booking_description_room", // Mô tả tiện ích phòng ở,
    "partner_booking_description_attraction" = "partner_booking_description_attraction", // Các điểm than quan lân cận
    "partner_booking_description_location" = "partner_booking_description_location", // Vị trí
    "partner_booking_description_amenity" = "partner_booking_description_amenity", // Tiện ích chung
    "partner_booking_description_renovation" = "partner_booking_description_renovation", // Cải tạo gần đây
    "partner_booking_description_national_rating" = "partner_booking_description_national_rating", // Xếp hạng quốc gia
    "partner_booking_description_business_amenities" = "partner_booking_description_business_amenities", // Tiện tích dành riêng
    "partner_booking_description_headline" = "partner_booking_description_headline", // Mô tả tóm tắt
    "partner_booking_description_general" = "partner_booking_description_general", // Mô tả chung
    "partner_booking_statistics" = "partner_booking_statistics", // Thống kê
    "partner_booking_iata_airport_code" = "partner_booking_iata_airport_code", // Nã IATA của sân bay
    "partner_booking_partner_booking_themes" = "partner_booking_partner_booking_themes", // Chủ đề
    "partner_booking_all_inclusive_all_rate_plans" = "partner_booking_all_inclusive_all_rate_plans", // Tất cả loại giá đều cung cấp dịch vụ trọn gói
    "partner_booking_all_inclusive_some_rate_plans" = "partner_booking_all_inclusive_some_rate_plans", // Một số loại giá có cung cấp dịch vụ trọn gói
    "partner_booking_all_inclusive_details" = "partner_booking_all_inclusive_details", // Thông tin chi tiết về tiện nghi và dịch vụ trong giá trọn gói
    "partner_booking_spoken_languages" = "partner_booking_spoken_languages", // Ngôn ngữ
    "partner_booking_partner_booking_multi_unit" = "partner_booking_partner_booking_multi_unit", // Nhiều chi nhánh (khác chủ),

    "product_booking_description_overview" = "product_booking_description_overview", // Mô tả tổng quan
    "product_booking_amenities_rooms" = "product_booking_amenities_rooms", // Tiện ích phòng
    "product_booking_bed_groups" = "product_booking_bed_groups", // Loại giường
    "product_booking_occupancy_max_allowed_total" = "product_booking_occupancy_max_allowed_total", // Số người tối đa
    "product_booking_occupancy_max_allowed_children" = "product_booking_occupancy_max_allowed_children", // Tối đa số trẻ em
    "product_booking_occupancy_max_allowed_adults" = "product_booking_occupancy_max_allowed_adults", // Tối đa số người lớn
    "product_booking_occupancy_age_categories_Adult" = "product_booking_occupancy_age_categories_Adult", // Tuổi người lớn
    "product_booking_occupancy_age_categories_ChildAgeA" = "product_booking_occupancy_age_categories_ChildAgeA", // Tuổi trẻ em
    "product_booking_occupancy_age_categories_Infant" = "product_booking_occupancy_age_categories_Infant", // Tuổi trẻ sơ sinh
    "product_booking_area_square_meters" = "product_booking_area_square_meters", // Diện tích phòng tính theo mét vuông
    "product_booking_area_square_feet" = "product_booking_area_square_feet", //Diện tích phòng tính theo thước vuông
    "product_booking_room_views" = "product_booking_room_views", // Hướng phòng

    "partner_booking_ratings_guess_count" = "partner_booking_ratings_guess_count", // số lượng khách đánh giá
    "partner_booking_ratings_guess_overall" = "partner_booking_ratings_guess_overall", // Đánh giá tổng quan
    "partner_booking_ratings_guess_cleanliness" = "partner_booking_ratings_guess_cleanliness", // Đánh giá mức độ sạch sẽ
    "partner_booking_ratings_guess_service" = "partner_booking_ratings_guess_service", // Đánh giá chất lượng dịch vụ
    "partner_booking_ratings_guess_comfort" = "partner_booking_ratings_guess_comfort", // Đánh giá mức độ thoải mái
    "partner_booking_ratings_guess_condition" = "partner_booking_ratings_guess_condition", // Đánh giá cơ sở vật chất
    "partner_booking_ratings_guess_location" = "partner_booking_ratings_guess_location", // Đánh giá vị trí
    "partner_booking_ratings_guess_neighborhood" = "partner_booking_ratings_guess_neighborhood", // Đánh giá khu vực
    "partner_booking_ratings_guess_amenities" = "partner_booking_ratings_guess_amenities", // Đánh giá tiện nghi
    "partner_booking_ratings_guess_recommendation" = "partner_booking_ratings_guess_recommendation", // Tỷ lệ gợi ý
}

export enum PublishedStatus {
    Draft = 0,
    Processing = 1,
    Published = 2,
}

export enum ItineraryType {
    Flight = 1,
    Hotel = 2,
    Car = 4,
    Train = 8,
    InTrip = 16,
    Other = 256,
}

export enum TimerangeBudget {
    Monthly = 1,
    Quarterly = 2,
    Yearly = 4,
    CustomRange = 8,
}

export enum NotifyTarget {
    Owner = 1,
    GroupAdmin = 2,
    Custom = 4,
}

export enum TargetType {
    User = 1,
    Group = 2,
    Role = 4,
}

export enum Status {
    Deleted = -9,
    Blocked = -2,
    Cancel = -3,
    Reject = -4,
    Draft = -1,
    Inactive = 0,
    Active = 1,
}

export enum PaymentAccountType {
    Personal = 0,
    Organization = 1,
    Group = 2,
    Debit = 3,
}

export enum SupplierCode {
    Nolmal = "000000",
    Expedia = "000001",
    Deeptech = "000002",
}

export enum EItineraryType {
    NULL = "",
    ONE_WAY = "OneWay",
    ROUND_TRIP = "RoundTrip",
    MULTIPLE_TRIP = "MultipleTrip",
}

export enum BookingStatus {
    NULL = "",
    ONE_WAY = "OneWay",
    ROUND_TRIP = "RoundTrip",
    MULTIPLE_TRIP = "MultipleTrip",
}

export enum Timeline {
    Approval = -1,
    Now,
    Past,
    Future,
}

export enum ConfirmStatus {
    Rejected = -3,
    Cancel = -2,
    Pending = -1,
    Processing = 0,
    Confirmed = 1,
    Completed = 9,
}

export enum TypeSearchForm {
    Flight = 1,
    Stays = 2,
    Trains = 3,
    Cars = 4,
}

export enum OrderStatus {
    Cancel = -2,
    Pending = -1,
    New = 0,
    Confirm = 1,
    Editing = 2,
    PaymentConfirm = 3,
    PaymentFailed = 4,
    Completed = 10
}

export enum SearchHotelComponentMode {
    Normal,
    Corporate,
}

export enum ActionSubmit {
    Create = 0,
    Update = 1,
    Delete = 2,
    Cancel = 3,
    Approve = 4,
    Reject = 5,
    ReSelect = 6,
}

export enum RequestStatus {
    Submit = 2,
    Approve = 4,
    Reject = 8,
    Cancel = 16,
    Complete = 32,
} // checkRequest.dataStatus
export enum RequestType {
    None = 0,
    NeedApprove = 1,
} // checkRequest.result
export enum WorkflowCriteriaDetailType {
    User = 1,
    Group = 2,
    Role = 4,
    Attribute = 8,
}
export enum WorkflowActionType {
    View = 0,
    Create = 1,
    Update = 2,
    Submit = 4,
    Approve = 8,
    Reject = 16,
    Cancel = 32,
}
export enum WorkFlowCriteriaCompareType {
    LessThan = 1,
    Equal = 2,
    GreaterThan = 3,
}

export enum PaymentStatus {
    Cancel = -2,
    Pending = -1,
    New = 0,
    WaitingConfirm = 1,
    Processing = 2,
    RefundProcessing = 3,
    RefundFailed = 4,
    PartialRefundFailed = 5,
    Completed = 10,
    Failed = 11,
    Issued = 12,
    WaitingRefund = 13,
    PartialRefunded = 14,
    Refunded = 15,
}

export enum TripTabs {
    Approval = "approval",
    Draft = "draft",
    Now = "now",
    Future = "future",
    Past = "past",
    Rejected = "rejected",
}

export enum Gender {
    Male = 1,
    Female = 2,
    Other = 3,
}

export enum PolicyCompliance {
    No = 0,
    Compliance = 1,
}

export enum OrganizationType {
    Normal = 0,
    Main = 1,
}

export enum AcceptChange {
    None = 0,
    Accept = 1,
}

export enum FlightType {
    OneWay = 1,
    RoundTrip = 2,
    MultiCity = 4,
}

export enum ConfirmStatusBooking {
    Rejected = -3, // Chưa có sài luôn tương lại sài ở flow khách sạn khi cần chủ đại lý xác nhận
    Canceled = -2, // Hủy
    Pending = -1, // Mới tạo nháp lúc chọn và vào detail chuyến
    Processing = 0, // Chưa có sài
    Confirmed = 1, // Booking rồi
    Completed = 9, // Xuất vé rồi
}


export enum OrderPricingType {
    Normal = 0,
    External = 1
}

export enum PaymentType {
    Cash = 0, // Tiền mặt
    Banking = 1, // Chuyển khoảng
    Paypal = 2,
    VnPay = 3,
    Mobile = 4,
    Debt = 5, // Công nợ

    NinePayCollection = 10, // 9Pay QR
    NinePayATM = 11, // 9Pay Thẻ nội địa
    NinePayCredit = 12, // 9Pay thẻ visa nội địa
    NinePayCreditInternational = 13 // 9pay thẻ visa quốc tế
}

export enum PartnerPaymentMethod {
    None = 0,
    Debt = 1,
    Direct = 2
}
export enum ItineraryDetailFinalDisplayStatus {
    EXPIRED = "expired",

    // payable
    READY_TO_CHECKOUT = "ready_to_checkout",
    COMPLETED = "completed",
    DRAFT = "draft",

    // approval
    DRAFT_NEED_APPROVAL = "draft_need_approval",
    WAIT_FOR_APPROVAL = "wait_for_approval",
    REJECTED = "rejected",
    CANCELED = "canceled",
    CONFIRM_STATUS_CANCELED = "confirm_status_canceled",
}