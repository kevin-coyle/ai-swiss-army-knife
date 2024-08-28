# Contribution Guidelines for @big-medium/swiss-army-knife

Thank you for your interest in contributing to the `@big-medium/swiss-army-knife` project! This document provides detailed instructions on how to add new functions, tests, and contribute effectively to the project.

## Adding a New Function
To add a new function to the project, follow these steps:

### 1. Create Function File
- Navigate to the `functions/` directory.
- Create a new TypeScript file for your function, following the naming convention of `functionName.ts`. For example, if you are adding a function named `calculate`, create a file named `calculate.ts`.

### 2. Write the Function Code
Inside your new file, write the code for your function. Here's a template:
```typescript
function functionName(options: string) {
  // Parse options
  const { key1, key2 } = JSON.parse(options);

  // Your function logic here

  // Return the result
  return result;
}

export default functionName;
```
- Be sure to include error handling to manage any potential issues gracefully.

### 3. Update `index.ts`
Open `index.ts` in the `functions/` directory and import your new function:
```typescript
export { default as functionName } from "./functionName";
```
This allows other parts of the project to access your function.

## Adding Tests
To ensure that your new function works correctly, you should add unit tests:

### 1. Create a Test File
- Navigate to the `tests/` directory.
- Create a new test file named `functionName.test.ts`, matching the name of your function file.

### 2. Write Tests
Inside your test file, write tests for your function:
```typescript
import { describe, it, expect } from 'bun:test';
import functionName from '../functions/functionName';

describe('functionName', () => {
  it('should return expected result for valid input', () => {
    const options = JSON.stringify({ key1: 'value1', key2: 'value2' });
    const result = functionName(options);
    expect(result).toEqual(expectedResult);
  });

  it('should handle errors gracefully', () => {
    const options = JSON.stringify({ key1: null }); // Invalid input
    const result = functionName(options);
    expect(result).toContain('Error:'); // Adjust based on your error handling
  });
});
```

### 3. Run Your Tests
Run the tests for your changes using:
```bash
bun test
```
Ensure that all tests pass before proceeding.

## Documentation
If necessary, update the documentation (README.md) to include details about your new function, its parameters, and usage examples.

## Submitting Your Changes
Once you have added your function and tests, create a pull request:
1. Commit your changes:
   ```bash
   git add .
   git commit -m "Add functionName function and tests"
   ```
2. Push to your branch:
   ```bash
   git push origin your-feature-branch
   ```
3. Open a pull request and describe what changes you made and why.

## Conclusion
By following these steps, you can contribute new functionality to the `@big-medium/swiss-army-knife` project effectively. We look forward to your contributions!
