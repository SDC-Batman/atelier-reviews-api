import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1,
  thresholds: {
    http_req_duration: ['med<50', 'max<50'],
  },
  // stages: [
  //   { duration: '30s', target: 1000 },
  // ],
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: '30s',
      preAllocatedVUs: 1, // how large the initial pool of VUs would be
      // maxVUs: 200, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);

export default function () {
  const product_id = getRandomInt(1, 1000000);
  http.get(`http://localhost:3000/reviews/?product_id=${product_id}`);
  sleep(1);
}
