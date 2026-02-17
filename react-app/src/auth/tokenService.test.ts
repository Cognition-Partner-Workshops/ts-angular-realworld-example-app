import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getToken, saveToken, destroyToken } from './tokenService';

describe('tokenService', () => {
  let getItemSpy: ReturnType<typeof vi.spyOn>;
  let setItemSpy: ReturnType<typeof vi.spyOn>;
  let removeItemSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should export getToken, saveToken, destroyToken', () => {
    expect(typeof getToken).toBe('function');
    expect(typeof saveToken).toBe('function');
    expect(typeof destroyToken).toBe('function');
  });

  describe('getToken', () => {
    it('should retrieve token from localStorage', () => {
      const mockToken = 'test-jwt-token-123';
      getItemSpy.mockReturnValue(mockToken);
      const token = getToken();
      expect(token).toBe(mockToken);
      expect(getItemSpy).toHaveBeenCalledWith('jwtToken');
    });

    it('should return undefined when no token exists', () => {
      getItemSpy.mockReturnValue(null);
      const token = getToken();
      expect(token).toBeUndefined();
    });

    it('should handle empty string token', () => {
      getItemSpy.mockReturnValue('');
      const token = getToken();
      expect(token).toBe('');
    });

    it('should handle null token by returning undefined', () => {
      getItemSpy.mockReturnValue(null);
      const token = getToken();
      expect(token).toBeUndefined();
    });

    it('should retrieve token multiple times consistently', () => {
      const mockToken = 'consistent-token';
      getItemSpy.mockReturnValue(mockToken);
      const token1 = getToken();
      const token2 = getToken();
      const token3 = getToken();
      expect(token1).toBe(mockToken);
      expect(token2).toBe(mockToken);
      expect(token3).toBe(mockToken);
    });

    it('should handle long JWT token', () => {
      const longToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 'a'.repeat(500);
      getItemSpy.mockReturnValue(longToken);
      const token = getToken();
      expect(token).toBe(longToken);
    });

    it('should handle token with special characters', () => {
      const specialToken = 'token.with-special_chars!@#$%^&*()';
      getItemSpy.mockReturnValue(specialToken);
      const token = getToken();
      expect(token).toBe(specialToken);
    });
  });

  describe('saveToken', () => {
    it('should save token to localStorage', () => {
      const mockToken = 'new-jwt-token-456';
      saveToken(mockToken);
      expect(setItemSpy).toHaveBeenCalledWith('jwtToken', mockToken);
    });

    it('should overwrite existing token', () => {
      const oldToken = 'old-token';
      const newToken = 'new-token';
      saveToken(oldToken);
      saveToken(newToken);
      expect(setItemSpy).toHaveBeenLastCalledWith('jwtToken', newToken);
    });

    it('should handle empty string token', () => {
      saveToken('');
      expect(setItemSpy).toHaveBeenCalledWith('jwtToken', '');
    });

    it('should handle very long token', () => {
      const longToken = 'a'.repeat(1000);
      saveToken(longToken);
      expect(setItemSpy).toHaveBeenCalledWith('jwtToken', longToken);
    });

    it('should handle special characters in token', () => {
      const specialToken = 'token.with-special_chars!@#$%';
      saveToken(specialToken);
      expect(setItemSpy).toHaveBeenCalledWith('jwtToken', specialToken);
    });

    it('should handle JWT format tokens', () => {
      const jwtToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      saveToken(jwtToken);
      expect(setItemSpy).toHaveBeenCalledWith('jwtToken', jwtToken);
    });

    it('should persist token after save', () => {
      const token = 'persist-test-token';
      let stored: string | null = null;
      setItemSpy.mockImplementation((_key: string, value: string) => {
        stored = value;
      });
      getItemSpy.mockImplementation(() => stored);
      saveToken(token);
      const retrievedToken = getToken();
      expect(retrievedToken).toBe(token);
    });

    it('should handle rapid successive saves', () => {
      const tokens = ['token1', 'token2', 'token3', 'token4', 'token5'];
      tokens.forEach(token => {
        saveToken(token);
      });
      expect(setItemSpy).toHaveBeenCalledTimes(5);
      expect(setItemSpy).toHaveBeenLastCalledWith('jwtToken', tokens[tokens.length - 1]);
    });
  });

  describe('destroyToken', () => {
    it('should remove token from localStorage', () => {
      destroyToken();
      expect(removeItemSpy).toHaveBeenCalledWith('jwtToken');
    });

    it('should handle destroying non-existent token', () => {
      destroyToken();
      expect(removeItemSpy).toHaveBeenCalledWith('jwtToken');
    });

    it('should completely remove token', () => {
      let stored: string | null = 'test-token';
      getItemSpy.mockImplementation(() => stored);
      removeItemSpy.mockImplementation(() => {
        stored = null;
      });
      destroyToken();
      const token = getToken();
      expect(token).toBeUndefined();
    });

    it('should be idempotent', () => {
      destroyToken();
      destroyToken();
      destroyToken();
      expect(removeItemSpy).toHaveBeenCalledTimes(3);
    });

    it('should allow saving new token after destroy', () => {
      let stored: string | null = null;
      setItemSpy.mockImplementation((_key: string, value: string) => {
        stored = value;
      });
      removeItemSpy.mockImplementation(() => {
        stored = null;
      });
      getItemSpy.mockImplementation(() => stored);

      saveToken('first-token');
      destroyToken();
      saveToken('second-token');
      expect(getToken()).toBe('second-token');
    });
  });

  describe('Token lifecycle', () => {
    let stored: string | null;

    beforeEach(() => {
      stored = null;
      setItemSpy.mockImplementation((_key: string, value: string) => {
        stored = value;
      });
      removeItemSpy.mockImplementation(() => {
        stored = null;
      });
      getItemSpy.mockImplementation(() => stored);
    });

    it('should handle complete token lifecycle', () => {
      const token = 'lifecycle-test-token';
      saveToken(token);
      expect(getToken()).toBe(token);
      destroyToken();
      expect(removeItemSpy).toHaveBeenCalledWith('jwtToken');
      expect(getToken()).toBeUndefined();
    });

    it('should handle multiple save operations', () => {
      const tokens = ['token1', 'token2', 'token3'];
      tokens.forEach(token => {
        saveToken(token);
        expect(getToken()).toBe(token);
      });
      expect(getToken()).toBe(tokens[tokens.length - 1]);
    });

    it('should handle save after destroy', () => {
      saveToken('first-token');
      destroyToken();
      saveToken('second-token');
      expect(getToken()).toBe('second-token');
    });

    it('should handle alternating save and destroy', () => {
      saveToken('token1');
      destroyToken();
      saveToken('token2');
      destroyToken();
      saveToken('token3');
      expect(getToken()).toBe('token3');
    });
  });

  describe('Edge cases', () => {
    it('should handle token with whitespace', () => {
      const tokenWithSpaces = '  token-with-spaces  ';
      saveToken(tokenWithSpaces);
      expect(setItemSpy).toHaveBeenCalledWith('jwtToken', tokenWithSpaces);
    });

    it('should handle token with newlines', () => {
      const tokenWithNewlines = 'token\nwith\nnewlines';
      saveToken(tokenWithNewlines);
      expect(setItemSpy).toHaveBeenCalledWith('jwtToken', tokenWithNewlines);
    });

    it('should handle unicode characters in token', () => {
      const unicodeToken = 'token-with-\u00e9mojis-\ud83d\ude80-and-\u4e2d\u6587';
      saveToken(unicodeToken);
      expect(setItemSpy).toHaveBeenCalledWith('jwtToken', unicodeToken);
    });

    it('should handle numeric token', () => {
      const numericToken = '123456789';
      saveToken(numericToken);
      expect(setItemSpy).toHaveBeenCalledWith('jwtToken', numericToken);
    });

    it('should handle boolean-like token', () => {
      const booleanToken = 'true';
      saveToken(booleanToken);
      expect(setItemSpy).toHaveBeenCalledWith('jwtToken', booleanToken);
    });
  });

  describe('Security considerations', () => {
    it('should not expose token as a module-level variable', () => {
      saveToken('secret-token');
      const moduleExports = { getToken, saveToken, destroyToken };
      const exportKeys = Object.keys(moduleExports);
      expect(exportKeys).not.toContain('token');
      expect(exportKeys).not.toContain('jwtToken');
    });

    it('should store token only in localStorage', () => {
      const token = 'secure-token';
      saveToken(token);
      expect(setItemSpy).toHaveBeenCalledWith('jwtToken', token);
      expect(setItemSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle XSS-like token strings safely', () => {
      const xssToken = '<script>alert("xss")</script>';
      saveToken(xssToken);
      expect(setItemSpy).toHaveBeenCalledWith('jwtToken', xssToken);
    });
  });

  describe('Integration scenarios', () => {
    let stored: string | null;

    beforeEach(() => {
      stored = null;
      setItemSpy.mockImplementation((_key: string, value: string) => {
        stored = value;
      });
      removeItemSpy.mockImplementation(() => {
        stored = null;
      });
      getItemSpy.mockImplementation(() => stored);
    });

    it('should support authentication flow', () => {
      const loginToken = 'login-jwt-token';
      saveToken(loginToken);
      expect(getToken()).toBe(loginToken);
      const refreshedToken = 'refreshed-jwt-token';
      saveToken(refreshedToken);
      expect(getToken()).toBe(refreshedToken);
      destroyToken();
      expect(getToken()).toBeUndefined();
    });

    it('should support session management', () => {
      saveToken('session-token-1');
      expect(getToken()).toBe('session-token-1');
      saveToken('session-token-2');
      expect(getToken()).toBe('session-token-2');
      destroyToken();
      expect(removeItemSpy).toHaveBeenCalledWith('jwtToken');
    });

    it('should handle concurrent tab scenario', () => {
      stored = 'external-token';
      expect(getToken()).toBe('external-token');
      saveToken('updated-token');
      expect(getToken()).toBe('updated-token');
    });
  });
});
