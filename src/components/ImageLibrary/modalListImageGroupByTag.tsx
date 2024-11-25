import { Box, Modal, Typography } from "@maysoft/common-component-react";
import { useCallback, useMemo, useState } from "react";
import ReactSimpleImageViewer from "react-simple-image-viewer";

import { IPhoto } from "@src/commons/interfaces";
import { Image } from "../Image";

const ModalListImageGroupByTag = ({
    visibled,
    setVisibled,
    listImages,
}: {
    visibled: boolean;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;

    listImages: IPhoto[];
}) => {
    const [viewerVisibled, setViewerVisibled] = useState(false);
    const [currentImageViewer, setCurrentImageViewer] = useState(0);
    const [dataImagesViewer, setDataImagesViewer] = useState<string[]>([]);

    const openImageViewer = useCallback((index: number) => {
        setCurrentImageViewer(index);
        setViewerVisibled(true);
    }, []);

    const closeImageViewer = () => {
        setViewerVisibled(false);
        setCurrentImageViewer(0);
        setDataImagesViewer([]);
    };

    const handleSubmit = () => {
        setVisibled(false);
    };

    const convertImagesGroupByTag = useMemo(() => {
        const newDataGroupByTag: Map<string, IPhoto[]> = new Map();

        for (const item of listImages) {
            const key = item.tag;

            let collect = newDataGroupByTag.get(key);

            if (!collect) {
                newDataGroupByTag.set(key, [item]);
            } else {
                collect.push(item);
            }
        }

        return newDataGroupByTag;
    }, [listImages]);

    return (
        <Modal
            fullWidth
            maxWidth={"lg"}
            visible={visibled}
            onAction={handleSubmit}
            onClose={() => {
                setViewerVisibled(false);
                setVisibled(false);
            }}
        >
            <Box sx={{ height: "min(600px, 70vh)" }}>
                <Box width={"100%"}>
                    {Array.from(convertImagesGroupByTag.keys()).map((valKey, index) => (
                        <Box key={`tag_${index}`} marginTop={2}>
                            <Typography variant="button" fontWeight="bold">
                                {valKey}
                            </Typography>
                            <Box
                                sx={{
                                    gap: 1,
                                    display: "flex",
                                    flexWrap: "wrap",
                                }}
                            >
                                {convertImagesGroupByTag.has(valKey) &&
                                    convertImagesGroupByTag.get(valKey)?.map((item, index) => (
                                        <Box
                                            key={item.photoId}
                                            sx={{
                                                width: "24%",
                                                height: "120px",
                                                "& img": {
                                                    width: "100%",
                                                    height: "100%",
                                                },
                                                transition: "filter .3s ease-out",
                                                "&:hover": {
                                                    cursor: "pointer",
                                                    filter: "brightness(0.5)",
                                                },
                                            }}
                                            onClick={() => {
                                                const newIds = convertImagesGroupByTag.get(valKey)?.map((el) => el.photoUrl);
                                                setDataImagesViewer(newIds || []);
                                                openImageViewer(index);
                                            }}
                                        >
                                            <Image width={0} height={0} sizes="100vw" src={item.photoUrl} alt={`img ${index}`} key={`img ${index}`} />
                                        </Box>
                                    ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
                {/* <Box width={"20%"}>
                    <Grid container spacing={3}>

                    </Grid>
                </Box> */}
                {viewerVisibled && (
                    <ReactSimpleImageViewer
                        disableScroll={true}
                        src={dataImagesViewer}
                        closeOnClickOutside={true}
                        onClose={closeImageViewer}
                        currentIndex={currentImageViewer}
                        backgroundStyle={{
                            backgroundColor: "rgba(0,0,0,0.9)",
                        }}
                    />
                )}
            </Box>
        </Modal>
    );
};

export default ModalListImageGroupByTag;
