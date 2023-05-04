import { Button, Input } from "antd";
import { CopyOutlined } from "@ant-design/icons";

export async function copyClipBoard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return text;
  } catch (error) {
    return error;
  }
}

const Index = ({ label, value, disable }) => {
  let _value = value;
  if (Object.prototype.toString.call(value) === "[object Array]") {
    _value = JSON.stringify(value);
  }

  return (
    <Input
      addonBefore={label}
      addonAfter={
        <Button
          type="text"
          onClick={(e) => {
            copyClipBoard(value).then((text) => {
              alert(`✂️ ${text}`);
            });
          }}
        >
          <CopyOutlined />
        </Button>
      }
      defaultValue={_value}
      disable={disable}
    />
  );
};

export default Index;
