const { sequelize } = require('./models');

const { History, Category, Payment, User } = sequelize.models;

const categoryMockData = [
  { name: '식비' },
  { name: '생활' },
  { name: '쇼핑/뷰티' },
  { name: '교통' },
  { name: '의료/건강' },
  { name: '문화/여가' },
  { name: '미분류' },
  { name: '월급' },
  { name: '용돈' },
  { name: '기타 수입' },
];
const paymentMockData = [
  { method: '현금', UserId: 1 },
  { method: '현대카드', UserId: 1 },
];
const userMockData = {
  email: '123@naver.com',
  oauthCode: '123123',
  accessToken: 'Sdkjwk1292jf3398dj4dk',
};
const historyMockData = [
  {
    date: new Date(),
    contents: '이마트 장보기',
    amount: -30000,
    UserId: 1,
    CategoryId: 1,
    PaymentId: 1,
  },
  {
    date: new Date(),
    contents: '선크림 구매',
    amount: -23000,
    UserId: 1,
    CategoryId: 3,
    PaymentId: 2,
  },
  {
    date: new Date(),
    contents: '주유소 자차 급유',
    amount: -50000,
    UserId: 1,
    CategoryId: 2,
    PaymentId: 2,
  },
  {
    date: new Date('2021-06-25 13:45:26'),
    contents: '토너 구매',
    amount: -18000,
    UserId: 1,
    CategoryId: 3,
    PaymentId: 2,
  },
  {
    date: new Date('2021-05-10 20:25:26'),
    contents: '향수 구매',
    amount: -23000,
    UserId: 1,
    CategoryId: 3,
    PaymentId: 2,
  },
  {
    date: new Date('2021-06-12 13:45:26'),
    contents: '마스크 삼',
    amount: -5000,
    UserId: 1,
    CategoryId: 3,
    PaymentId: 1,
  },
  {
    date: new Date('2021-06-2 13:45:26'),
    contents: '흉터 제거 밴드 삼',
    amount: -40000,
    UserId: 1,
    CategoryId: 3,
    PaymentId: 1,
  },
  {
    date: new Date('2021-02-15 14:20:33'),
    contents: '치실 삼',
    amount: -3600,
    UserId: 1,
    CategoryId: 3,
    PaymentId: 1,
  },
  {
    date: new Date('2021-02-13 14:20:33'),
    contents: '치실 삼',
    amount: 3600,
    UserId: 1,
    CategoryId: 3,
    PaymentId: 1,
  },
];

// console.log(sequelize)

async function init() {
  await Category.bulkCreate(categoryMockData);
  console.log('categories 테이블 초기화');
  await User.create(userMockData);
  console.log('users 테이블 초기화');
  await Payment.bulkCreate(paymentMockData);
  console.log('payments 테이블 초기화');
  await History.bulkCreate(historyMockData);
  console.log('history 테이블 초기화');
}

init();
