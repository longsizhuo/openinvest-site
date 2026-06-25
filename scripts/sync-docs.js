import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const projectRoot = path.resolve(__dirname, '..');
const localInvestDocs = path.resolve(projectRoot, '../invest/docs/wiki');
const targetDocsDir = path.resolve(projectRoot, 'public/docs/wiki');
const indexFile = path.resolve(projectRoot, 'src/data/docsIndex.ts');

function syncDocs() {
  console.log('Starting documentation synchronization...');

  // Clean up and recreate target directory
  if (fs.existsSync(targetDocsDir)) {
    fs.rmSync(targetDocsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(targetDocsDir, { recursive: true });

  // 1. Sync files
  if (fs.existsSync(localInvestDocs)) {
    console.log(`Syncing from local directory: ${localInvestDocs}`);
    fs.cpSync(localInvestDocs, targetDocsDir, { recursive: true, force: true });
  } else {
    console.log('Local invest repository not found. Downloading from GitHub...');
    try {
      execSync(
        `curl -L -s https://github.com/longsizhuo/openInvest/tarball/main | tar -xz -C "${path.resolve(projectRoot, 'public/docs')}" --strip-components=2 --wildcards "*/docs/wiki"`,
        { stdio: 'inherit' }
      );
      console.log('Successfully downloaded and extracted wiki files.');
    } catch (err) {
      console.error('Failed to download documents from GitHub:', err.message);
      if (fs.existsSync(path.resolve(projectRoot, 'public/docs/wiki'))) {
        console.log('Using existing public/docs/wiki files as fallback.');
      } else {
        throw new Error('No local invest repo found and failed to download docs from remote.');
      }
    }
  }

  // 2. Scan files and build index
  const docs = [];

  function scanDir(dir, category) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (file === 'adr') {
          scanDir(fullPath, 'adr');
        }
      } else if (file.endsWith('.md') && file !== 'README.md') {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const slug = path.basename(file, '.md');
        const info = parseFrontmatter(content);
        
        docs.push({
          slug,
          title: info.title || slug,
          intent: info.intent || '',
          category: category,
        });
      }
    }
  }

  scanDir(targetDocsDir, 'wiki');

  // Sort files: wiki first, then adr. Within each, sort alphabetically/numerically by slug
  docs.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category === 'wiki' ? -1 : 1;
    }
    return a.slug.localeCompare(b.slug, undefined, { numeric: true, sensitivity: 'base' });
  });

  // 3. Write index file
  const indexContent = `// Generated index of wiki chapters and ADRs
export interface DocIndexItem {
  slug: string;
  title: string;
  intent: string;
  category: 'wiki' | 'adr';
}

export const DOCS_INDEX: DocIndexItem[] = ${JSON.stringify(docs, null, 2)};
`;

  fs.mkdirSync(path.dirname(indexFile), { recursive: true });
  fs.writeFileSync(indexFile, indexContent, 'utf-8');
  console.log(`Generated docs index at ${indexFile} with ${docs.length} entries.`);
}

function parseFrontmatter(content) {
  const result = {};
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (match) {
    const yamlLines = match[1].split('\n');
    for (const line of yamlLines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        let val = line.slice(colonIndex + 1).trim();
        // Remove surrounding quotes if any
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        result[key] = val;
      }
    }
  }
  return result;
}

try {
  syncDocs();
} catch (error) {
  console.error('Docs synchronization failed:', error);
  process.exit(1);
}
