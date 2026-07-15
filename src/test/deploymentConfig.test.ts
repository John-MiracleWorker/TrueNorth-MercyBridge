import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const deployWorkflow = readFileSync(
  resolve(process.cwd(), '.github/workflows/deploy.yml'),
  'utf8',
);
const ciWorkflowPath = resolve(process.cwd(), '.github/workflows/ci.yml');
const mercyBridgeApiSource = readFileSync(
  resolve(process.cwd(), 'src/services/mercybridgeApi.ts'),
  'utf8',
);
const requestHelpSource = readFileSync(
  resolve(process.cwd(), 'src/pages/RequestHelp.tsx'),
  'utf8',
);
const needDetailSource = readFileSync(
  resolve(process.cwd(), 'src/pages/NeedDetail.tsx'),
  'utf8',
);
const proofUploadSource = readFileSync(
  resolve(process.cwd(), 'src/components/ProofUploadModal.tsx'),
  'utf8',
);

function readTypeScriptSources(directory: string): Array<{ path: string; source: string }> {
  const sources: Array<{ path: string; source: string }> = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      sources.push(...readTypeScriptSources(path));
    } else if (/\.tsx?$/u.test(entry.name)) {
      sources.push({ path, source: readFileSync(path, 'utf8') });
    }
  }
  return sources;
}

const applicationSources = readTypeScriptSources(resolve(process.cwd(), 'src'));
const directNeedUpdatePattern =
  /\.from\(\s*['"]mercybridge_needs['"]\s*\)(?:(?!;)[\s\S])*?\.update\(/u;

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

  it('routes privileged writes through reviewed RPCs and private signed storage URLs', () => {
    expect(mercyBridgeApiSource).toContain(".rpc('mercybridge_create_need'");
    expect(mercyBridgeApiSource).toContain('p_idempotency_key: payload.idempotency_key');
    expect(requestHelpSource).toContain('submissionIdempotencyKey');
    expect(requestHelpSource).toContain('crypto.randomUUID()');
    expect(requestHelpSource).toContain('`${submissionKey}-bill-${index}`');
    expect(needDetailSource).toContain('additionalDocumentsIdempotencyKey');
    expect(mercyBridgeApiSource).toContain('`${payload.idempotency_key}-additional-${index}`');
    expect(proofUploadSource).toContain('proofSubmissionIdempotencyKey');
    expect(proofUploadSource).toContain('`${submissionKey}-payment-proof`');
    expect(mercyBridgeApiSource).toContain(".rpc('mercybridge_review_need'");
    expect(mercyBridgeApiSource).toContain(".rpc('mercybridge_mark_need_paid'");
    expect(mercyBridgeApiSource).toContain(".rpc('mercybridge_submit_additional_documents'");
    expect(mercyBridgeApiSource).toContain(".rpc('mercybridge_set_need_payee_match'");
    expect(mercyBridgeApiSource).toContain(".rpc('mercybridge_get_need_private_documents'");
    expect(mercyBridgeApiSource).toContain('.createSignedUrl(');
    expect(mercyBridgeApiSource).not.toContain('.getPublicUrl(');
    expect(mercyBridgeApiSource).not.toContain(
      'document_storage_paths: payload.document_storage_paths',
    );
    const unsafeSources = applicationSources
      .filter(({ source }) => directNeedUpdatePattern.test(source))
      .map(({ path }) => path);
    expect(unsafeSources).toEqual([]);
  });
});
