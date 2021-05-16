
const request = require('supertest');

const app = require('../app'); // the express server

describe('Integration test', () => {

    let agent = request.agent(app);
    let cookie = null;
	let vendor = {
		vanID: 'Diner_Driver',
		password: '12345678',
	}

    beforeAll(() => agent
        .post('/vendor/login/auth') 
        // IMPORTANT: without the content type setting your request
        // will be ignored by express
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(vendor)
        .then((res) => {
            cookie = res
            .headers['set-cookie'][0]
            .split(',')
            .map(item => item.split(';')[0])
            .join(';')
        })
    );

    // test('Test 0: GET vendor home/login page', async () => {
	// 	return await agent
	// 	.post('/vendor/login/auth') 
    //     // IMPORTANT: without the content type setting your request
    //     // will be ignored by express
    //     .set('Content-Type', 'application/x-www-form-urlencoded')
    //     .send(vendor)
    //     .then((res) => {
    //         cookie = res
    //            .headers['set-cookie'][0]
    //            .split(',')
    //            .map(item => item.split(';')[0])
    //            .join(';')
	// 		expect(res.statusCode).toBe(200)
    //      })
	// });
  
    test('Test 1: GET vendor openvan page', async () => {
		return agent
			.get('/vendor/Diner_Driver')
			.set('Cookie', cookie)
			.then((response) => {
			expect(response.statusCode).toBe(200)
			expect(response.type).toBe('text/html')
			});
    });

    test('Test 2: POST vendor openvan page', async () => {
      return agent
          .post('/vendor/Diner_Driver/open')
          .send({address: '169 Rathdowne St',
                  latitude: -37.802852,
                  longitude: 144.969487})
          .set('Cookie', cookie)
          .then((response) => {
              expect(response.statusCode).toBe(302)
              expect(response.text).toBe('Found. Redirecting to /vendor/Diner_Driver/orders')
              expect(response.type).toBe('text/plain')

          });
    });

    test('Test 3: GET vendor orders page', async () => {
        return agent
			.get('/vendor/Diner_Driver/orders')
			.set('Cookie', cookie)
			.then((response) => {
				expect(response.statusCode).toBe(200)
				expect(response.type).toBe('text/html')
			});
      });

    test('Test 4: GET vendor past orders page', async () => {
        return agent
			.get('/vendor/Diner_Driver/pastorders')
			.set('Cookie', cookie)
			.then((response) => {
				expect(response.statusCode).toBe(200)
				expect(response.type).toBe('text/html')
			});
      });
});