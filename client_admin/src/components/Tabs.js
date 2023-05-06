import { Tabs } from "antd";

const Index = ({ defaultActiveKey, items }) => {
  return (
    <Tabs
      destroyInactiveTabPane={true}
      defaultActiveKey={defaultActiveKey ?? 0}
      items={items.map((item, i) => {
        return {
          label: item.label,
          key: String(i),
          children: item.child,
        };
      })}
    />
  );
};
export default Index;
