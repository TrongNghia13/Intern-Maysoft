import Image from "next/image";
import React, { useState } from "react";
import { Avatar as MuiAvatar, AvatarProps } from "@mui/material";

interface IProps extends AvatarProps {
    text?: string;
}

export const Avatar: React.FC<IProps> = (props: IProps) => {
    const { src, ...rest } = props;
    const [isError, setIsError] = useState(false);
    const stringToColor = (): any => {
        let hash = 0;
        let i;
        const text = props.text || "";
        for (i = 0; i < text.length; i += 1) {
            hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = "#";
        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `${value.toString(16)}`;
        }
        return color;
    };

    return (
        <MuiAvatar
            {...rest}
            style={{
                ...props.style,
                backgroundColor: props.text ? stringToColor() : "#bdbdbd",
            }}
        >
            {props.src && !isError ? (
                <Image alt={props.text || ""} src={props.src} fill style={{ objectFit: "cover" }} onError={() => setIsError(true)} />
            ) : (
                props.children
            )}
        </MuiAvatar>
    );
};

export default Avatar;
