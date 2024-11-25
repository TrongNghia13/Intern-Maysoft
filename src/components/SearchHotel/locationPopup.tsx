import { Box, Typography } from "@maysoft/common-component-react";
import { CircularProgress, Grid, Link } from "@mui/material";

import Popup from "./popup";
import { useTranslation } from "react-i18next";
import { ISearch } from "@src/commons/interfaces";

interface IProps {
    data: ISearch[];
    loading: boolean;
    visibled: boolean;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    onClick: (name: string) => void;
}

type IZones = {
    percent?: number;
};

type ILandMark = {
    desc?: string;
};

type IData = { img: string; name: string; count: number } & (IZones | ILandMark);

const LocationPopup: React.FC<IProps> = ({ visibled, data, loading, setVisibled, onClick }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation("common");

    const handleClick = (name: string) => {
        onClick(name);
        setVisibled(false);
    };

    return (
        <Popup visibled={visibled} onClickOutSide={() => setVisibled(false)} left={0}>
            <Box p={2}>
                {loading && (
                    <Box display="flex" alignItems="center" justifyContent="center" height="10vh">
                        <CircularProgress size="2rem" />
                    </Box>
                )}
                {!loading && (
                    <Grid container spacing={1}>
                        {data.length !== 0 &&
                            data.map((item, key) => (
                                <Grid item xs={12} key={key}>
                                    <Item img={item.avatarUrl} name={item.partnerName} count={1111} onClick={handleClick} />
                                </Grid>
                            ))}
                        {data.length === 0 && (
                            <Grid item xs={12}>
                                <Box>
                                    <Typography variant="caption">{t("no_data")}</Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Box>
        </Popup>
    );
};

const ListItem = ({ items, title, onClick }: { items: IData[]; title: string; onClick: (name: string) => void }) => {
    return (
        <>
            <Typography variant="caption">{title}</Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                {items.map((item, index) => (
                    <Item {...item} key={index} onClick={onClick} />
                ))}
            </Box>
        </>
    );
};

const Item = ({
    ...item
}: IData & {
    onClick: (name: string) => void;
}) => {
    const isZones = "percent" in item;
    const isLandmark = "desc" in item;
    const {
        t,
        i18n: { language },
    } = useTranslation("search_hotel");
    return (
        <Box
            sx={{
                display: "flex",
                gap: 1,
                px: 0.5,
                py: 0.5,
                borderRadius: 2,
                transition: "background-color .3s ease",
                "&:hover": {
                    backgroundColor: "#dddddd",
                    cursor: "pointer",
                },
            }}
            onClick={(e) => {
                e.stopPropagation();
                item.onClick(item.name);
            }}
        >
            <Box component={"img"} sx={{ width: 50, height: 50, borderRadius: 2 }} src={item.img} />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                <Typography variant="caption" fontWeight="medium">
                    {item.name} &nbsp;
                    {/* <Typography variant="caption">({item.count})</Typography> */}
                </Typography>
                {isZones && (
                    <Typography variant="caption">
                        <Link href="">{item.percent}%</Link> {t("stayed_here")}
                    </Typography>
                )}
                {isLandmark && <Typography variant="caption">{item.desc}</Typography>}
            </Box>
        </Box>
    );
};

const IMAGES_URL = [
    "https://www.investopedia.com/thmb/hdtiMC_XuDzJO4ez-4DrfgrP7yE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/getty-large-farm-landscape-56c0a6aa5f9b5829f867287c.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUjBeF9I1xF3-fj16TeuD8QukzqwIEtm10EA&usqp=CAU",
    "https://i0.wp.com/landinstitute.org/wp-content/uploads/2019/07/72-Plots-Kernza-July-2017.jpg?resize=700%2C370&ssl=1",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnVCxoYfJptEgsT61M_C07dFc8bQCQgVFPgQ&usqp=CAU",
    "https://hips.hearstapps.com/hmg-prod/images/beach-quotes-1559667853.jpg?crop=1.00xw:0.751xh;0,0.202xh&resize=1200:*",
    "https://drupal8-prod.visitcalifornia.com/sites/drupal8-prod.visitcalifornia.com/files/2020-06/VC_Experiences_ReopeningBeaches_RF_1156532604_1280x640.jpg",
    "https://skift.com/wp-content/uploads/2023/04/zany-jadraque-ZCRtfop2hZY-unsplash.jpg",
    "https://media.cnn.com/api/v1/images/stellar/prod/230518143917-01-best-beaches-us-2023-dr-beach-saint-george-island-state-park.jpg?c=original&q=h_618,c_fill",
];

const getRandomImage = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)];
};

const zones = [
    {
        img: getRandomImage(IMAGES_URL),
        name: "Cái Khế",
        percent: 33,
        count: 120,
    },
    {
        img: getRandomImage(IMAGES_URL),
        name: "Bến Ninh Kiều",
        percent: 26,
        count: 120,
    },
    {
        img: getRandomImage(IMAGES_URL),
        name: "Trung tâm thành phố Cần Thơ",
        percent: 20,
        count: 120,
    },
];

const landmarks = [
    {
        img: getRandomImage(IMAGES_URL),
        name: "Chùa ông",
        desc: "Nơi thờ cúng",
        count: 120,
    },
    {
        img: getRandomImage(IMAGES_URL),
        name: "Nhà cổ bình thủy",
        desc: "Điểm tham quan",
        count: 120,
    },
    {
        img: getRandomImage(IMAGES_URL),
        name: "Chùa Quang Đức",
        desc: "Nơi thờ cúng",
        count: 120,
    },
];

const cities = [
    {
        img: getRandomImage(IMAGES_URL),
        name: "Đà nẵng",
        desc: "Bãi biển tham quan",
        count: 1200,
    },
    {
        img: getRandomImage(IMAGES_URL),
        name: "Hồ Chí Minh",
        desc: "Nhà hàng, mua sắm",
        count: 1250,
    },
    {
        img: getRandomImage(IMAGES_URL),
        name: "Hà Nội",
        desc: "Nhà hàng, tham quan",
        count: 4120,
    },
    {
        img: getRandomImage(IMAGES_URL),
        name: "Vũng Tàu",
        desc: "Bãi biển, tham quan",
        count: 2120,
    },
];

export default LocationPopup;
