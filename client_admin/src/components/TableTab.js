import React, { useEffect, useState } from "react";

import { Button } from "antd";
import Table from "./Table.js";

const editMode = false;

const Index = (props) => {
  const { onLoadHandler, onRemoveHandler, AddDrawer, EditDrawer, columns } =
    props;

  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState();

  const [isActiveAddDrawer, setIsActiveAddDrawer] = useState(false);
  const [isActiveEditDrawer, setIsActiveEditDrawer] = useState(false);

  const removeData = async (e) => {
    if (window.confirm("정말 삭제하시겠습니까?") === true) {
      try {
        await onRemoveHandler(e);
        alert("SUCCESS");
        setIsLoading(true);
      } catch (err) {
        alert(err.response.data.message);
      }
    }
  };

  const loadData = async () => {
    try {
      const items = await onLoadHandler();
      setItems(items);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  useEffect(() => {
    if (isLoading) {
      loadData()
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
    return () => {};
  }, [isLoading]);

  return (
    <>
      <div>
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
        >
          {editMode && (
            <Button
              type="primary"
              onClick={() => {
                setIsActiveAddDrawer(true);
              }}
            >
              + 생성
            </Button>
          )}
        </div>
        <div style={{ marginTop: "16px" }}>
          <Table
            columns={[
              {
                key: "_id",
                type: "button-copy",
                width: "56px",
              },
              ...columns,
              editMode && {
                key: "edit",
                type: "button-detail",
                width: "112px",
                onClick: (e) => {
                  setItem(e);
                  setIsActiveEditDrawer(true);
                },
              },
              editMode && {
                key: "delete",
                type: "button-delete",
                width: "112px",
                onClick: removeData,
              },
            ].filter((x) => x)}
            rows={items.map((item) => {
              return { ...item, key: item._id };
            })}
          />
        </div>
      </div>
      {isActiveAddDrawer && (
        <AddDrawer
          setIsActive={setIsActiveAddDrawer}
          setIsLoading={setIsLoading}
        />
      )}
      {isActiveEditDrawer && item && (
        <EditDrawer
          item={item}
          setIsLoading={setIsLoading}
          setIsActive={setIsActiveEditDrawer}
        />
      )}
    </>
  );
};

export default Index;
