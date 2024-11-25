import { all } from "redux-saga/effects";
import watchFetchUserInfo from "./userInfo.saga";

export default function* rootSaga() {
    yield all([watchFetchUserInfo()])
}