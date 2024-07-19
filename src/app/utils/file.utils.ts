export interface FileNode {
  name: string;
  children?: FileNode[];
  isExpanded?: boolean;
  extension?: string;
  icon?: string;
  id?: string;
  path?: string;
  createFolder?: boolean;
  createFile?: boolean;
  parent?: FileNode;
}

export function buildFileTree(fileList: string[]): FileNode[] {
  const root: FileNode[] = [];

  const generatePersistentId = (path: string): string => {
    let hash = 0;
    for (let i = 0; i < path.length; i++) {
      const char = path.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return hash.toString();
  };

  fileList.forEach(filePath => {
    const parts = filePath.split('/');
    let currentLevel = root;
    let currentPath = '';
    let parentNode: FileNode | undefined = undefined;

    parts.forEach((part, index) => {
      currentPath += (currentPath ? '/' : '') + part;
      let existingNode = currentLevel.find(node => node.name === part);

      if (!existingNode) {
        existingNode = { name: part, children: [], id: generatePersistentId(currentPath), path: currentPath, parent: parentNode };
        if (index === parts.length - 1) {
          const extensionMatch = part.match(/\.([^.]+)$/);
          if (extensionMatch) {
            existingNode.extension = extensionMatch[1];
          }
        }
        if (!existingNode.extension) {
          existingNode.icon = 'chevron-right';
          existingNode.isExpanded = false;
        }
        currentLevel.push(existingNode);
      }

      if (index < parts.length - 1) {
        currentLevel = existingNode.children!;
        parentNode = existingNode;
      }
    });
  });

  const cleanEmptyChildren = (nodes: FileNode[]): void => {
    nodes.forEach(node => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      } else if (node.children) {
        cleanEmptyChildren(node.children);
      }
    });
  };

  cleanEmptyChildren(root);

  return root;
}