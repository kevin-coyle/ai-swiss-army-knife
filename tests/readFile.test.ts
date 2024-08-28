import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import fs from 'fs';
import readFile from '../functions/readFile';

describe('readFile', () => {
  const testFileName = 'testFile.txt';

  beforeAll(() => {
    // Create a test file before the tests
    fs.writeFileSync(testFileName, 'Hello, World!');
  });

  afterAll(() => {
    // Clean up the test file after all tests
    fs.unlinkSync(testFileName);
  });

  it('should read a file and return its content', () => {
    const options = JSON.stringify({ fileName: testFileName });
    const result = readFile(options);
    expect(result).toBe('Hello, World!');
  });

  it('should return an error message if the file does not exist', () => {
    const options = JSON.stringify({ fileName: 'nonexistent.txt' });
    const result = readFile(options);
    expect(result).toBe('File does not exist or is not readable');
  });
});