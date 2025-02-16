import FileInfo from '../file-info/file-info';
import getFs from '../fs/getFs';
import traverseFileInfo from '../file-info/traverse-file-info';
import { FsPath, toFsPath } from '../file-info/fs-path';
import { logger } from '../log';

const log = logger('core.modules.project-dirs');

export const getProjectDirsFromFileInfo = (
  fileInfo: FileInfo,
  rootDir: FsPath
): FsPath[] => {
  const fs = getFs();
  const rootDirPartsLength = fs.split(rootDir).length;
  const projectDirs = new Set<FsPath>();
  for (const {
    fileInfo: { path },
  } of traverseFileInfo(fileInfo)) {
    if (!path.startsWith(rootDir)) {
      throw new Error(`file ${path} is outside of root directory: ${rootDir}`);
    }
    if (fs.getParent(path) === rootDir) {
      projectDirs.add(rootDir);
      break;
    }

    const parts = fs.split(path);
    const projectDirPart = parts[rootDirPartsLength];
    const projectDir = fs.join(rootDir, projectDirPart);
    projectDirs.add(toFsPath(projectDir));
  }

  log.info(Array.from(projectDirs).join(', '));
  return Array.from(projectDirs);
};
