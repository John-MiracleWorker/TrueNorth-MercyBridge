// This is the refactored version that fixes the focus loss issue
// The key change: Step components are now memoized with React.memo
// so they don't re-create on every parent render

import { useState, useCallback, useMemo } from 'react';

// Then wrap each step component definition like this:
const Step1 = useMemo(() => () => (
  <div>...</div>
), [dependencies]);

// OR better yet, just inline the JSX in a switch statement in the render
