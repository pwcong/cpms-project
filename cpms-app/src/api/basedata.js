import { get } from 'poros/http';

/** 获取客户列表 */
export function getCustomerList(query) {
  return get('/api/cpms/baseCustomer/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 删除客户列表 */
export function delCustomer(id) {
  return del(`/api/cpms/baseCustomer/${id}`, {}).then((res) => res.data || {});
}

/** 提交客户表单 */
export function postCustomerForm(form) {
  return post('/api/cpms/baseCustomer', form).then((res) => res.data || {});
}

/** 修改客户表单 */
export function putCustomerForm(form) {
  return put('/api/cpms/baseCustomer', form).then((res) => res.data || {});
}

/** 获取产品线列表 */
export function getProductLineList(query) {
  return get('/api/cpms/baseProductLine/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取产品分类列表 */
export function getProductCateLSist(query) {
  return get('/api/cpms/baseProductCategory/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取基础产品列表 */
export function getProductList(query) {
  return get('/api/cpms/baseProduct/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取基础产品列表 */
export function getCustomizeProduct(query) {
  return get('/api/cpms/baseProduct/getCustomizeProduct', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取法人信息列表 */
export function getCorporateList(query) {
  return get('/api/cpms/baseCorporate/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取省级列表 */
export function getProvinceList(query) {
  return get('/api/cpms/baseProvince/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取市级列表 */
export function getCityList(query) {
  return get('/api/cpms/baseCity/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取县区列表 */
export function getCountyList(query) {
  return get('/api/cpms/baseCounty/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取县级、街道列表 */
export function getStreetList(query) {
  return get('/api/cpms/baseStreet/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取客户地址列表 */
export function getCustomerAddressList(query) {
  return get('/api/cpms/baseCustomerAddress/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 仓库列表*/
export function getWarehouseList(query) {
  return get('/api/cpms/baseWarehouse/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 产品分类列表*/
export function getProductCateList(query) {
  return get('/api/cpms/baseProductCategory/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 机构列表*/
export function getAgencyList(query) {
  return get('/api/cpms/baseAgency/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 商务中心列表*/
export function getBusinessList(query) {
  return get('/api/cpms/baseBusiness/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

// 机构
export function getSapSale(data) {
  return get(`/api/cpms/itf/crm/find-sap-sale`, data).then((res) => res.data || {});
}

// 可用法人
export function getSapCompany(data) {
  return get(`/api/cpms/itf/crm/find-sap-company`, data).then((res) => res.data || {});
}

// 产品供价
export function getProductPrice(data) {
  return get(`/api/cpms/itf/crm/find-product-price`, data).then((res) => res.data || {});
}
// 数据字典
export function getDictList(systemCode, dictCode) {
  return get(`/api/poros-permission/dict/data/list`, {
    systemCode,
    dictCode,
  }).then((res) => ({
    data: (res.data || []).map((d) => ({
      ...d,
      text: d.dataLabel,
      value: d.dataValue,
    })),
  }));
}
