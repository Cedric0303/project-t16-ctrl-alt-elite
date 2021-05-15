
const request = require('supertest');

const app = require('../app'); // the express server


describe('Integration test', () => {

    let agent = request.agent(app);
    let cookie = null;

    beforeAll(() => agent
        // send a POST request to login
        .post('/vendor/login/auth') 
        // IMPORTANT: without the content type setting your request
        // will be ignored by express
        .set('Content-Type', 'text/json')
        .send({
          vanID: 'Diner_Driver',
          password: '12345678',
        })
        .then((res) => {
            cookie = res
               .headers['set-cookie'][0]
               .split(',')
               .map(item => item.split(';')[0])
               .join(';')
         }));
  
    test('Test 1', () => {
      return agent
        .get('/vendor/Diner_Driver')
        .set('Cookie', cookie)
        .then((response) => {
          expect(response.statusCode).toBe(200);
        });
    });
});