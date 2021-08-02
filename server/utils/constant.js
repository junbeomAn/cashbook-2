const LOGIN_SUCCESS = '로그인에 성공하였습니다';

const HISTORIES_FETCH_SUCCESS = 'histories 조회 완료';
const HISTORIES_POST_SUCCESS = '내역 추가 완료';
const HISTORIES_PUT_SUCCESS = '내역 수정 완료';
const HISTORIES_BY_CATEGORY_FETCH_SUCCESS = (categoryId) => `카테고리 id: ${categoryId}, 월별 지출 histories 조회 완료`;

const PAYMENT_FETCH_SUCCESS = '결제수단 조회 완료'
const PAYMENT_POST_SUCCESS = '결제수단 등록 완료';
const PAYMENT_DELETE_SUCCESS = '결제수단 삭제 완료';

module.exports = {
  LOGIN_SUCCESS,
  HISTORIES_FETCH_SUCCESS,
  HISTORIES_POST_SUCCESS,
  HISTORIES_PUT_SUCCESS,
  HISTORIES_BY_CATEGORY_FETCH_SUCCESS,
  PAYMENT_DELETE_SUCCESS,
  PAYMENT_POST_SUCCESS,
  PAYMENT_FETCH_SUCCESS
}