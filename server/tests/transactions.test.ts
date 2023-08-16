/**
 *
 */
import httpMocks from "node-mocks-http";
import { Types } from "mongoose";

jest.mock("@models/Transaction");
import { Transaction } from "src/models/Transaction";
import * as transactions from "src/api/controllers/transactions";

describe("GET /transactions?linkedPaymentMethodId=*** (결제 수단으로 카드 찾는 API)", () => {
  const card = {
    _id: new Types.ObjectId(),
  };

  it("요청 유효성 테스트 1", async () => {
    const req = httpMocks.createRequest({
      user: {},
      query: {
        linkedPaymentMethodId: card._id,
      },
    });
    const res = httpMocks.createResponse();

    await transactions.find(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData().message).toBe("STARTDATE_REQUIRED");
  });

  it("요청 유효성 테스트 2", async () => {
    const req = httpMocks.createRequest({
      user: {},
      query: {
        linkedPaymentMethodId: card._id,
        startDate: "1231asdf",
      },
    });
    const res = httpMocks.createResponse();

    await transactions.find(req, res);
    expect(res._getStatusCode()).toBe(400);
    expect(res._getData().message).toBe("STARTDATE_INVALID");
  });

  it("테스트", async () => {
    const req = httpMocks.createRequest({
      user: {},
      query: {
        linkedPaymentMethodId: card._id,
        startDate: "2000-01-15",
        endDate: "2000-02-14",
      },
    });
    const res = httpMocks.createResponse();

    Transaction.find = jest.fn().mockResolvedValueOnce([
      {
        amount: 10,
        date: new Date("2000-01-15"),
        linkedPaymentMethodId: card._id,
      },
      {
        amount: 20,
        date: new Date("2000-01-20"),
        linkedPaymentMethodId: card._id,
      },
    ]);

    await transactions.find(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData().amountTotal).toBe(30);
    expect(res._getData().transactions).toEqual([
      {
        amount: 10,
        date: new Date("2000-01-15"),
        linkedPaymentMethodId: card._id,
      },
      {
        amount: 20,
        date: new Date("2000-01-20"),
        linkedPaymentMethodId: card._id,
      },
    ]);
  });
});
