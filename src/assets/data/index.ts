import Helpers from "@src/commons/helpers";
import moment from "moment";

export const IMAGES = [
    "https://a0.muscache.com/im/pictures/6ca3ce8d-692d-4cbc-b004-7d09d6477a47.jpg?im_w=1200",
    "https://a0.muscache.com/im/pictures/8246cb1d-cb4c-4258-a7f1-fd9dc37bc621.jpg?im_w=1440",
    "https://a0.muscache.com/im/pictures/ab3480e4-613c-4e8f-8d05-dd8820a8df1f.jpg?im_w=1440",
    "https://a0.muscache.com/im/pictures/d5092300-a37e-442a-8ab8-e43313face52.jpg?im_w=1440",
    "https://a0.muscache.com/im/pictures/fc69d250-f328-464a-a504-69a486024c7f.jpg?im_w=1440",
    "https://a0.muscache.com/im/pictures/63ceb1a3-09b8-438b-ac9f-c77f00f1665b.jpg?im_w=1200",
    "https://a0.muscache.com/im/pictures/9ca8f167-c249-4d4f-9eb5-64a9c622eeb7.jpg?im_w=1200",
    "https://a0.muscache.com/im/pictures/b0a40d51-c8b6-4b6e-b113-ea55223d8403.jpg?im_w=1440",
    "https://a0.muscache.com/im/pictures/5bbc8339-b12d-49f9-8302-cefddd5fdc06.jpg?im_w=1440",
    "https://a0.muscache.com/im/pictures/88839563-7bd6-4cde-b512-fc26fd5a776f.jpg?im_w=1440",
    "https://a0.muscache.com/im/pictures/82931e7a-3aed-4edd-b5c4-c020e0934b0a.jpg?im_w=1440",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-3.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-4.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-5.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-6.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-7.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-13.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-15.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-21.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-20.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-16.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-24.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-24.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-29.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-28.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-36.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-34.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-buon-9.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-31.jpg.webp",
    "https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2023/07/anh-phong-canh-dep-30.jpg.webp",
];


export const listDefaultUserProfile = [
    {
        "id": "560226146453581824",
        "userCode": "00000B",
        "fullName": "Maybaze Demo",
        "phoneNumber": "",
        "email": "bazedemo@maysols.com"
    },
];

export const listIds = listDefaultUserProfile.map(el => el.id);

export const listTripDefault = [{
    id: "123456789",
    name: "Công tác đi Hồ Chí Minh",
    location: "Hồ Chí Minh",
    userIds: listIds,
    description: "Công tác đi Hồ Chí Minh",
    startTime: moment().unix(),
    endTime: moment().add(7, "days").unix(),
    photoUrl: undefined,
    members: listIds.length,
}];

export const listStays = [
    {
        id: "sg1",
        name: "The Reverie Saigon",
        distance: "9.9km from city center",
        price: "645.34",
        discount: "40",
        amount: "258.14",
        score: "9.4",
        reviewers: "133",
        freeCancelation: true,
        addressName: "22-36 Nguyen Hue Boulevard, Ho Chi Minh City",
        star: 5,
        description: `Conveniently located in District 1, The Reverie Saigon Hotel offers luxurious and stylish accommodation with free WiFi access in the guestrooms. It features an outdoor pool, fitness centre and sauna facility on site. The hotel is just 300 metres from Tax Trade Centre and 400 metres from Opera House. Union Square is 500 metres away, while Tan Son Nhat International Airport is accessible with an 8 km drive. Elegantly furnished, air-conditioned rooms come equipped with a wardrobe, minibar, a flat-screen TV and comfortable seating area. The en suite bathroom features a spa bathtub, shower facility, bathrobes and free toiletries. Ironing facilities are also available. At The Reverie Saigon Hotel, guests can indulge in a pampering massage at the spa or enjoy drinks served at the bar. Business centre and meeting/banquet facilities are available, while the 24-hour front desk can assist with luggage storage and airport transfers. The in-house restaurant offers a delectable spread of Asian and Western dishes. Meals can also be provided in the privacy of guests' rooms.`,

        listRooms: [
            {
                id: "room1213",
                name: "Deluxe Grand Twin Room (River or City View)",
                note: "2 Single 75-90cm wide",
                listPrice: [
                    {
                        id: "asbc",
                        price: "679.32",
                        breakfast: false,
                        freeCancelation: true,
                    },
                    {
                        id: "423asdas",
                        price: "721.76",
                        breakfast: true,
                        freeCancelation: true,
                    }
                ],
            },
            {
                id: "room23",
                name: "Standard Suite (City View) with Business Lounge Access",
                note: "1 King 150-180cm wide",
                listPrice: [
                    {
                        id: "nfgy78978",
                        price: "969.62",
                        breakfast: true,
                        freeCancelation: true,
                    },
                ],
            },
        ]
    },
    {
        id: "sg2",
        name: "La Siesta Premium Saigon",
        distance: "9.1km from city center",
        price: "529.83",
        discount: "40",
        amount: "317.90",
        score: "9.4",
        reviewers: "915",
        freeCancelation: false,
        star: 4,
        description: "",
        listRooms: [
            {
                id: "sg2room1213",
                name: "Deluxe Grand Twin Room (River or City View)",
                note: "2 Single 75-90cm wide",
                listPrice: [
                    {
                        id: "asbc",
                        price: "679.32",
                        breakfast: false,
                        freeCancelation: true,
                    },
                    {
                        id: "423asdas",
                        price: "721.76",
                        breakfast: true,
                        freeCancelation: true,
                    }
                ],
            },
            {
                id: "sg2room23",
                name: "Standard Suite (City View) with Business Lounge Access",
                note: "1 King 150-180cm wide",
                listPrice: [
                    {
                        id: "nfgy78978",
                        price: "969.62",
                        breakfast: true,
                        freeCancelation: true,
                    },
                ],
            },
        ]
    },
    {
        id: "sg3",
        name: "Holiday Inn & Suites Saigon Airport",
        distance: "3.7km from city center",
        price: "147.39",
        discount: undefined,
        amount: "147.39",
        score: "10",
        reviewers: "267",
        freeCancelation: false,
        star: 5,
    },
    {
        id: "sg4",
        name: "Mia Saigon - Luxury Boutique Hotel",
        distance: "13.4km from city center",
        price: "555.84",
        discount: "19",
        amount: "454.42",
        score: "9.6",
        reviewers: "437",
        freeCancelation: false,
        star: 5,
    },
    {
        id: "sg5",
        name: "Hotel Des Arts Saigon Mgallery Collection",
        distance: "8.7km from city center",
        price: "321.85",
        discount: undefined,
        amount: "321.85",
        score: "9.2",
        reviewers: "89",
        freeCancelation: true,
        star: 5,
    },
    {
        id: "sg4",
        name: "Mia Saigon - Luxury Boutique Hotel",
        distance: "13.4km from city center",
        price: "555.84",
        discount: "19",
        amount: "454.42",
        score: "9.6",
        reviewers: "437",
        freeCancelation: false,
        star: 4,
    },
    {
        id: "sg7",
        name: "SILA Urban Living",
        distance: "6.5km from city center",
        price: "555.84",
        discount: "20",
        amount: "454.42",
        score: "9.6",
        reviewers: "437",
        freeCancelation: false,
        star: 4,
    },

];

export const itemRowBookingDefault: any = {
    idTrip: "1",
    id: "sg7",
    name: "SILA Urban Living",
    addressName: "22-36 Nguyen Hue Boulevard, Ho Chi Minh City",
    distance: "6.5km from city center",
    price: "454.42",
    discount: undefined,
    amount: "454.42",
    score: "9.6",
    reviewers: "437",
    freeCancelation: false,
    star: 4,
    description: "",
    startTime: 0,
    endTime: 0,
    listRooms: {
        id: "sg7room1213",
        name: "Deluxe Grand Twin Room (River or City View)",
        note: "2 Single 75-90cm wide",
        listPrice: {
            id: "sg7room1213asbc",
            price: "435.32",
            quantity: 1,
            tax: 0,
            breakfast: false,
            freeCancelation: true,
        },
    },
}