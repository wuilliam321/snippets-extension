// import axios from 'axios';
import main from '../src/main';

// jest.mock('axios');

// describe('Form Requests', () => {
//     test('given invalid login data, should return error', () => {
//         const result = doLogin(event);
//         expect(result).toBe(false);
//     });
// });

describe('Email Form Validation', () => {
    test('given an empty email, should return false', () => {
        const result = main.isFormValid('', '12345');
        expect(result).toBe(false);
    });

    test('given an valid email, should return true', () => {
        const result = main.isFormValid('a@a.com', '12345');
        expect(result).toBe(true);
    });

    test('given an invalid email, should return false', () => {
        const result = main.isFormValid('wuilliam', '12345');
        expect(result).toBe(false);
    });

    // Addional Validation Tests
    test('given an invalid email without user, should return false', () => {
        const result = main.isFormValid('@algo.com', '12345');
        expect(result).toBe(false);
    });

    test('given an invalid email without domain, should return false', () => {
        const result = main.isFormValid('algo@.com', '12345');
        expect(result).toBe(false);
    });

    test('given an invalid email with spaces, should return false', () => {
        const result = main.isFormValid('algo espacio@.com', '12345');
        expect(result).toBe(false);
    });
});

describe('Pasword Form Validation', () => {
    test('given an empty password, should return false', () => {
        const result = main.isFormValid('a@a.com', '');
        expect(result).toBe(false);
    });

    test('given a good password and email, should return true', () => {
        const result = main.isFormValid('a@a.com', 'aoeu');
        expect(result).toBe(true);
    });
});
