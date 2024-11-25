import { IOccupancy } from "@src/commons/interfaces";
import AdditionalForm from "./additonalForm";
import Popup from "./popup";
import { SearchHotelComponentMode } from "@src/commons/enum";

interface IProps {
    data: IOccupancy[];
    onChangeValue: (value: number, key: keyof IOccupancy, index: number, subIndex?: number) => void;
    visibled: boolean;
    mode: SearchHotelComponentMode;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    handleAddUserToRoom: (index: number) => void;
}

const AdditionalPopup: React.FC<IProps> = ({ data, onChangeValue, mode, visibled, setVisibled, handleAddUserToRoom }) => {
    return (
        <Popup visibled={visibled} onClickOutSide={() => setVisibled(false)} right={0} width={"500px"}>
            <AdditionalForm  mode={mode} data={data} onChangeValue={onChangeValue} handleAddUserToRoom={handleAddUserToRoom} />
        </Popup>
    );
};

export default AdditionalPopup;
