import { useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { NextApplicationPage } from "@src/pages/_app";

import Helpers from "./helpers";

export const withSSRErrorHandling = <PageProps,>(Page: NextApplicationPage<PageProps>) => {
    const Enhanced: NextApplicationPage = (props: any) => {

        const router = useRouter();
        const dispatch = useDispatch();

        useEffect(() => {
            const error = props.error;
            if (!error) {
                return;
            }
            Helpers.handleError(error, router, dispatch);
        }, [props.error])

        return (
            <Page {...props} />
        );
    };

    Enhanced.getLayout = Page.getLayout;
    Enhanced.requiredAuth = Page.requiredAuth;
    Enhanced.requiredMainlayout = Page.requiredMainlayout;

    return Enhanced;
}