import { vi } from 'vitest';

// TODO: Find the better way to creating mocking
const mockStmt1 = { get: vi.fn(() => null) };
const mockStmt2 = { run: vi.fn(() => ({ changes: 1, lastInsertRowid: 1 })) };
const mockStmt3 = { get: vi.fn(() => ({ id: 1, name: 'John', email: 'test@example.com' })) };

const registerSuccessMocking = (query) => {
    if (query.includes('SELECT * FROM users WHERE email')) {
        return mockStmt1;
    } else if (query.includes('INSERT INTO users')) {
        return mockStmt2;
    } else if (query.includes('SELECT * FROM users WHERE id')) {
        return mockStmt3;
    }
};

const registerFailMocking = () => mockStmt3

const loginSuccessMocking = () => mockStmt3;

const loginFailMocking = () => mockStmt1

const getUserSuccessMocking = () => mockStmt3

const getUserFailMocking = () => mockStmt1

export { registerSuccessMocking, registerFailMocking, loginSuccessMocking, loginFailMocking, getUserSuccessMocking, getUserFailMocking };