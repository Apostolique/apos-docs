// markdown-it plugin:
// When 2 or more images sit on the same line (e.g. a row of badges), add a
// class to each of those images so they can be styled to flow inline on one
// row instead of stacking. A single image on its own line is left untouched.
//
// "Same line" is derived from the inline token's children: soft/hard breaks
// split the children into lines, and any line that is nothing but 2+ images
// (each optionally wrapped in a link) plus whitespace is treated as a row.

module.exports = (md, opts = {}) => {
  const className = opts.className || 'inline-image';

  md.core.ruler.push('imagerow', state => {
    for (const token of state.tokens) {
      if (token.type !== 'inline' || !token.children) continue;

      // Split the inline children into lines on soft/hard breaks.
      let line = [];
      const lines = [line];
      for (const child of token.children) {
        if (child.type === 'softbreak' || child.type === 'hardbreak') {
          line = [];
          lines.push(line);
        } else {
          line.push(child);
        }
      }

      for (const segment of lines) {
        const images = segment.filter(t => t.type === 'image');
        if (images.length < 2) continue;

        // Only treat it as a row if the line is exclusively images
        // (optionally linked) and whitespace.
        const isRow = segment.every(t =>
          t.type === 'image' ||
          t.type === 'link_open' ||
          t.type === 'link_close' ||
          (t.type === 'text' && t.content.trim() === '')
        );
        if (!isRow) continue;

        for (const img of images) {
          img.attrJoin('class', className);
        }
      }
    }
  });
};
