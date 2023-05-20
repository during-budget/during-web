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
export const FIELD_MISSING = (field: string) =>
  `${field.toUpperCase()}_MISSING`;
/**
 * @code 400 Bad Request
 */
export const FIELD_INVALID = (field: string) =>
  `${field.toUpperCase()}_INVALID`;
