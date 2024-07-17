export interface FileNode {
  name: string;
  children?: FileNode[];
}

export function buildFileTree(fileList: string[]): FileNode[] {
  const root: FileNode[] = [];

  fileList.forEach(filePath => {
    const parts = filePath.split('/');
    let currentLevel = root;

    parts.forEach((part, index) => {
      let existingNode = currentLevel.find(node => node.name === part);

      if (!existingNode) {
        existingNode = { name: part, children: [] };
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
