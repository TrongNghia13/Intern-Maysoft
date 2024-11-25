"use client";
import { Box } from "@maysoft/common-component-react";
import { BoxProps } from "@mui/material";
import cn from "classnames";
import { HTMLProps, PropsWithChildren } from "react";
import { ITooltip, Tooltip as TooltipCpn } from "react-tooltip";

type PropsWrapper = {
    className?: string;
    tooltipId?: string;
    place?: ITooltip["place"];
} & BoxProps;

type PropsContent = {
    className?: string;
} & HTMLProps<HTMLDivElement>;

export const Tooltip = ({
    children,
    className,

    ...rest
}: ITooltip) => {
    return (
        <TooltipCpn
            className={cn("!z-tooltip bg-white !opacity-100", className)}
            variant="light"
            closeOnScroll={true}
            render={({ activeAnchor }) => {
                const content = activeAnchor?.querySelector(".tooltip-content")?.innerHTML || "<span>Tooltip</span>";
                return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
            }}
            {...rest}
        >
            {children}
        </TooltipCpn>
    );
};

// eslint-disable-next-line react/display-name
Tooltip.Wrapper = ({ className, children, place = "top", tooltipId = "global-tooltip", ...rest }: PropsWithChildren<PropsWrapper>) => {
    return (
        <Box  data-tooltip-id={tooltipId} data-tooltip-place={place} className={className} sx={{...rest.sx }}>
            {children}
        </Box>
    );
};

// eslint-disable-next-line react/display-name
Tooltip.Content = ({ className, children, ...rest }: PropsWithChildren<PropsContent>) => {
    return (
        <div {...rest} className={cn("tooltip-content", className)}>
            {children}
        </div>
    );
};
