// import * as UserService from "src/services/users";

// describe("test user service - local & snsId", () => {
//   it("isLocalLoginActive", () => {
//     const user: any = { isLocal: false };
//     expect(UserService.isLocalLoginActive(user)).toBeFalsy();

//     user.isLocal = true;
//     expect(UserService.isLocalLoginActive(user)).toBeTruthy();
//   });

//   it("checkSnsIdActive", () => {
//     const user: any = {};
//     expect(UserService.checkSnsIdActive(user, "google")).toBeFalsy();

//     user.snsId = { google: "google-id" };
//     expect(UserService.checkSnsIdActive(user, "google")).toBeTruthy();
//   });

//   it("countActiveSnsId", () => {
//     const user0: any = { snsId: {} };
//     const user1: any = { snsId: { google: "google-id" } };
//     const user2: any = { snsId: { google: "google-id", naver: "naver-id" } };

//     expect(UserService.countActiveSnsId(user0)).toBe(0);
//     expect(UserService.countActiveSnsId(user1)).toBe(1);
//     expect(UserService.countActiveSnsId(user2)).toBe(2);
//   });

//   it("hasActiveSnsId", () => {
//     const user0: any = { snsId: {} };
//     const user1: any = { snsId: { google: "google-id" } };
//     const user2: any = { snsId: { google: "google-id", naver: "naver-id" } };

//     expect(UserService.hasActiveSnsId(user0)).toBeFalsy();
//     expect(UserService.hasActiveSnsId(user1)).toBeTruthy();
//     expect(UserService.hasActiveSnsId(user2)).toBeTruthy();
//   });

//   it("update snsId and inactivate guest mode", async () => {
//     const user: any = { snsId: {}, save: jest.fn() };

//     await UserService.updateSnsId(user, "google", "google-id");

//     expect(user.snsId).toEqual({ google: "google-id" });
//     expect(user.isGuest).toBe(false);
//   });

//   it("update email and activate local login and inactivate guest mode", async () => {
//     const user: any = { save: jest.fn() };

//     await UserService.updateEmailAndActivateLocalLogin(user, "email");

//     expect(user.email).toEqual("email");
//     expect(user.isLocal).toBe(true);
//     expect(user.isGuest).toBe(false);
//   });

//   it("remove snsId", async () => {
//     const user: any = { snsId: { google: "google-id" }, save: jest.fn() };

//     await UserService.removeSnsId(user, "google");

//     expect(user.snsId.google).toEqual(undefined);
//   });
// });
