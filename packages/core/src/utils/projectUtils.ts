/**
 * @file projectUtils.ts
 * @description Utilities for extracting project information from VS Code URIs
 * 
 * @module utils/projectUtils
 * @author Cursor AI Time Tracking Team
 * @version 1.0.0
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ProjectInfo, ProjectType } from '../../types';
import { execSync } from 'child_process';

// Cache for project information to avoid repeated filesystem operations
const projectInfoCache = new Map<string, ProjectInfo>();
const gitBranchCache = new Map<string, string>();
const projectTypeCache = new Map<string, ProjectType>();

// Maximum age for cached items in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// Timestamp when cache was last accessed
const cacheTimestamps = new Map<string, number>();

/**
 * Project type detection signatures - files that indicate a specific project type
 */
const PROJECT_TYPE_SIGNATURES: Record<ProjectType, string[]> = {
  'nodejs': ['package.json', 'node_modules', 'yarn.lock', 'package-lock.json'],
  'python': ['requirements.txt', 'setup.py', 'Pipfile', 'pyproject.toml'],
  'java': ['pom.xml', 'build.gradle', '.classpath', 'src/main/java'],
  'dotnet': ['.csproj', '.fsproj', '.vbproj', 'Program.cs'],
  'rust': ['Cargo.toml', 'Cargo.lock'],
  'go': ['go.mod', 'go.sum', 'main.go'],
  'php': ['composer.json', 'composer.lock', 'artisan'],
  'ruby': ['Gemfile', 'Rakefile', '.ruby-version'],
  'web': ['index.html', 'styles.css', 'main.js'],
  'flutter': ['pubspec.yaml', 'lib/main.dart'],
  'unknown': []
};

/**
 * Extracts project information from a VS Code URI
 */
export function extractProjectInfo(uri: vscode.Uri): ProjectInfo {
  const filePath = uri.fsPath;
  
  // Check cache first (with periodic cleanup)
  clearExpiredCache();
  if (projectInfoCache.has(filePath)) {
    // Update timestamp
    cacheTimestamps.set(filePath, Date.now());
    return projectInfoCache.get(filePath)!;
  }
  
  // Find project root
  const projectRoot = findProjectRoot(uri);
  
  // Generate project name
  const projectName = generateProjectName(projectRoot);
  
  // Determine project type
  const projectType = determineProjectType(projectRoot);
  
  // Get Git branch if available
  const gitBranch = getGitBranch(projectRoot);
  
  // Create ProjectInfo object
  const projectInfo: ProjectInfo = {
    name: projectName,
    rootPath: projectRoot,
    type: projectType,
    gitBranch: gitBranch,
    isMultiRoot: isMultiRootWorkspace()
  };
  
  // Cache the result
  projectInfoCache.set(filePath, projectInfo);
  cacheTimestamps.set(filePath, Date.now());
  
  return projectInfo;
}

/**
 * Finds the root directory of a project containing the given URI
 */
function findProjectRoot(uri: vscode.Uri): string {
  const filePath = uri.fsPath;
  
  // 1. Check if file is in a workspace folder
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
  if (workspaceFolder) {
    return workspaceFolder.uri.fsPath;
  }
  
  // 2. If not in workspace, try to find Git root
  try {
    const gitRoot = findGitRoot(filePath);
    if (gitRoot) {
      return gitRoot;
    }
  } catch (error) {
    // Git not available or not a git repository, continue with other methods
  }
  
  // 3. Try to find project root by common project files
  const projectRoot = findProjectRootByMarkers(filePath);
  if (projectRoot) {
    return projectRoot;
  }
  
  // 4. Fallback: use parent directory of the file
  return path.dirname(filePath);
}

/**
 * Finds the Git root directory for a given file path
 */
function findGitRoot(filePath: string): string | null {
  try {
    // Execute git rev-parse to find the root of the repository
    const gitRoot = execSync('git rev-parse --show-toplevel', {
      cwd: path.dirname(filePath),
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    
    return gitRoot;
  } catch (error) {
    // Not a git repository or git not installed
    return null;
  }
}

/**
 * Generates a project name from the project root path
 */
function generateProjectName(projectRoot: string): string {
  // First try package.json name field
  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      if (packageJson.name) {
        return packageJson.name;
      }
    }
  } catch (error) {
    // Ignore errors reading package.json
  }
  
  // Fallback to directory name
  return path.basename(projectRoot);
}

/**
 * Determines the type of project based on files in the project root
 */
function determineProjectType(projectRoot: string): ProjectType {
  // Check cache first
  if (projectTypeCache.has(projectRoot)) {
    return projectTypeCache.get(projectRoot)!;
  }
  
  // Check for each project type signature
  for (const [type, signatures] of Object.entries(PROJECT_TYPE_SIGNATURES)) {
    if (type === 'unknown') continue;
    
    for (const file of signatures) {
      if (fs.existsSync(path.join(projectRoot, file))) {
        const projectType = type as ProjectType;
        projectTypeCache.set(projectRoot, projectType);
        return projectType;
      }
    }
  }
  
  // If no specific type is detected
  return 'unknown';
}

/**
 * Gets the current Git branch for a project
 */
function getGitBranch(projectRoot: string): string | null {
  // Check cache first
  if (gitBranchCache.has(projectRoot)) {
    return gitBranchCache.get(projectRoot)!;
  }
  
  try {
    // Try to get branch from git command
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: projectRoot,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    
    // Cache the result
    gitBranchCache.set(projectRoot, branch);
    
    return branch;
  } catch (error) {
    // Not a git repository or git not installed
    return null;
  }
}

/**
 * Checks if the current workspace is a multi-root workspace
 */
function isMultiRootWorkspace(): boolean {
  return vscode.workspace.workspaceFolders !== undefined && 
         vscode.workspace.workspaceFolders.length > 1;
}

/**
 * Clears expired items from all caches
 */
function clearExpiredCache(): void {
  const now = Date.now();
  
  // Clear expired project info cache entries
  for (const [key, timestamp] of cacheTimestamps.entries()) {
    if (now - timestamp > CACHE_TTL) {
      projectInfoCache.delete(key);
      gitBranchCache.delete(key);
      projectTypeCache.delete(key);
      cacheTimestamps.delete(key);
    }
  }
}

/**
 * Clears all project information caches
 */
export function clearProjectInfoCache(): void {
  projectInfoCache.clear();
  gitBranchCache.clear();
  projectTypeCache.clear();
  cacheTimestamps.clear();
}
