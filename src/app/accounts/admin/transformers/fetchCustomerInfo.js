const fetchTransformedCustomerinfo = ({
  customerInfoList,
  customerAddressInfoList
}) => {
  return {
    id: customerInfoList.id,
    customers_name: customerInfoList.customers_name,
    customers_mobile: customerInfoList.customers_mobile,
    customers_email: customerInfoList.customers_email,
    customers_gender: customerInfoList.customers_gender,
    customers_dob: customerInfoList.customers_dob,
    customers_blood_group: customerInfoList.customers_blood_group,
    customers_image: customerInfoList.customers_image,
    is_active: customerInfoList.is_active,
    created_at: customerInfoList.created_at,
    updated_at: customerInfoList.updated_at,
    address_lines: customerAddressInfoList
  };
};

module.exports = { fetchTransformedCustomerinfo };
