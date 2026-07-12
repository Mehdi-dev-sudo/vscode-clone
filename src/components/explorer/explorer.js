/**
 * @fileoverview
 * Explorer component — the file tree view in the sidebar.
 * Supports: create, rename, delete files/folders, collapse/expand,
 * drag & drop, context menus, and file open via click/dblclick.
 */

import { eventBus } from '../../events/event-bus.js';
import { EVENTS } from '../../core/constants.js';
import { createElement, empty, $, uid, escapeHtml } from '../../utils/dom.js';
import { getItem, setItem } from '../../storage/local-storage.js';
import { STORAGE_KEYS } from '../../core/constants.js';
import { ICONS } from '../../assets/icons/codicons.js';
import { ContextMenu } from '../../core/context-menu.js';

/**
 * @typedef {Object} FileNode
 * @property {string} id - Unique identifier.
 * @property {string} name - Display name.
 * @property {'file'|'folder'} type
 * @property {boolean} [collapsed]
 * @property {Array<FileNode>} [children]
 */

/**
 * Create the default file tree with fresh UIDs.
 * Using a function ensures uid() is called at invocation time,
 * not at module evaluation — avoiding stale/mutated defaults.
 * @returns {FileNode}
 */
function createDefaultTree() {
  return {
    id: 'root',
    name: 'workspace',
    type: 'folder',
    collapsed: false,
    children: [
      { id: uid(), name: 'src', type: 'folder', collapsed: false, children: [
        { id: uid(), name: 'index.js', type: 'file' },
        { id: uid(), name: 'styles.css', type: 'file' },
      ]},
      { id: uid(), name: 'index.html', type: 'file' },
      { id: uid(), name: 'README.md', type: 'file' },
      { id: uid(), name: '.gitignore', type: 'file' },
    ],
  };
}

/** @type {FileNode} */
let fileTree = createDefaultTree();

/** @type {HTMLElement|null} */
let treeEl = null;

/** Currently selected node ID. */
let selectedId = null;

/** Currently renamed node ID (null if not renaming). */
let renamingId = null;

/** Drag state. */
const dragState = {
  sourceId: null,
  targetId: null,
  position: null, // 'before' | 'after' | 'inside'
};

/**
 * Deep clone a file tree node.
 * @param {FileNode} node
 * @returns {FileNode}
 */
function cloneNode(node) {
  return JSON.parse(JSON.stringify(node));
}

/**
 * Find a node by ID in the tree.
 * @param {FileNode} node
 * @param {string} id
 * @returns {FileNode|null}
 */
function findNode(node, id) {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Find the parent of a node.
 * @param {FileNode} node
 * @param {string} id
 * @returns {FileNode|null}
 */
function findParent(node, id) {
  if (!node.children) return null;
  for (const child of node.children) {
    if (child.id === id) return node;
    const found = findParent(child, id);
    if (found) return found;
  }
  return null;
}

/**
 * Remove a node by ID from the tree.
 * @param {FileNode} node
 * @param {string} id
 * @returns {boolean}
 */
function removeNode(node, id) {
  if (!node.children) return false;
  const idx = node.children.findIndex((c) => c.id === id);
  if (idx !== -1) {
    node.children.splice(idx, 1);
    return true;
  }
  for (const child of node.children) {
    if (removeNode(child, id)) return true;
  }
  return false;
}

/**
 * Handle opening a file.
 * @param {FileNode} node
 * @returns {void}
 */
function openFile(node) {
  if (node.type !== 'file') return;
  eventBus.emit(EVENTS.FILE_SELECTED, node);
  eventBus.emit(EVENTS.TAB_OPENED, node);
}

/**
 * Toggle folder collapse state.
 * @param {string} id
 * @returns {void}
 */
function toggleCollapse(id) {
  const node = findNode(fileTree, id);
  if (!node || node.type !== 'folder') return;
  node.collapsed = !node.collapsed;
  persistTree();
  renderTree();
}

/**
 * Start renaming a node.
 * @param {string} id
 * @returns {void}
 */
function startRename(id) {
  renamingId = id;
  renderTree();
  // Focus the input in next tick
  requestAnimationFrame(() => {
    const input = $(`.file-tree__rename-input`, treeEl);
    if (input) {
      input.focus();
      input.select();
    }
  });
}

/**
 * Commit rename.
 * @param {string} id
 * @param {string} newName
 * @returns {void}
 */
function commitRename(id, newName) {
  const node = findNode(fileTree, id);
  if (!node || !newName.trim()) {
    renamingId = null;
    renderTree();
    return;
  }
  node.name = newName.trim();
  renamingId = null;
  persistTree();
  renderTree();
  eventBus.emit(EVENTS.FILE_RENAMED, { id, name: newName.trim() });
}

/**
 * Create a new file/folder in the target parent.
 * @param {string} parentId - Parent folder ID.
 * @param {'file'|'folder'} type
 * @returns {void}
 */
function createNode(parentId, type) {
  let parent = parentId ? findNode(fileTree, parentId) : fileTree;
  if (!parent || parent.type !== 'folder') parent = fileTree;

  if (!parent.children) parent.children = [];
  if (parent.collapsed) parent.collapsed = false;

  const newId = uid();
  const newNode = {
    id: newId,
    name: type === 'folder' ? 'new-folder' : 'untitled.js',
    type,
    ...(type === 'folder' ? { collapsed: false, children: [] } : {}),
  };

  parent.children.push(newNode);
  persistTree();
  renderTree();
  startRename(newId);
  eventBus.emit(EVENTS.FILE_CREATED, newNode);
}

/**
 * Delete a node with confirmation.
 * @param {string} id
 * @returns {void}
 */
function deleteNode(id) {
  if (id === 'root') return;
  const node = findNode(fileTree, id);
  if (!node) return;
  if (!confirm(`Delete "${node.name}"?`)) return;
  removeNode(fileTree, id);
  if (selectedId === id) selectedId = null;
  persistTree();
  renderTree();
  eventBus.emit(EVENTS.FILE_DELETED, { id });
}

/**
 * Handle drag start.
 * @param {DragEvent} e
 * @param {string} id
 * @returns {void}
 */
function onDragStart(e, id) {
  dragState.sourceId = id;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', id);
  eventBus.emit(EVENTS.DRAG_START, { id });
}

/**
 * Handle drag over.
 * @param {DragEvent} e
 * @param {string} id
 * @returns {void}
 */
function onDragOver(e, id) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';

  const rect = e.target.getBoundingClientRect();
  const y = e.clientY - rect.top;
  const height = rect.height;
  const threshold = height * 0.25;

  let position;
  if (y < threshold) position = 'before';
  else if (y > height - threshold) position = 'after';
  else position = 'inside';

  dragState.targetId = id;
  dragState.position = position;

  // Visual feedback: remove all drag-over classes first
  treeEl?.querySelectorAll('.file-tree__item--drag-over, .file-tree__item--drag-over-bottom, .file-tree__item--drag-over-inside')
    .forEach((el) => el.classList.remove('file-tree__item--drag-over', 'file-tree__item--drag-over-bottom', 'file-tree__item--drag-over-inside'));

  // Apply class to the specific target
  const targetEl = treeEl?.querySelector(`[data-id="${id}"]`);
  if (targetEl && dragState.sourceId !== id) {
    const cls = position === 'inside' ? 'file-tree__item--drag-over-inside'
      : position === 'before' ? 'file-tree__item--drag-over'
      : 'file-tree__item--drag-over-bottom';
    targetEl.classList.add(cls);
  }
}

/** Clear all drag-over visual indicators. */
function clearDragOver() {
  treeEl?.querySelectorAll('.file-tree__item--drag-over, .file-tree__item--drag-over-bottom, .file-tree__item--drag-over-inside')
    .forEach((el) => el.classList.remove('file-tree__item--drag-over', 'file-tree__item--drag-over-bottom', 'file-tree__item--drag-over-inside'));
}

/**
 * Handle drop.
 * @param {DragEvent} e
 * @param {string} targetId
 * @returns {void}
 */
function onDrop(e, targetId) {
  e.preventDefault();
  const sourceId = dragState.sourceId || e.dataTransfer.getData('text/plain');
  if (!sourceId || sourceId === targetId) return;

  const sourceNode = findNode(fileTree, sourceId);
  if (!sourceNode) return;

  const sourceParent = findParent(fileTree, sourceId);
  const targetNode = findNode(fileTree, targetId);
  if (!targetNode) return;

  // Remove from old position
  removeNode(fileTree, sourceId);

  // Add to new position
  if (dragState.position === 'inside' && targetNode.type === 'folder') {
    if (!targetNode.children) targetNode.children = [];
    targetNode.children.push(sourceNode);
    targetNode.collapsed = false;
  } else {
    const targetParent = findParent(fileTree, targetId);
    if (!targetParent || !targetParent.children) return;
    const idx = targetParent.children.findIndex((c) => c.id === targetId);
    const insertAt = dragState.position === 'after' ? idx + 1 : idx;
    targetParent.children.splice(insertAt, 0, sourceNode);
  }

  dragState.sourceId = null;
  clearDragOver();
  persistTree();
  renderTree();
  eventBus.emit(EVENTS.COMMAND_EXECUTED, 'drag-drop');
}

/**
 * Show the context menu for a file tree item.
 * @param {MouseEvent} e
 * @param {FileNode} node
 * @returns {void}
 */
function showContextMenu(e, node) {
  const items = [];

  if (node.type === 'folder') {
    items.push({ label: 'New File', icon: ICONS.newFile, action: () => createNode(node.id, 'file') });
    items.push({ label: 'New Folder', icon: ICONS.newFolder, action: () => createNode(node.id, 'folder') });
    items.push({ separator: true });
  }

  items.push({ label: 'Rename', icon: ICONS.rename, action: () => startRename(node.id), shortcut: 'F2' });

  if (node.id !== 'root') {
    items.push({ separator: true });
    items.push({ label: 'Delete', icon: ICONS.trash, action: () => deleteNode(node.id) });
  }

  ContextMenu.show(e, items, node);
}

/**
 * Render the file tree recursively.
 * @param {FileNode} node - Current node to render.
 * @param {number} depth - Nesting level.
 * @returns {HTMLElement[]}
 */
function renderNode(node, depth = 0) {
  const elements = [];
  const isFolder = node.type === 'folder';
  const isSelected = node.id === selectedId;
  const isRenaming = node.id === renamingId;
  const isCollapsed = isFolder && node.collapsed;

  const item = createElement('div', {
    className: `file-tree__item${isSelected ? ' file-tree__item--selected' : ''}`,
    attrs: {
      'data-id': node.id,
      'data-type': node.type,
      draggable: 'true',
      role: 'treeitem',
      'aria-expanded': isFolder ? (!isCollapsed).toString() : undefined,
      'aria-selected': isSelected ? 'true' : 'false',
      style: `--depth: ${depth};`,
    },
    events: {
      click: (e) => {
        e.stopPropagation();
        selectedId = node.id;
        renderTree();
        if (isFolder) toggleCollapse(node.id);
        else openFile(node);
      },
      dblclick: (e) => {
        if (isFolder) startRename(node.id);
      },
      contextmenu: (e) => showContextMenu(e, node),
      dragstart: (e) => onDragStart(e, node.id),
      dragover: (e) => onDragOver(e, node.id),
      drop: (e) => onDrop(e, node.id),
      dragend: () => { dragState.sourceId = null; clearDragOver(); },
    },
  });

  if (isFolder) {
    const chevron = createElement('span', {
      className: `icon icon--chevron${isCollapsed ? ' icon--chevron--collapsed' : ''}`,
      html: ICONS.chevronDown,
      attrs: { 'aria-hidden': 'true' },
    });
    item.appendChild(chevron);
  }

  const iconHtml = isFolder ? (node.collapsed ? ICONS.folder : ICONS.folderOpen) : ICONS.file;
  const iconEl = createElement('span', {
    className: 'icon',
    html: iconHtml,
    attrs: { 'aria-hidden': 'true' },
  });
  item.appendChild(iconEl);

  if (isRenaming) {
    const input = createElement('input', {
      className: 'file-tree__rename-input',
      attrs: {
        type: 'text',
        value: node.name,
        'aria-label': 'Rename file',
      },
      events: {
        blur: (e) => commitRename(node.id, e.target.value),
        keydown: (e) => {
          if (e.key === 'Enter') commitRename(node.id, e.target.value);
          if (e.key === 'Escape') { renamingId = null; renderTree(); }
          e.stopPropagation();
        },
      },
    });
    item.appendChild(input);
  } else {
    const label = createElement('span', {
      className: 'file-tree__label',
      text: node.name,
    });
    item.appendChild(label);
  }

  elements.push(item);

  // Render children if folder and not collapsed
  if (isFolder && node.children && !node.collapsed) {
    for (const child of node.children) {
      elements.push(...renderNode(child, depth + 1));
    }
  }

  return elements;
}

/** Render the entire file tree into the container. */
function renderTree() {
  if (!treeEl) return;
  empty(treeEl);

  if (!fileTree.children || fileTree.children.length === 0) {
    // Empty state
    treeEl.appendChild(createElement('div', {
      className: 'empty-state',
      children: [
        createElement('span', { className: 'empty-state__icon', html: ICONS.folder }),
        createElement('div', { className: 'empty-state__title', text: 'No files yet' }),
        createElement('div', { className: 'empty-state__desc', text: 'Use the buttons above to create files and folders.' }),
      ],
    }));
    return;
  }

  const fragment = document.createDocumentFragment();
  for (const child of fileTree.children) {
    for (const el of renderNode(child, 0)) {
      fragment.appendChild(el);
    }
  }
  treeEl.appendChild(fragment);
}

/**
 * Persist tree state to localStorage.
 */
function persistTree() {
  setItem(STORAGE_KEYS.EXPLORER_STATE, fileTree);
}

/**
 * Create the Explorer header and tree container.
 * @param {HTMLElement} container - The parent element.
 * @returns {void}
 */
function render(container) {
  if (!container) return;
  empty(container);

  // Header
  const header = createElement('div', { className: 'sidebar__header' });
  const title = createElement('span', { className: 'sidebar__title', text: 'EXPLORER' });
  const actions = createElement('div', { className: 'sidebar__actions' });

  const fileBtn = createElement('button', {
    className: 'sidebar__action-btn',
    html: `<span class="icon" aria-hidden="true">${ICONS.newFile}</span>`,
    attrs: { title: 'New File', 'aria-label': 'New File' },
    events: { click: () => createNode(selectedId, 'file') },
  });
  const folderBtn = createElement('button', {
    className: 'sidebar__action-btn',
    html: `<span class="icon" aria-hidden="true">${ICONS.newFolder}</span>`,
    attrs: { title: 'New Folder', 'aria-label': 'New Folder' },
    events: { click: () => createNode(selectedId, 'folder') },
  });
  const refreshBtn = createElement('button', {
    className: 'sidebar__action-btn',
    html: `<span class="icon" aria-hidden="true">${ICONS.refresh}</span>`,
    attrs: { title: 'Refresh Explorer', 'aria-label': 'Refresh Explorer' },
    events: { click: () => renderTree() },
  });
  const collapseBtn = createElement('button', {
    className: 'sidebar__action-btn',
    html: `<span class="icon" aria-hidden="true">${ICONS.collapseAll}</span>`,
    attrs: { title: 'Collapse All', 'aria-label': 'Collapse All' },
    events: { click: () => { fileTree.children?.forEach(c => { if (c.type === 'folder') c.collapsed = true; }); persistTree(); renderTree(); } },
  });
  const workspaceBtn = createElement('button', {
    className: 'sidebar__action-btn',
    html: `<span class="icon" aria-hidden="true">${ICONS.folder}</span>`,
    attrs: { title: 'Manage Workspace', 'aria-label': 'Manage Workspace' },
    events: { click: () => { /* Workspace switching could be implemented */ } },
  });

  actions.append(fileBtn, folderBtn, refreshBtn, collapseBtn, workspaceBtn);
  header.append(title, actions);
  container.appendChild(header);

  // Tree container
  treeEl = createElement('div', {
    className: 'explorer__group',
    attrs: { role: 'tree', 'aria-label': 'Explorer File Tree' },
  });
  container.appendChild(treeEl);

  // Restore persisted tree state
  const savedTree = getItem(STORAGE_KEYS.EXPLORER_STATE);
  if (savedTree && savedTree.children) {
    fileTree = savedTree;
  }

  renderTree();
}

/**
 * Explorer component module.
 * @namespace
 */
export const Explorer = {
  /**
   * Initialize the Explorer module.
   */
  init() {},

  /**
   * Render the Explorer into a container.
   * @param {HTMLElement} container
   */
  render(container) {
    render(container);
  },

  /**
   * Get a file tree node by ID.
   * @param {string} id
   * @returns {FileNode|null}
   */
  getNode(id) {
    return findNode(fileTree, id);
  },

  /**
   * Create a new file/folder.
   * @param {string} parentId
   * @param {'file'|'folder'} type
   */
  create(parentId, type) {
    createNode(parentId, type);
  },
};
