import { useEffect, useRef } from "react";
import { Box } from "@maysoft/common-component-react";

interface IProps {
    visibled: boolean;
    width?: string | number;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    children: [React.ReactNode, React.ReactNode];
}

const FocusBox: React.FC<IProps> = ({ visibled, width, setVisibled, children }) => {
    const ref = useRef<any>(null);

    useEffect(() => {
        const handler = (event: any) => {
            if (!ref.current?.contains(event.target)) {
                setVisibled(false);
            }
        };
        window.addEventListener("click", handler);
        return () => window.removeEventListener("click", handler);
    }, []);

    return (
        <Box ref={ref} onClick={() => setVisibled(true)} {...(width && { width })} minWidth={"240px"}>
            <Box
                sx={{
                    py: 1,
                    px: 3,
                    width: "100%",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    border: "1px solid #ddd",
                    justifyContent: "space-between",
                    borderRadius: "0.42857142857142855rem",
                    gap: 1,
                    ...(!visibled && {
                        "&:hover": {
                            border: "2px solid #1A73E8",
                        },
                    }),
                    ...(visibled && {
                        boxShadow: "0 0 25px rgba(0, 0, 0, 0.1)",
                        border: "2px solid #1A73E8",
                    }),
                    transitionProperty: "background-color, box-shadow",
                    transitionDelay: 0.5,
                }}
            >
                {children[0]}
            </Box>
            {children[1]}
        </Box>
    );
};
export default FocusBox;
