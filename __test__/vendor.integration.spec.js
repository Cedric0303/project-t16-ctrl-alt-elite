
const request = require('supertest');
const assert = require('assert');

const app = require('../app'); // the express server

jest.setTimeout(10000)

describe('#1 Integration test (logged in)', () => {

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
            token = res.headers['set-cookie'][0].split(';')
            cookie = token[0]
        })
    );

    test('Test 1: GET vendor home/login page', async () => {
		return agent
			.get('/vendor')
			// .set('Cookie', cookie)
			.then((response) => {
                expect(response.statusCode).toBe(200)
                expect(response.type).toBe('text/html')
                assert(response.text.includes('Snacks in a Van'))
			});
    });
  
    test('Test 2: GET vendor open van', async () => {
		return agent
			.get('/vendor/Diner_Driver')
			.set('Cookie', cookie)
			.then((response) => {
                expect(response.statusCode).toBe(200)
                expect(response.type).toBe('text/html')
                assert(response.text.includes('Welcome!'))
                assert(response.text.includes('Diner Driver'))
                assert(response.text.includes('GPS Location:'))
			});
    });

    test('Test 3: GET vendor close van', async () => {
        return agent
			.get('/vendor/Diner_Driver/close')
			.set('Cookie', cookie)
			.then((response) => {
				expect(response.statusCode).toBe(302)
				expect(response.type).toBe('text/plain')
                expect(response.text).toBe('Found. Redirecting to /vendor/Diner_Driver')
        });
    });

    test('Test 4: POST vendor open van', async () => {
      return agent
          .post('/vendor/Diner_Driver/open')
          .send({address: '169 Rathdowne St',
                  latitude: -37.802852,
                  longitude: 144.969487})
          .set('Cookie', cookie)
          .then((response) => {
                expect(response.statusCode).toBe(302)
                expect(response.type).toBe('text/plain')
                expect(response.text).toBe('Found. Redirecting to /vendor/Diner_Driver/orders')
          });
    });

    test('Test 5: GET vendor orders', async () => {
        return agent
			.get('/vendor/Diner_Driver/orders')
			.set('Cookie', cookie)
			.then((response) => {
				expect(response.statusCode).toBe(200)
				expect(response.type).toBe('text/html')
                assert(response.text.includes('Orders'))
                assert(response.text.includes('Close Van'))
			});
    });

    test('Test 6: GET vendor past orders', async () => {
        return agent
			.get('/vendor/Diner_Driver/pastorders')
			.set('Cookie', cookie)
			.then((response) => {
				expect(response.statusCode).toBe(200)
				expect(response.type).toBe('text/html')
        });
    });
    
    test('Test 7: GET vendor logout', async () => {
        return agent
			.get('/vendor/Diner_Driver/logout')
			.set('Cookie', cookie)
			.then((response) => {
				expect(response.statusCode).toBe(302)
				expect(response.type).toBe('text/plain')
                expect(response.text).toBe('Found. Redirecting to /vendor')
        });
    });
});

describe('#2 Integration test (not logged in)', () => {

    let agent = request.agent(app);

    test('Test 1: GET vendor home/login page', async () => {
		return agent
			.get('/vendor')
			.then((response) => {
                expect(response.statusCode).toBe(200)
                expect(response.type).toBe('text/html')
                assert(response.text.includes('Snacks in a Van'))
			});
    });
  
    test('Test 2: GET vendor open van', async () => {
		return agent
			.get('/vendor/Diner_Driver')
			.then((response) => {
                expect(response.statusCode).toBe(402)
                expect(response.type).toBe('text/html')
                assert(response.text.includes('Not logged in!'))
			});
    });

    test('Test 3: GET vendor close van', async () => {
        return agent
			.get('/vendor/Diner_Driver/close')
			.then((response) => {
				expect(response.statusCode).toBe(402)
                expect(response.type).toBe('text/html')
                assert(response.text.includes('Not logged in!'))
        });
    });

    test('Test 4: POST vendor open van', async () => {
      return agent
          .post('/vendor/Diner_Driver/open')
          .send({address: '169 Rathdowne St',
                  latitude: -37.802852,
                  longitude: 144.969487})
          .then((response) => {
            expect(response.statusCode).toBe(402)
            expect(response.type).toBe('text/html')
            assert(response.text.includes('Not logged in!'))
          });
    });

    test('Test 5: GET vendor orders', async () => {
        return agent
			.get('/vendor/Diner_Driver/orders')
			.then((response) => {
				expect(response.statusCode).toBe(402)
                expect(response.type).toBe('text/html')
                assert(response.text.includes('Not logged in!'))
			});
    });

    test('Test 6: GET vendor past orders', async () => {
        return agent
			.get('/vendor/Diner_Driver/pastorders')
			.then((response) => {
				expect(response.statusCode).toBe(402)
                expect(response.type).toBe('text/html')
                assert(response.text.includes('Not logged in!'))
        });
    });
    
    test('Test 7: GET vendor logout', async () => {
        return agent
			.get('/vendor/Diner_Driver/logout')
			.then((response) => {
				expect(response.statusCode).toBe(402)
                expect(response.type).toBe('text/html')
                assert(response.text.includes('Not logged in!'))
        });
    });
});