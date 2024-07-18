export interface FileNode {
  name: string;
  children?: FileNode[];
  isExpanded?: boolean;
  extension?: string;
  icon?: string;
  id?: string;
  path?: string;
}

export function buildFileTree(fileList: string[]): FileNode[] {
  const root: FileNode[] = [];

  const generateGuid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  fileList.forEach(filePath => {
    const parts = filePath.split('/');
    let currentLevel = root;
    let currentPath = '';

    parts.forEach((part, index) => {
      currentPath += (currentPath ? '/' : '') + part;
      let existingNode = currentLevel.find(node => node.name === part);

      if (!existingNode) {
        existingNode = { name: part, children: [], id: generateGuid(), path: currentPath };
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
