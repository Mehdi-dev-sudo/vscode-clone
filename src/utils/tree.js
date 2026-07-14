// @ts-check

/**
 * @fileoverview
 * Tree data structure helpers.
 */

export function findInTree(tree, predicate, childrenKey = 'children') {
  if (predicate(tree)) return tree;
  if (!tree[childrenKey]) return null;
  for (const child of tree[childrenKey]) {
    const found = findInTree(child, predicate, childrenKey);
    if (found) return found;
  }
  return null;
}

export function flatTree(tree, childrenKey = 'children') {
  const result = [tree];
  if (tree[childrenKey]) {
    tree[childrenKey].forEach((child) => result.push(...flatTree(child, childrenKey)));
  }
  return result;
}

export function mapTree(tree, fn, childrenKey = 'children') {
  const node = fn(tree);
  if (tree[childrenKey]) {
    node[childrenKey] = tree[childrenKey].map((child) => mapTree(child, fn, childrenKey));
  }
  return node;
}

