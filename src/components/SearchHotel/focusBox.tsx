import { Box } from "@maysoft/common-component-react";
import { useEffect, useRef } from "react";

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
        <Box ref={ref} onClick={() => setVisibled(true)} {...(width && { width })}>
            <Box
                sx={{
                    py: 1,
                    px: 3,
                    border: "1px solid #c3c3c3",
                    // backgroundColor: "#f3f3f3",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 1,
                    // ...(!visibled && {
                    //     "&:hover": {
                    //         backgroundColor: "#dddddd",
                    //     },
                    // }),
                    // ...(visibled && {
                    //     boxShadow: "0 0 25px rgba(0, 0, 0, 0.1)",
                    //     backgroundColor: "#ffffff",
                    // }),
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
