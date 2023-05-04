import { Button } from "antd";
import { RedoOutlined } from "@ant-design/icons";

const Index = ({ text, setIsLoading }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h1>{text}</h1>
      <Button
        type="text"
        size="large"
        onClick={(e) => {
          setIsLoading(true);
        }}
      >
        <RedoOutlined />
      </Button>
    </div>
  );
};

export default Index;
