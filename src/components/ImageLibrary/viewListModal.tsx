import { Box, Modal } from "@maysoft/common-component-react";
import { useCallback, useState } from "react";
import ReactSimpleImageViewer from "react-simple-image-viewer";
import { Image } from "../Image";

const ViewListModal = ({
    visibled,
    data,
    setVisibled,
}: {
    visibled: boolean;
    data: string[];
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const handleSubmit = () => {
        setVisibled(false);
    };

    const [currentImage, setCurrentImage] = useState(0);
    const [viewerVisibled, setViewerVisibled] = useState(false);

    const openImageViewer = useCallback((index: number) => {
        setCurrentImage(index);
        setViewerVisibled(true);
    }, []);

    const closeImageViewer = () => {
        setCurrentImage(0);
        setViewerVisibled(false);
    };

    return (
        <Modal
            fullWidth
            maxWidth={"lg"}
            // hasActionButton
            visible={visibled}
            title={"Images"}
            onAction={handleSubmit}
            onClose={() => {
                setViewerVisibled(false);
                setVisibled(false);
            }}
        >
            <Box
                sx={{
                    overflow: "auto",
                    height: "min(600px, 70vh)",
                    pb: 2,
                    "& img": {
                        width: "100%",
                        height: "100%",
                    },
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
                    gap: 1,
                }}
            >
                {data.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            ...((index + 1) % 3 === 1 && {
                                gridColumnEnd: "span 2",
                                gridRowEnd: "span 2",
                            }),
                            transition: "filter .3s ease-out",
                            "&:hover": {
                                cursor: "pointer",
                                filter: "brightness(0.5)",
                            },
                        }}
                        onClick={() => openImageViewer(index)}
                    >
                        <Image src={item} alt={`img ${index}`} width={0} height={0} sizes="100vw" key={index} />
                    </Box>
                ))}

                {viewerVisibled && (
                    <ReactSimpleImageViewer
                        src={data}
                        currentIndex={currentImage}
                        onClose={closeImageViewer}
                        disableScroll={true}
                        backgroundStyle={{
                            backgroundColor: "rgba(0,0,0,0.9)",
                        }}
                        closeOnClickOutside={true}
                    />
                )}
            </Box>
        </Modal>
    );
};

export default ViewListModal;
