// document
//   .querySelector('comm-product-selector')
//   .addEventListener('commProductSelected', (e) => {
//     const { productId, number, name } = e.detail;
//     alert(productId);
//   });

document.querySelectorAll('comm-select').forEach((n) =>
  n.addEventListener('change', () => {
    console.log('change registered');
  })
);
