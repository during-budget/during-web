import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const Index = () => (
  <div style={{ padding: "48px 32px", textAlign: "center" }}>
    <Spin
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 24,
          }}
          spin
        />
      }
    />
  </div>
);
export default Index;
