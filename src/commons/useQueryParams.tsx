import { useRouter } from "next/router";
import { useMemo } from "react";

export const useQueryParams = (queryKey: string[]): ({[key: string]: string} | undefined) => {
    const router = useRouter();
    const filter: {[key: string]: string} | undefined = useMemo(() => {
        let data: {[key: string]: string} = {};
        queryKey.forEach((key) => {
            if (router?.query[key]) {
                data[key] = router?.query[key]?.toString() || "";
            }
        })
        return data;
    }, [router?.query]);

    return filter;
}