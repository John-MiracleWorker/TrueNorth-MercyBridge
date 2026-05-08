🧪 [testing improvement] Extract and test `validateFiles`

🎯 **What:** The `validateFiles` function in `src/pages/RequestHelp.tsx` was a pure function without tests. We extracted it into `src/utils/validateFiles.ts` and wrote an exhaustive test suite using vitest. We also installed and configured vitest to work in the environment.

📊 **Coverage:** The following scenarios are now covered:
- Validations that result in a success when no files are provided.
- Validations that result in an error when the maximum file count limit is exceeded.
- Validations that result in an error when a file has an invalid type.
- Validations that result in an error when a file is too large.
- Validations that result in a success when valid files are provided.

✨ **Result:** Increased testing coverage and robustness of the file validation functionality.
