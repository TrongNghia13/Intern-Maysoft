import NextImage, { ImageProps } from "next/image";
import { useMemo, useState } from "react";

import Resources from "@src/constants/Resources";

interface IProps extends ImageProps {}

export const Image: React.FC<IProps> = ({ src, ...rest }) => {
    const [isError, setIsError] = useState<boolean>(false);

    const photoUrl = src;

    const imgUrl = useMemo(() => (isError ? Resources.Images.DEFAULT_THUMBNAIL : photoUrl), [isError]);

    return <NextImage src={imgUrl} style={{ objectFit: "cover" }} onError={(e) => setIsError(true)} {...rest} />;
};

export default Image;
