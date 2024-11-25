import { Box } from "@maysoft/common-component-react";
import { useMemo, useState } from "react";

import { IPhoto } from "@src/commons/interfaces";
import Constants from "@src/constants";
import ModalListImageGroupByTag from "./modalListImageGroupByTag";
import { Image } from "../Image";

const ImageLibrary = ({ images, numberOfChild = 4 }: { images: IPhoto[]; numberOfChild?: number }) => {
    const [visibled, setVisibled] = useState<boolean>(false);

    const newImages = useMemo(() => {
        const images1000px = images.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[2]);
        if (images1000px.length > 0) return images1000px;
        const images350px = images.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[1]);
        if (images350px.length > 0) return images350px;
        const images70px = images.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[0]);
        return images70px || [];
    }, [images]);

    const { firstImage, subImage } = useMemo(() => {
        const result: {
            firstImage: IPhoto;
            subImage: IPhoto[];
        } = {
            firstImage: {} as IPhoto,
            subImage: [],
        };

        if (newImages.length === 0) return result;

        Object.assign(result, { firstImage: newImages[0] });
        Object.assign(result, { subImage: newImages.slice(1, numberOfChild + 1) });

        return result;
    }, [newImages, numberOfChild]);

    const { parentColumns, gridTemplateColumns, gridTemplateRows } = useMemo(() => {
        const result = {
            parentColumns: "1fr",
            gridTemplateColumns: "0fr",
            gridTemplateRows: "0fr",
        };

        if (subImage.length === 0) Object.assign(result, { gridTemplateColumns: "0fr" });

        if (subImage.length === 1) Object.assign(result, { gridTemplateColumns: "1fr", parentColumns: "1fr 1fr", gridTemplateRows: "1fr" });

        if (subImage.length === 2)
            Object.assign(result, { gridTemplateColumns: "repeat(2, 1fr)", parentColumns: "1fr 1fr", gridTemplateRows: "100%" });

        if (subImage.length > 2) Object.assign(result, { gridTemplateColumns: "repeat(2, 1fr)", parentColumns: "1fr 1fr", gridTemplateRows: "50%" });

        return result;
    }, [subImage]);

    return (
        <>
            <Box
                sx={{
                    gap: "0.5rem",
                    display: "grid",
                    gridTemplateRows: "50vh",
                    gridTemplateColumns: parentColumns,
                    "& img": {
                        width: "100%",
                        height: "100%",
                    },
                }}
            >
                <ImageBox
                    src={firstImage.photoUrl}
                    onClick={() => {
                        setVisibled(true);
                    }}
                />

                {subImage.length > 0 && (
                    <Box
                        sx={{
                            gap: "0.5rem",
                            display: "grid",
                            gridTemplateRows: gridTemplateRows,
                            gridTemplateColumns: gridTemplateColumns,
                            "& img": {
                                width: "100%",
                                height: "100%",
                            },
                        }}
                    >
                        {subImage.map((item, key) => (
                            <ImageBox
                                key={item.photoId}
                                src={item.photoUrl}
                                gridColumn={subImage.length === 3 && key === 2 ? "span 2" : "auto"}
                                onClick={() => {
                                    setVisibled(true);
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            {/* <ViewListModal data={images} {...{ visibled, setVisibled }} /> */}

            <ModalListImageGroupByTag listImages={newImages} visibled={visibled} setVisibled={setVisibled} />
        </>
    );
};

const ImageBox = ({ src, gridColumn, onClick }: { src: string; gridColumn?: string; onClick: () => void }) => {
    return (
        <Box
            sx={{
                overflow: "hidden",
                borderRadius: 2,
                "&:hover": {
                    cursor: "pointer",
                    "& img": {
                        transform: "scale(1.2)",
                        filter: "brightness(0.5)",
                    },
                },
                "& img": {
                    transition: "transform .3s ease-out, filter .3s ease-out",
                    transformOrigin: "center",
                    width: "100%",
                    height: "100%",
                },
                gridColumn,
            }}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            <Image src={src} alt={src} width={0} height={0} sizes="100vw" />
        </Box>
    );
};

export default ImageLibrary;
