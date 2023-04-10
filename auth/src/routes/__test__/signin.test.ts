import request from "supertest";
import { app } from './../../app';

it("should be able to fail when an email that does not exist is supplied", async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(400);  
});

it("should be able to fail when an incorrect password is supplied", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: '123456'
        })
        .expect(400);
});

it("should be able to responds with an cookie when given valid credentials", async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: '1234'
        })
        .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
});
