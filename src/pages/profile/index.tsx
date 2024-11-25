import { useDispatch } from "react-redux";
import { ProfileContainer } from "@maysoft/common-component-react";

import { BaseLayout } from "@src/layout";
import { storeDataUserProfile } from "@src/store/slice/userInfo.slice";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";

const Profile = () => {
    const dispatch = useDispatch();

    return (
        <BaseLayout>
            <ProfileContainer
                isMultiCardContainer={false}
                // hidenCardChangeEmail
                // hidenCardChangePassword
                // hidenCardChangeUserContact
                hidenTabTwoFactorAuthentication
                onDataUserProfile={(data: any) => {
                    dispatch(storeDataUserProfile(data))
                }}
            />
        </BaseLayout>
    );
};

export default Profile;
Profile.requireAuth = true;

const getStaticProps = getServerSideTranslationsProps(["profile"]);
export { getStaticProps };

