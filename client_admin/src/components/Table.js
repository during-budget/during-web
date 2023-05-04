import { Button, Space, Table, Tag } from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useState } from "react";

export async function copyClipBoard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return text;
  } catch (error) {
    return error;
  }
}

const Index = ({ columns, rows }) => {
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  return (
    <Table
      columns={columns.map((column) => {
        if (!column.dataIndex) {
          column.dataIndex = column.key;
        }
        if (!column.title) {
          column.title = column.key;
        }
        if (column.type === "button-copy") {
          column.render = (text, record) => (
            <Button
              onClick={(e) => {
                copyClipBoard(record[column.key]).then((text) => {
                  alert(`copied! => ${text}`);
                });
              }}
            >
              <CopyOutlined />
            </Button>
          );
        } else if (column.type === "button-delete") {
          column.render = (_, record) => (
            <Button danger type="text" onClick={column.onClick}>
              <DeleteOutlined />
            </Button>
          );
        } else if (column.type === "button-detail") {
          column.render = (text, record) => (
            <Button type="link" onClick={() => column.onClick(record)}>
              {text} <SearchOutlined />
            </Button>
          );
        }
        return column;
      })}
      dataSource={rows}
      pagination={tableParams.pagination}
      scroll={{ y: 360 }}
      onChange={handleTableChange}
    />
  );
};

export default Index;
