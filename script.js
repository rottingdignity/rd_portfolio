// Lets a normal mouse wheel scroll the horizontal image row.
// Touch users on mobile can already swipe left/right natively.
document.querySelectorAll('.scroll-row').forEach((row) => {
  row.addEventListener(
    'wheel',
    (e) => {
      // Only hijack the wheel when the scroll is mostly vertical,
      // so trackpads that already scroll sideways still work normally.
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        row.scrollLeft += e.deltaY;
      }
    },
    { passive: false }
  );
});
