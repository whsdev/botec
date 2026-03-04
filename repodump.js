import fs from 'fs';
import path from 'path';  // Fixed: was 'fs' before
import { fileURLToPath } from 'url';

// Get current directory (ES modules equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  outputFile: 'repodump.txt',
  includeExtensions: ['.jsx', '.js', '.json', '.css', '.html', '.md'],
  excludeDirs: ['node_modules', 'dist', 'build', '.git', '.vscode'],
  excludeFiles: ['repodump.js', 'repodump.txt', 'package-lock.json'],
  maxFileSize: 1024 * 1024, // 1MB max file size
  includeGitignore: true // Respect .gitignore patterns
};

// Store for gitignore patterns if needed
let gitignorePatterns = [];

// Load .gitignore patterns
function loadGitignorePatterns() {
  try {
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const content = fs.readFileSync(gitignorePath, 'utf8');
      gitignorePatterns = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'))
        .map(pattern => {
          // Convert simple glob patterns to regex-like checks
          return (filePath) => {
            const relativePath = path.relative(process.cwd(), filePath);
            if (pattern.endsWith('/')) {
              return relativePath.includes(pattern.slice(0, -1));
            }
            if (pattern.includes('*')) {
              const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
              return new RegExp(regexPattern).test(relativePath);
            }
            return relativePath.includes(pattern);
          };
        });
    }
  } catch (error) {
    console.log('No .gitignore file found or error reading it');
  }
}

// Check if file should be excluded based on gitignore
function isGitignored(filePath) {
  if (!CONFIG.includeGitignore) return false;
  return gitignorePatterns.some(matcher => matcher(filePath));
}

// Check if file should be included based on extension
function hasValidExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return CONFIG.includeExtensions.includes(ext);
}

// Check if directory should be excluded
function isExcludedDir(dirPath) {
  const relativePath = path.relative(process.cwd(), dirPath);
  return CONFIG.excludeDirs.some(excluded => 
    relativePath.split(path.sep).includes(excluded)
  );
}

// Check if file should be excluded by name
function isExcludedFile(fileName) {
  return CONFIG.excludeFiles.includes(fileName);
}

// Format file size
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Generate folder tree structure
function generateFolderTree(dir, prefix = '', isLast = true, tree = []) {
  const items = fs.readdirSync(dir);
  const filteredItems = items.filter(item => {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      return !isExcludedDir(itemPath) && !isGitignored(itemPath);
    } else {
      const ext = path.extname(item).toLowerCase();
      return hasValidExtension(itemPath) && 
             !isExcludedFile(item) && 
             !isGitignored(itemPath) &&
             stats.size <= CONFIG.maxFileSize;
    }
  });

  filteredItems.forEach((item, index) => {
    const isLastItem = index === filteredItems.length - 1;
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    const linePrefix = prefix + (isLast ? '    ' : '│   ');
    const marker = isLastItem ? '└── ' : '├── ';
    
    if (stats.isDirectory()) {
      tree.push(prefix + marker + '📁 ' + item + '/');
      generateFolderTree(itemPath, linePrefix, isLastItem, tree);
    } else {
      const size = formatFileSize(stats.size);
      tree.push(prefix + marker + '📄 ' + item + ` (${size})`);
    }
  });

  return tree;
}

// Collect all files for content dumping
function collectFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      if (!isExcludedDir(itemPath) && !isGitignored(itemPath)) {
        collectFiles(itemPath, fileList);
      }
    } else {
      const ext = path.extname(item).toLowerCase();
      if (hasValidExtension(itemPath) && 
          !isExcludedFile(item) && 
          !isGitignored(itemPath) &&
          stats.size <= CONFIG.maxFileSize) {
        fileList.push(itemPath);
      }
    }
  }

  return fileList;
}

// Read file content safely
function readFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    return `[ERROR READING FILE: ${error.message}]`;
  }
}

// Generate the repository dump
async function generateRepoDump() {
  console.log('📦 Generating repository dump...');
  
  // Load gitignore patterns if enabled
  if (CONFIG.includeGitignore) {
    loadGitignorePatterns();
  }

  const rootDir = process.cwd();
  const outputPath = path.join(rootDir, CONFIG.outputFile);
  
  // Create write stream
  const writeStream = fs.createWriteStream(outputPath);
  
  // Write header
  writeStream.write('='.repeat(80) + '\n');
  writeStream.write('REPOSITORY DUMP\n');
  writeStream.write('Generated: ' + new Date().toLocaleString() + '\n');
  writeStream.write('='.repeat(80) + '\n\n');
  
  // Generate and write folder tree
  writeStream.write('📁 FOLDER STRUCTURE\n');
  writeStream.write('-'.repeat(40) + '\n');
  writeStream.write(path.basename(rootDir) + '/\n');
  
  const tree = generateFolderTree(rootDir);
  tree.forEach(line => writeStream.write(line + '\n'));
  
  writeStream.write('\n' + '='.repeat(80) + '\n\n');
  
  // Collect and write file contents
  writeStream.write('📄 FILE CONTENTS\n');
  writeStream.write('-'.repeat(40) + '\n\n');
  
  const files = collectFiles(rootDir);
  
  for (const filePath of files) {
    const relativePath = path.relative(rootDir, filePath);
    const stats = fs.statSync(filePath);
    
    writeStream.write('\n' + '─'.repeat(60) + '\n');
    writeStream.write(`FILE: ${relativePath}\n`);
    writeStream.write(`SIZE: ${formatFileSize(stats.size)}\n`);
    writeStream.write('─'.repeat(60) + '\n\n');
    
    const content = readFileContent(filePath);
    writeStream.write(content + '\n');
    
    // Add a small separator between files
    writeStream.write('\n' + '─'.repeat(40) + '\n\n');
  }
  
  // Write footer
  writeStream.write('\n' + '='.repeat(80) + '\n');
  writeStream.write(`SUMMARY\n`);
  writeStream.write('-'.repeat(40) + '\n');
  writeStream.write(`Total files processed: ${files.length}\n`);
  writeStream.write(`Output file: ${CONFIG.outputFile}\n`);
  writeStream.write('='.repeat(80) + '\n');
  
  // Close the stream
  writeStream.end();
  
  console.log(`✅ Repository dump complete! Output saved to: ${CONFIG.outputFile}`);
  console.log(`📊 Processed ${files.length} files`);
}

// Run the script
generateRepoDump().catch(console.error);