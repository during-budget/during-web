import Input from "./Input";

const Index = (record, style) => (
  <div
    style={{
      marginLeft: style?.marginLeft ?? "120px",
      marginRight: style?.marginRight ?? "120px",
      display: "flex",
      gap: "24px",
      flexDirection: "column",
    }}
  >
    {[
      <Input key="copyAll" label={""} value={JSON.stringify(record)} disable />,
      ...Object.keys(record)
        .sort()
        .map((key) => <Input label={key} value={record[key]} disable />),
    ]}
  </div>
);

export default Index;
