#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Function to recursively find all files with specific extensions
function findFiles(dir, extensions, excludeDirs = []) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        results = results.concat(findFiles(filePath, extensions, excludeDirs));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function to replace content in a file
function replaceInFile(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    replacements.forEach(({ from, to }) => {
      const regex = new RegExp(from, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, to);
        changed = true;
      }
    });
    
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Define replacements
const replacements = [
  // CSS Variables
  { from: '--bolt-elements-', to: '--refine-elements-' },
  { from: '--bolt-terminal-', to: '--refine-terminal-' },
  
  // CSS Classes and references
  { from: 'bolt-elements-', to: 'refine-elements-' },
  { from: 'bolt-terminal-', to: 'refine-terminal-' },
  
  // Icon references
  { from: 'i-bolt:', to: 'i-refine:' },
  
  // Theme and storage keys
  { from: 'bolt_theme', to: 'refine_theme' },
  { from: 'bolt_user_profile', to: 'refine_user_profile' },
  
  // Function and tag names
  { from: 'escapeBoltArtifactTags', to: 'escapeRefineArtifactTags' },
  { from: 'escapeBoltAActionTags', to: 'escapeRefineActionTags' },
  { from: 'escapeBoltTags', to: 'escapeRefineTags' },
  { from: 'boltArtifact', to: 'refineArtifact' },
  { from: 'boltAction', to: 'refineAction' },
];

// File extensions to process
const extensions = ['.tsx', '.ts', '.scss', '.css', '.js', '.jsx'];

// Directories to exclude
const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.next'];

// Find all files to process
const files = findFiles('./app', extensions, excludeDirs);

console.log(`Found ${files.length} files to process...`);

// Process each file
files.forEach(file => {
  replaceInFile(file, replacements);
});

console.log('Branding update complete!');
