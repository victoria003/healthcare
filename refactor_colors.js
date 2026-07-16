import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
      callback(dirPath);
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace text-primary-light with text-primary-hover or text-secondary
  content = content.replace(/text-primary-light/g, 'text-secondary');
  content = content.replace(/bg-primary-light/g, 'bg-primary-hover');
  content = content.replace(/border-primary-light/g, 'border-primary-hover');
  
  // Remove dark: classes
  content = content.replace(/dark:[a-zA-Z0-9\-\/]+/g, '');
  
  // Clean up double spaces in classNames
  content = content.replace(/ className=" +/g, ' className="');
  content = content.replace(/ +"/g, '"');
  content = content.replace(/ +`/g, '`');
  content = content.replace(/` +/g, '`');
  content = content.replace(/ {2,}/g, ' ');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

const targetDirs = ['./app', './components'];

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, processFile);
  }
});

console.log('Done!');
