import request from "supertest";
import { app } from '../../app';
import mongoose from 'mongoose';

it('should fail if ticket does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()

    const response = await request(app)
        .get(`/api/tickets/${id}`)
        .send();

    expect(response.status).toEqual(404);
});

it('returs the ticket is the ticket is found', async () => {
    const title = 'concert';
    const price = 50;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title,
            price
        })
        .expect(201);
    
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send();
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
})