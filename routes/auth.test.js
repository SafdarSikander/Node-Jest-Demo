import { it, describe, expect, afterAll, vi, beforeAll, beforeEach } from 'vitest';
import { registerSuccessMocking, registerFailMocking, loginSuccessMocking, loginFailMocking, getUserSuccessMocking, getUserFailMocking } from '../__mocks__/auth';
import request from 'supertest';
import { app, server } from '../index';
import { db, Database } from '../db';

vi.mock('better-sqlite3', () => {
    return {
        default: vi.fn().mockReturnValue({
            // Define mock methods for the database object
            prepare: vi.fn().mockReturnValue({
                run: vi.fn(),
            }),
            transaction: vi.fn(),
            close: vi.fn(),
        }),
    };
});


describe('Test database creation', () => {
    it('should create a new instance of the database', () => {
        expect(db).toBeDefined();
        expect(Database).toHaveBeenCalledWith('dummy.db', { verbose: console.log });
    });
});

describe('User Registration API', () => {
    it('should add a new to db and return success message and user object', async () => {
        db.prepare.mockImplementation(registerSuccessMocking)
        const user = { email: 'test@example.com', password: 'password123', name: 'John' }
        const res = await request(app)
            .post('/register')
            .send(user);
        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('User registered successfully');
        expect(res.body.user.id).toBeTruthy();
        expect(res.body.user.email).toEqual(user.email);
        expect(res.body.user.name).toEqual('John');
    });

    it('should return error with email already exists', async () => {
        db.prepare.mockImplementation(registerFailMocking)
        const user = { email: 'test@example.com', password: 'password123', name: 'John' }
        const res = await request(app)
            .post('/register')
            .send(user);
        expect(res.statusCode).toEqual(409);
        expect(res.body.message).toEqual('Email already exists');
    });
});

describe('User Login API', () => {
    it('should return user', async () => {
        db.prepare.mockImplementation(loginSuccessMocking)
        const user = { email: 'test@example.com', password: 'password123' }
        const res = await request(app)
            .post('/login')
            .send(user);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('User logged in successfully');
        expect(res.body.user.id).toBeTruthy();
        expect(res.body.user.email).toEqual(user.email);
    });

    it('should return an error message', async () => {
        db.prepare.mockImplementation(loginFailMocking)
        const user = { email: 'test@example.com', password: 'wrongpassword' }
        const res = await request(app)
            .post('/login')
            .send(user);
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Invalid credentials');

    });
});

describe('Get User API', () => {
    it('should return user\'s data', async () => {
        db.prepare.mockImplementation(getUserSuccessMocking)
        const res = await request(app).get('/users/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body.user.id).toBeDefined();
        expect(res.body.user.email).toBeDefined;
        expect(res.body.user.name).toBeDefined();
    });

    it('should return an error user not found', async () => {
        db.prepare.mockImplementation(getUserFailMocking)
        const res = await request(app).get('/users/100');
        expect(res.statusCode).toEqual(404);
        expect(res.body.message).toEqual('User not found');
    });
});


afterAll(() => {
    return server.close();
});