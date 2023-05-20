import { GoogleLoginButton } from "../../components/SocialLoginButton";

const SERVER_URL = process.env.REACT_APP_DURING_SERVER + "/api/";

const Index = () => {
  return (
    <div style={{ marginTop: "48px" }}>
      <h1>Welcome to Admin Page!</h1>
      <div
        style={{
          margin: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <a href={SERVER_URL + "auth/google/admin"}>
          <GoogleLoginButton />
        </a>
      </div>
    </div>
  );
};
export default Index;
