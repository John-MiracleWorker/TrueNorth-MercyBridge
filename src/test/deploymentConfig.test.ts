import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const deployWorkflow = readFileSync(
  resolve(process.cwd(), '.github/workflows/deploy.yml'),
  'utf8',
);
const ciWorkflowPath = resolve(process.cwd(), '.github/workflows/ci.yml');

const wranglerConfig = JSON.parse(
  readFileSync(resolve(process.cwd(), 'wrangler.jsonc'), 'utf8'),
) as { name: string };

describe('Cloudflare deployment configuration', () => {
  it('targets the configured Pages project and custom production domain', () => {
    expect(deployWorkflow).toContain(`--project-name=${wranglerConfig.name}`);
    expect(deployWorkflow).toContain('https://mercybridge.find-true-north.net');
    expect(deployWorkflow).not.toContain('https://mercybridge.pages.dev');
  });

  it('runs deterministic quality gates on pull requests before merge', () => {
    expect(existsSync(ciWorkflowPath)).toBe(true);

    const ciWorkflow = readFileSync(ciWorkflowPath, 'utf8');
    expect(ciWorkflow).toContain('pull_request:');
    expect(ciWorkflow).toContain('npm ci');
    expect(ciWorkflow).toContain('npm run lint');
    expect(ciWorkflow).toContain('npm run typecheck');
    expect(ciWorkflow).toContain('npm test');
    expect(ciWorkflow).toContain('npm run build');
    expect(ciWorkflow).toContain('npm audit --omit=dev --audit-level=moderate');
    expect(ciWorkflow).toContain('VITE_SUPABASE_PUBLISHABLE_KEY');
    expect(ciWorkflow).toContain(
      'VITE_TRUENORTH_URL: https://www.find-true-north.net',
    );
    expect(ciWorkflow).not.toContain('VITE_SUPABASE_ANON_KEY');
  });
});
