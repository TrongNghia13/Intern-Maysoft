import { Theme } from "@mui/material/styles";
import Constants from "@src/constants";
import { linkStyle } from "@src/styles/commonStyles";

export const drawerStyles = (theme: Theme) => {
    const {
        palette: { link },
    } = theme;
    return {
        width: "250px",
        padding: "1rem",
        "& a": {
            color: link.main,
        },
    };
};

// export const navLink = (theme: any, ownerState: { isActive: boolean; isMobile: boolean }) => {
//     const {
//         palette: { link, background },
//         functions: { rgba },
//     } = theme;

//     const { isActive, isMobile } = ownerState;

//     const mobileStyles = () => ({
//         padding: "1rem",
//         borderRadius: 2,
//         "&:hover": {
//             cursor: "pointer",
//             // color: link.focus,
//             color: "#000",
//             backgroundColor: rgba("#000", 0.3),
//         },
//         "&:focus": {
//             // color: link.focus,
//             color: "#000",

//             backgroundColor: rgba("#000", 0.3),
//         },
//         "& a": {
//             color: "#000",
//         },
//         ...(isActive && {
//             "& a": {
//                 color: "#ffffff",
//             },
//             backgroundColor: rgba(background?.header, 0.3),
//         }),
//     });

//     const desktopStyles = () => ({
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",

//         cursor: "pointer",
//         position: "relative",

//         "& a": {
//             // ...linkStyle(theme, { isActive }),
//             textDecoration: "none",
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             letterSpacing: "0.1rem",
//             fontSize: Constants.FONT_SIZE.TEXT,
//             color: "#ffffff",
//             position: "relative",
//             "&::before": {
//                 position: "absolute",
//                 content: '""',
//                 top: 0,
//                 left: 0,
//                 width:  0,
//                 height: "2px",
//                 backgroundColor: "#ffffff",
//                 borderRadius: 2,
//                 transition: "width .3s ease-out",
//             },
//             "&::after": {
//                 position: "absolute",
//                 content: '""',
//                 right: 0,
//                 bottom: 0,
//                 width:  0,
//                 height: "2px",
//                 backgroundColor: "#ffffff",
//                 borderRadius: 2,
//                 transition: "width .3s ease-out",
//             },
//             "&:hover": {
//                 "&::before": {
//                     width: "100%",
//                 },
//                 "&::after": {
//                     width: "100%",
//                 },
//             },
//         },
//     });

//     return {
//         ...(isMobile && mobileStyles()),
//         ...(!isMobile && desktopStyles()),
//     };
// };

export const navLink = (theme: Theme, ownerState: { isActive: boolean; isMobile: boolean }) => {
    const {
        palette: { link },
        functions: { rgba },
    } = theme;

    const { isActive, isMobile } = ownerState;

    const mobileStyles = () => ({
        padding: "1rem",
        borderRadius: 2,
        "&:hover": {
            cursor: "pointer",
            color: link.focus,
            backgroundColor: rgba(link.focus, 0.3),
            "& a": {},
        },
        "&:focus": {
            color: link.focus,
            backgroundColor: rgba(link.focus, 0.3),
        },
        ...(isActive && {
            backgroundColor: rgba(link.focus, 0.3),
        }),
    });

    const desktopStyles = () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        cursor: "pointer",
        position: "relative",

        borderRadius: 2,
        fontWeight: 500,
        p: "4px 12px",
        backgroundColor: isActive ? "#E4EBF7" : undefined,

        "& a": {
            ...linkStyle(theme, { isActive }),
            textDecoration: "none",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            letterSpacing: "0.03em",
            fontSize: Constants.FONT_SIZE.SMALL_TEXT,
           
        },
    });

    return {
        ...(isMobile && mobileStyles()),
        ...(!isMobile && desktopStyles()),
    };
};
