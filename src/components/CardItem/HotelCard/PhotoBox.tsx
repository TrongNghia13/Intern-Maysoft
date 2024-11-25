import { Box } from "@maysoft/common-component-react";
import { useMemo } from "react";

import Constants from "@src/constants";
import { Image } from "../../Image";
import { IPhoto } from "@src/commons/interfaces";

const PhotoBox = ({ photos, name }: { photos: IPhoto[]; name: string }) => {
    const itemPhoto = useMemo(() => {
        const images = photos || [];
        const images1000px = images.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[2]);
        if (images1000px.length > 0) return images1000px;
        const images350px = images.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[1]);
        if (images350px.length > 0) return images350px;
        const images70px = images.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[0]);
        return images70px || [];
    }, [photos, photos.length]);

    return (
        <Box
            sx={{
                width: "35%",
                overflow: "hidden",
                maxHeight: "350px",
            }}
        >
            <Image key={itemPhoto[0].photoUrl} width={0} height={0} sizes="100vw" alt={name} src={itemPhoto[0].photoUrl} />
        </Box>
    );
};

export default PhotoBox;
