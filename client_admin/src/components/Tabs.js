import { Tabs } from "antd";

const Index = ({ items }) => {
  return (
    <Tabs
      defaultActiveKey="1"
      items={items.map((item, i) => {
        return {
          label: item.label,
          key: String(i + 1),
          children: item.child,
        };
      })}
    />
  );
};
export default Index;
