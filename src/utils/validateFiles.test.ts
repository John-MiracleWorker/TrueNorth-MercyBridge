import { describe, it, expect } from 'vitest';
import { validateFiles, MAX_FILE_SIZE } from './validateFiles';

describe('validateFiles', () => {
  const allowedTypes = ['image/jpeg', 'application/pdf'];
  const maxCount = 2;
  const label = 'Test label';

  it('should return null when no files are provided', () => {
    const result = validateFiles([], allowedTypes, maxCount, label);
    expect(result).toBeNull();
  });

  it('should return an error when the number of files exceeds maxCount', () => {
    const files = [
      new File([''], 'file1.jpg', { type: 'image/jpeg' }),
      new File([''], 'file2.jpg', { type: 'image/jpeg' }),
      new File([''], 'file3.jpg', { type: 'image/jpeg' }),
    ];
    const result = validateFiles(files, allowedTypes, maxCount, label);
    expect(result).toBe(`${label}: maximum ${maxCount} files allowed.`);
  });

  it('should return an error when a file has an invalid type', () => {
    const files = [
      new File([''], 'file1.txt', { type: 'text/plain' }),
    ];
    const result = validateFiles(files, allowedTypes, maxCount, label);
    expect(result).toBe(`${label}: "file1.txt" is not an allowed file type. Allowed: jpeg, pdf.`);
  });

  it('should return an error when a file exceeds the size limit', () => {
    const file = new File([''], 'large_file.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: MAX_FILE_SIZE + 1 });
    const files = [file];
    const result = validateFiles(files, allowedTypes, maxCount, label);
    expect(result).toBe(`${label}: "large_file.pdf" exceeds 10MB limit.`);
  });

  it('should return null when files are valid', () => {
    const files = [
      new File([''], 'file1.jpg', { type: 'image/jpeg' }),
      new File([''], 'file2.pdf', { type: 'application/pdf' }),
    ];
    // By default, File size is 0
    const result = validateFiles(files, allowedTypes, maxCount, label);
    expect(result).toBeNull();
  });
});
