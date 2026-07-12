/**
 * @fileoverview
 * Drag & Drop utility helpers.
 */

export function makeDraggable(el, onDragStart, onDrag, onDragEnd) {
  let isDragging = false;
  let startX, startY;

  const onMouseDown = (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    if (onDragStart) onDragStart(e);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    if (onDrag) onDrag(e, e.clientX - startX, e.clientY - startY);
  };

  const onMouseUp = (e) => {
    isDragging = false;
    if (onDragEnd) onDragEnd(e);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  el.addEventListener('mousedown', onMouseDown);
  return () => {
    el.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
}
