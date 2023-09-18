import { Input } from "../ui/input";
import Label from "../ui/label";

export interface InputSensorProps {
  name: string;
  value: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export interface InputSensorInterface {
  name: string;
  value: number;
}

const InputSensor = ({ name, value, onChange }: InputSensorProps) => {
  return (
    <div>
      <Label htmlFor={name}>{name}</Label>
      <Input
        type="number"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export { InputSensor };
