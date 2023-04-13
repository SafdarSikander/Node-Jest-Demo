import { it, describe, expect, afterAll } from 'vitest';
const request = require('supertest');
const { app, server } = require('../index');

afterAll(() => {
    return server.close();
});

describe('User Registration API', () => {

    it('should add a new user to the local array and return success message and user object', async () => {

        const res = await request(app)
            .post('/register')
            .send({ email: 'test@example.com', password: 'password123', name: 'John' });

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('User registered successfully');
        expect(res.body.user.id).toBeTruthy();
        expect(res.body.user.email).toEqual('test@example.com');
        expect(res.body.user.password).toEqual('password123');
        expect(res.body.user.name).toEqual('John');
    });
});

describe('User Login API', () => {

    it('should return user data if credentials are valid', async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('User logged in successfully');
        expect(res.body.user.id).toEqual('abc123');
        expect(res.body.user.email).toEqual('test@example.com');
        expect(res.body.user.password).toEqual('password123');
        expect(res.body.user.name).toEqual('John');

    });

    it('should return an error message if credentials are invalid', async () => {
        const res = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Invalid credentials');

    });
});

describe('Get User API', () => {
    it('should return user data if user ID is found', async () => {
        const res = await request(app).get('/users/abc123');

        expect(res.statusCode).toEqual(200);
        expect(res.body.user.id).toEqual('abc123');
        expect(res.body.user.email).toEqual('test@example.com');
        expect(res.body.user.password).toEqual('password123');
        expect(res.body.user.name).toEqual('John');

    });

    it('should return an error message if user ID is not found', async () => {
        const res = await request(app).get('/users/def456');

        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('User not found');

    });
});
