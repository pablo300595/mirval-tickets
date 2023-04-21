import request from "supertest";
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from './../../nats-wrapper';

it('should return 404 if ticket does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'concert',
            price: 20
        });

    expect(response.status).toEqual(404);
});

it('should return 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.signin())
        .send({
            title: 'concert',
            price: 20
        });
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'concert',
            price: 30
        })
        .expect(401);
    
});

it('should allow an authorized user to update the ticket with valid inputs', async () => {
    const cookie = global.signin();
    
    const createRequest = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: 20
        });
    
    const id = new mongoose.Types.ObjectId(createRequest.body.id).toHexString();

    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'wrestling',
            price: 30
        });
    expect(response.status).toEqual(200);
});

it('should not allow an unauthorized user to update the ticket', async () => {
    const createRequest = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.signin())
        .send({
            title: 'concert',
            price: 20
        });
    
    const id = new mongoose.Types.ObjectId(createRequest.body.id).toHexString();

    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'wrestling',
            price: 30
        });
    expect(response.status).toEqual(401);
});

it('should return a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: 20
        })
        .expect(201);

    const id = new mongoose.Types.ObjectId(response.body.id).toHexString();
    
    await await request(app)
        .put(`/api/tickets/${id}`)
            .set('Cookie', cookie)
            .send({})
            .expect(400);
});

it('publishes an event', async () => {
    const cookie = global.signin();
    
    const createRequest = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'concert',
            price: 20
        });
    
    const id = new mongoose.Types.ObjectId(createRequest.body.id).toHexString();

    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'wrestling',
            price: 30
        });
    expect(response.status).toEqual(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});