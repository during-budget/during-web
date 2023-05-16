const { DURING_SERVER } = import.meta.env;

const BASE_URL = `${DURING_SERVER}/api/auth`;

export const providers: { provider: string; label: string; icon: string }[] = [
  { provider: "google", label: "구글", icon: "G" },
  { provider: "naver", label: "네이버", icon: "N" },
  { provider: "kakao", label: "카카오", icon: "K" },
];

export interface SnsIdType {
  [key: string]: string | undefined;
}

export const defaultSnsId = {
  google: undefined,
  naver: undefined,
  kakao: undefined,
};

export const getAuthURL = (provider: string) =>
BASE_URL +"/"+ provider;

export const disconnectSnsId = async (provider: string) => {
  const url = `${BASE_URL}/${provider}`;
  const response = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    if(response.status===409){
      throw new Error(
        "최소 하나의 로그인 수단이 필요합니다."
      );
    }
    throw new Error(
      "알 수 없는 에러가 발생했습니다."
    );
  }

  return data as { snsId: SnsIdType };
};

export const getSnsId = async () => {
  const url = `${BASE_URL}`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      "알 수 없는 에러가 발생했습니다."
    );
  }

  return data as { snsId: SnsIdType };
};
