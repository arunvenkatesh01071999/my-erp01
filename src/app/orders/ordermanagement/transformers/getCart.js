const transformGetCartLight = ({ cartItems }) => {
  return cartItems.map(item => {
    return {
      sc_id: item.Scatid,
      prod_id: item.ProdId,
      prod_name: item.ProdName,
      imgurl: item.ImgPath2,
      qty: item.Qty,
      prod_rate: item.Rate,
      prod_price: item.Rate * item.Qty,
      unit_id: item.Packid
    };
  });
};

module.exports = { transformGetCartLight };
