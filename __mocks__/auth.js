import {  vi } from 'vitest';

const mockStmt1 = { get: vi.fn(() => null) };
const mockStmt2 = { run: vi.fn(() => ({ changes: 1, lastInsertRowid: 1 })) };
const mockStmt3 = { get: vi.fn(() => ({ id: 1, name: 'John', email: 'test@example.com' })) };
const registerMocking = () => ({
    prepare: vi.fn((query) => {
        if (query.includes('SELECT * FROM users WHERE email')) {
            return mockStmt1;
        } else if (query.includes('INSERT INTO users')) {
            return mockStmt2;
        } else if (query.includes('SELECT * FROM users WHERE id')) {
            return mockStmt3;
        }
    })
});
export { registerMocking };