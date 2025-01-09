import { Control } from "react-hook-form";
import OtherWorkAreaInput from "../OtherWorkAreaInput";

interface OtherFieldsProps {
  control: Control<any>;
  visible: boolean;
}

const OtherFields = ({ control, visible }: OtherFieldsProps) => {
  if (!visible) return null;
  
  return <OtherWorkAreaInput control={control} />;
};

export default OtherFields;