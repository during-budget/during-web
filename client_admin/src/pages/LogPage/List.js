import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import HeaderRefresh from "../../components/HeaderRefresh";

import { Button, Result } from "antd";

function List() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const updateDocuments = async () => {};

  useEffect(() => {
    if (isLoading) {
      updateDocuments().then(() => {
        setIsLoading(false);
      });
    }
    return () => {};
  }, [isLoading]);

  return (
    <div style={{ marginTop: "24px" }}>
      <HeaderRefresh text="logs" setIsLoading={setIsLoading} />

      <Result
        title="Page is not ready"
        extra={[
          <Button
            key="retry"
            onClick={(e) => {
              navigate("/");
            }}
          >
            Go Back
          </Button>,
        ]}
      />
    </div>
  );
}

export default List;
