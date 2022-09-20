// import { URLSearchParams } from 'https://jslib.k6.io/url/1.0.0/index.js';
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  // vus: 1,
  thresholds: {
    http_req_duration: ['max<2000'],
    http_req_failed: ['rate<0.01'],
  },
  stages: [
    { duration: '30s', target: 100 }, // 1000 per sec
  ],
};

// const API_BASE_URL = 'http://localhost:3000/reviews';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

export default function () {
  const product_id = getRandomInt(1, 1000000);
  const response = http.get(`http://localhost:3000/reviews/?product_id=${product_id}`);
  // http.get(`http://localhost:3000/reviews/meta/?product_id=${product_id}`);

  // per VU, iterations (i.e. requests) per second
  check(response, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}
