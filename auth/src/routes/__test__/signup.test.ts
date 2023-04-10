import request from "supertest";
import { app } from './../../app';

it('it should return a 201 status on succesful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'pabloeng05@gmail.com',
            password: '6027add04f'
        })
        .expect(201);
});

it('should returns a 400 status with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'pabloeng05',
            password: '6027add04f'
        })
        .expect(400);
});

it('should returns a 400 status with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'pabloeng05',
            password: ''
        })
        .expect(400);
});

it('should returns a 400 status with missing pass and email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400);
});

it('should not allow to register an existing user', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'pabloeng07@gmail.com',
            password: '6027add04'
        })
        .expect(201);
    
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'pabloeng07@gmail.com',
            password: '6027add04'
        })
        .expect(400);
});

it('should be set a cookie after succesful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'pabloeng07@gmail.com',
            password: '6027add04'
        })
        .expect(201);
    
    expect(response.get('Set-Cookie')).toBeDefined();
});