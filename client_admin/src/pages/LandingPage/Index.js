import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

function Index() {
  const navigate = useNavigate();
  const items = [
    {
      href: "/DB",
      title: "/ DB",
      color: "DarkOliveGreen",
    },
    { href: "/logs", title: "/ Logs", color: "DarkOliveGreen" },
    { href: "/test", title: "/ test", color: "DarkOliveGreen" },
  ];

  return (
    <div>
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          gap: "24px",
          flexDirection: "column",
        }}
      >
        {items.map((item) => {
          return (
            <>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  navigate(item.href);
                }}
                style={{ backgroundColor: item.color }}
              >
                {item.title}
              </Button>
              {item.subItems ? (
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                  }}
                >
                  {item.subItems.map((subItem) => {
                    return (
                      <div>
                        <Button
                          type="primary"
                          size="large"
                          onClick={() => {
                            navigate(item.href + subItem.href);
                          }}
                          style={{ backgroundColor: item.color }}
                        >
                          {subItem.title}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <></>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
}

export default Index;
