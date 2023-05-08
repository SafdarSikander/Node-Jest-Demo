import { it, describe, expect, afterAll, vi, beforeAll, beforeEach } from 'vitest';
// import { registerMocking } from '../__mocks__/auth';
import request from 'supertest';
import { app, server } from '../index';
import Database from 'better-sqlite3';

vi.mock('better-sqlite3', () => {
    const mockDb = {
        // Define mock methods for the database object
        prepare: vi.fn(),
        transaction: vi.fn(),
        close: vi.fn(),
    };
    const mockBetterSqlite3 = {
        // Define mock methods for the module
        default: vi.fn().mockReturnValue(mockDb),
    };
    return mockBetterSqlite3;
});


vi.mock('better-sqlite3', () => {
    return {
        default: vi.fn().mockReturnValue({
            // Define mock methods for the database object
            prepare: vi.fn(),
            transaction: vi.fn(),
            close: vi.fn(),
        }),
    };
});


describe('Test database creation', () => {
    it('should create a new instance of the database', () => {
        const db = new Database('dummy.db', { verbose: console.log });
        expect(db).toBeDefined();
        expect(Database).toHaveBeenCalledWith('dummy.db', { verbose: console.log });
    });
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


afterAll(() => {
    return server.close();
});