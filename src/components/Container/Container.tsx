import { ContainerProps, Container as MUIContainer } from "@mui/material";

export const Container: React.FC<ContainerProps> = ({ children, ...rest }: ContainerProps) => {
    return (
        <MUIContainer
            {...rest}
            sx={{
                px: {
                    xs: "1rem",
                    sm: "4rem",
                    md: "5rem",
                    lg: "10rem",
                },
                ...rest.sx,
            }}
        >
            {children}
        </MUIContainer>
    );
};

export default Container;
