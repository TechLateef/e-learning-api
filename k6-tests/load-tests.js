import http from 'k6/http'
import { check, sleep } from 'k6';

export const options = {
    stages: [
        {duration: '1m', target:2},
        {duration: '5m', target:5},
        {duration: '1m', target:0}

    ],
};

export default function () {
    const url = 'http://localhost:3000/api/v1/auth/login';
    const payload = JSON.stringify({
        email:'test2@test.com',
        password: 'password',
    });
    const params = {
        headers: {
            'Content-Type': 'application/json',

        }
    };

    const res = http.post(url, payload, params);
    check(res, {
        'is status 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500
    });
    sleep(1);
}