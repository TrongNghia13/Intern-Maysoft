import { Box, Typography } from "@maysoft/common-component-react";
import { KeyboardArrowDown, KeyboardArrowUp, Language } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

export const LanguageSwitcher: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (locale: string) => {
        setAnchorEl(null);
        const { pathname, asPath, query } = router;
        router.push({ pathname, query }, asPath, { locale });
    };

    return (
        <div>
            {/* <Button
                // {...props}
                // variant="outlined"
                id="languageButton"
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                aria-controls={open ? "languageMenu" : undefined}
                startIcon={<Language />}
                onClick={handleClick}
                endIcon={!open ? <KeyboardArrowDown/> : <KeyboardArrowUp/>}
                sx={{
                    background: "transparent"
                }}
            >
                {router.locale === "vi" ? "Tiếng Việt" : "English"}
            </Button> */}
            <Box
                id="languageButton"
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                aria-controls={open ? "languageMenu" : undefined}
                onClick={handleClick}
                sx={{
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    "& p": {
                        color: "#637381",
                    },
                    "& svg": {
                        color: "#637381",
                    },
                    "&:hover": {
                        cursor: "pointer",
                    },
                }}
            >
                <Language />
                <Typography
                    sx={{
                        fontSize: "0.875rem",
                    }}
                >
                    {router.locale === "vi" ? "Tiếng Việt" : "English"}
                </Typography>
                {!open ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </Box>
            <Menu
                id="languageMenu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "languageButton",
                }}
            >
                <MenuItem selected={router.locale === "vi"} onClick={() => handleLanguageChange("vi")}>
                    Tiếng Việt
                </MenuItem>
                <MenuItem selected={router.locale === "en"} onClick={() => handleLanguageChange("en")}>
                    English
                </MenuItem>
            </Menu>
        </div>
    );
};

export default LanguageSwitcher;
