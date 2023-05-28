// 테스트할 함수를 가져오기
import { Request, Response } from "express";
import httpMocks from "node-mocks-http";
import { isLoggedIn, isNotLoggedIn } from "./../middleware/auth";

describe("isLoggedIn", () => {
  const res = httpMocks.createResponse();
  const next = jest.fn();

  test("로그인 되어 있으면 isLoggedIn이 next를 호출해야 함", () => {
    const req = httpMocks.createRequest({
      isAuthenticated: jest.fn(() => true), // req.isAuthenticated()를 가짜로 넣어준다.
    });
    isLoggedIn(req, res, next); // 함수가 실행되어 true이면 next()를 반환하게 된다.
    expect(next).toBeCalledTimes(1); // next가 1번 호출되는지 검증
  });

  test("로그아웃 되어 있으면 isLoggedIn이 403을 반환해야 함", () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    } as unknown as Request;
    isLoggedIn(req, res, next); // 함수가 실행되어 true이면 next()를 반환하게 된다.
    expect(res._getStatusCode()).toEqual(403);
  });
});
