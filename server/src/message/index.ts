/**
 * 2xx Successful
 * ---------------------------------------------
 * 200 Success
 * ---------------------------------------------
 */

/**
 * @code 200 Success
 */
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const CONNECT_SUCCESS = "CONNECT_SUCCESS";
export const EMAIL_UPDATE_SUCCESS = "EMAIL_UPDATE_SUCCESS";

export const LOGIN_VERIFICATION_CODE_SENT = "LOGIN_VERIFICATION_CODE_SENT";
export const REGISTER_VERIFICATION_CODE_SENT =
  "REGISTER_VERIFICATION_CODE_SENT";
export const EMAIL_UPDATE_VERIFICATION_CODE_SENT =
  "EMAIL_UPDATE_VERIFICATION_CODE_SENT";

/**
 * 4xx Client Error
 * ---------------------------------------------
 * 400 Bad Request // 유효하지 않은 요청
 * 401 Unauthorized // 사용자 검증 실패
 * 403 Forbidden // 사용자 접근 거부
 * 404 Not Found // 리소스 없음
 * 409 Conflict // 데이터 상태가 충돌되는 요청
 * ---------------------------------------------
 */

/**
 * @code 400 Bad Request
 */
export const FIELD_REQUIRED = (field: string) =>
  `${field.toUpperCase()}_REQUIRED`;
/**
 * @code 400 Bad Request
 */
export const FIELD_INVALID = (field: string) =>
  `${field.toUpperCase()}_INVALID`;

/**
 * @code 403 Forbidden
 */
export const NOT_LOGGED_IN = "NOT_LOGGED_IN";
export const ALREADY_LOGGED_IN = "ALREADY_LOGGED_IN";
export const NOT_PERMITTED = "NOT_PERMITTED";
