import { IRoom } from "@src/commons/interfaces";

export type IInformation = {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    phoneNumber: string;
    sendEmail: boolean;
    phoneCode: string;
};

export type IErrorInformation = { [k in keyof IInformation]?: string };

export type IGuest = {
    guestName: string;
    email: string;
};

export type IRoomInfo = IRoom & IGuest;

export type ISpecialRequests = {
    request: string;
    roomsClose: boolean;
};

 