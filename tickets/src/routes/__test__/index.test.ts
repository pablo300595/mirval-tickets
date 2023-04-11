import request from "supertest";
import { app } from '../../app';
import { Ticket } from './../../models/ticket';

it('should return all tickets', async () => {
    let title = 'concert';
    let price = 50;

    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({ title, price })
        .expect(201);

    title = 'concert';
    price = 60;
    
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({ title, price })
        .expect(201);
    
    const response = await request(app)
    .get('/api/tickets/')
    .send();

    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(2);
})