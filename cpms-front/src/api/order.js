import { get, post, put, del } from 'poros/http';

// 加载产品获取项目、价格、合同产品接口
export function getProjectOrPriceOrContractProductList(query) {
  return get('/api/cpms/orderMain/find-product-list', query).then(
    (res) => res.data || []
  );
}

// 订单列表接口
export function getOrderList(query) {
  return get('/api/cpms/orderMain/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

// 管理员订单列表接口
export function getOrderAdminList(query) {
  return get('/api/cpms/orderMain/admin/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

// 订单查询所有状态接口
export function getOrderStatus(query) {
  return get('/api/cpms/orderMain/get-status', query).then((res) => ({
    data: Object.keys(res.data || {}).map((key) => ({
      key,
      value: (res.data || {})[key],
    })),
    totalSize: (res.data || {}).total,
  }));
}

// 订单子单查询所有状态接口
export function getOrderSplitStatus(query) {
  return get('/api/cpms/orderSplit/get-status', query).then((res) => ({
    data: Object.keys(res.data || {}).map((key) => ({
      key,
      value: (res.data || {})[key],
    })),
    totalSize: (res.data || {}).total,
  }));
}

// 订单查询单据列表接口
export function getOrderEnumList(query) {
  return get('/api/cpms/orderMain/get-list-enum', query).then((res) => ({
    data: Object.keys(res.data || {}).map((key) => ({
      key,
      value: (res.data || {})[key],
    })),
    totalSize: (res.data || {}).total,
  }));
}

// 订单详情页面
export function getOrderDetail(id) {
  return get(`/api/cpms/orderMain/${id}`, {}).then((res) => res.data || {});
}

// 订单新增页面
export function postOrderForm(form) {
  return post('/api/cpms/orderMain', form).then((res) => res.data || {});
}

// 订单编辑页面
export function putOrderForm(form) {
  return put('/api/cpms/orderMain', form).then((res) => res.data || {});
}

// 订单新建页面业务员接口
export function getSalesmanList(saleOfficeCode) {
  return get(`/api/cpms/orderMain/list-salesman/${saleOfficeCode}`, {}).then((res) => ({
    data: res.data || [],
  }));
}

// 订单获取省接口
export function getOrderProvinceList(query) {
  return get('/api/cpms/orderCrmProvince/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

// 订单获取市接口
export function getOrderCityList(query) {
  return get('/api/cpms/orderCrmCity/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

// 订单获取县/区接口
export function getOrderCountyList(query) {
  return get('/api/cpms/orderCrmCounty/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

// 订单资信额度接口
export function getOrderCredit(customerId) {
  return get(`/api/cpms/orderCredit/crm-credit-info/${customerId}`, {}).then(
    (res) => res.data || {}
  );
}

// 订单模块子单明细表接口
export function getOrderSplitByArkList(id) {
  return get(`/api/cpms/orderSplit/get-order-split/${id}`, {}).then(
    (res) => res.data || {}
  );
}

// 订单模块子单明细出库信息接口
export function getByChildOrderNo(id) {
  return get(`/api/cpms/orderSplit/find-delivery/${id}`, {}).then(
    (res) => res.data || {}
  );
}

// 订单模块子单明细查看日志接口
export function getByOrderNo(id) {
  return get(`/api/cpms/orderSplit/find-split-log/${id}`, {}).then(
    (res) => res.data || {}
  );
}

// 订单子单明细查物流信息接口
export function getOrderTrackInfo(query) {
  return get(`/api/cpms/orderSplit/track-info`, query).then((res) => res.data || []);
}

// 订单模块查看日志接口
export function getOrderFindPushLog(id, type) {
  return get(`/api/cpms/orderMain/find-push-log/${id}/${type}`, {}).then(
    (res) => res.data || {}
  );
}

// 订单查询收货地址接口
export function getFindCreAdress(query) {
  return get(`/api/cpms/itf/fz/find-crm-address`, query).then((res) => res.data || []);
}

// 订单新增物流地址接口
export function postAddCreAdress(query) {
  return post(`/api/cpms/itf/fz/add-crm-address`, query).then((res) => res.data || {});
}

// 订单查询客户信息接口
export function getFindCrmParty(query) {
  return get(`/api/cpms/itf/crm/find-crm-party`, query).then((res) => res.data || {});
}

// 根据sku编码获取库存信息
export function getSkuStock(skuCode, salesCode, partyCode) {
  return get(
    `/api/cpms/itf/fz/get-fz-inventory/${skuCode}/${salesCode}/${partyCode}`,
    {}
  ).then((res) => ({
    data: (res.data || {}).stockDtoList || [],
    totalSize: ((res.data || {}).stockDtoList || []).total,
  }));
}

// 根据sku编码获取库存信息
export function getSkuStockWithProductLine(
  skuCode,
  productLineCode,
  salesCode,
  partyCode
) {
  return get(`/api/cpms/orderMain/get-product-stock`, {
    productId: skuCode,
    productLineCode: productLineCode,
    salesCode: salesCode,
    partyId: partyCode,
  }).then((res) => ({
    data: (res.data || {}).stockDtoList || [],
    totalSize: ((res.data || {}).stockDtoList || []).total,
  }));
}

// 根据sku编码获取库存信息
export function getSkuStockWithCounty(countyCode, skuCode) {
  return get(
    `/api/cpms/itf/fz/query-warehouse-by-county-id/${countyCode}/${skuCode}`,
    {}
  ).then((res) => ({
    data: (res.data || {}).stockDtoList || [],
    totalSize: ((res.data || {}).stockDtoList || []).total,
  }));
}

// 根据sku编码和仓库批量获取库存信息
export function postBatchSkuStock(form) {
  return post(`/api/cpms/itf/fz/get-batch-inventory`, form).then((res) => res.data);
}

// 根据订单id获取子单信息
export function getOrderSplitList(id) {
  return get(`/api/cpms/orderSplit/get-by-order-id?id=${id}`, {}).then(
    (res) => res.data || []
  );
}

// 根据id撤回子单
export function putWithdrawOrderSplit(id) {
  return put(`/api/cpms/orderSplit/withdraw/${id}`, {}).then((res) => res.data || {});
}

// 撤回编辑后重新提交
export function putResubmitOrderSplit(form) {
  return put(`/api/cpms/orderSplit/resubmit`, form).then((res) => res.data || {});
}

// 根据id删除子单信息
export function delOrderSplit(ids) {
  return del(`/api/cpms/orderSplit/${ids}`, {}).then((res) => res.data || {});
}

// 根据要货客户编码查找可下单产品线
export function getCRMCustomerProductLine(customerCode) {
  return get(
    `/api/cpms/itf/crm/find_productline_by_receivecusid/${customerCode}`,
    {}
  ).then((res) => res.data || []);
}

// 项目价格合同转订单
export function getConvert2OrderProductList(query) {
  return get(`/api/cpms/orderMain/change-order`, query).then((res) => res.data || {});
}

// 获取异常订单列表
export function getErrorOrderSplitList(orderId) {
  return get(`/api/cpms/orderMain/find-order-status/${orderId}`, {}).then(
    (res) => res.data || []
  );
}

// 根据订单id获取产品明细
export function getOrderProductList(id) {
  return get(`/api/cpms/orderProductList/get-by-order-id`, {
    id,
  }).then((res) => res.data || []);
}

export function putEditProductList(productList) {
  return put(`/api/cpms/orderProductList`, productList).then((res) => res.data || {});
}

export function postAddProductList(productList) {
  return post(`/api/cpms/orderProductList`, productList).then((res) => res.data || {});
}

export function delRemoveProductList(ids) {
  return del(`/api/cpms/orderProductList/${ids}`, {}).then((res) => res.data || {});
}

// 订单新建获取crm账号与oa登录名映射表列表
export function getOrderCrmOaList(query) {
  return get('/api/cpms/orderCrmOa/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

// 订单模块判断是否有CRM和OA的关联关系接口
export function getOrderCrmOaIsExist(query) {
  return post(`/api/cpms/orderCrmOa/is-exist`, query).then((res) => res.data || {});
}

// 删除
export function delOrderMain(ids) {
  return del(`/api/cpms/orderMain/${ids}`, {}).then((res) => res.data || {});
}

// 订单模块根据要货客户带出结算和配送客户
export function getFindCustomerbMsg(customerCode) {
  return get(`/api/cpms/orderMain/find-customer-msg/${customerCode}`, {}).then((res) => ({
    data: res.data || [],
  }));
}

// 根据模块标识和模块ID分页获取用户操作日志列表
export function getCommonOperationLogList(query) {
  return get(`/api/cpms/commonOperationLog/list`, query).then((res) => res.data || []);
}
