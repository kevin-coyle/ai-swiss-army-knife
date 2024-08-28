import { describe, it, expect } from 'bun:test';
import listDirectory from '../functions/listDirectory';

describe('listDirectory', () => {
  it('should return an array of files in the directory', () => {
    const directoryPath = './'; // Specify a valid directory path
    const options = JSON.stringify({ directory: directoryPath });
    const result = listDirectory(options);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return an error message for an invalid directory', () => {
    const invalidDirectoryPath = './invalid-directory';
    const options = JSON.stringify({ directory: invalidDirectoryPath });
    const result = listDirectory(options);
    expect(result).toContain('Error:');
  });
});
