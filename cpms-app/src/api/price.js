import { get, post, put, del } from 'poros/http';

// 价格查询列表页
export function getPriceList(query) {
  return get('/api/cpms/projectPriceMain/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}
// 价格新增页面
export function postPriceForm(form) {
  return post('/api/cpms/projectPriceMain', form).then((res) => res.data || {});
}
// 价格编辑页面
export function putPriceForm(form) {
  return put('/api/cpms/projectPriceMain', form).then((res) => res.data || {});
}
// 价格详情页面
export function getPriceDetail(id) {
  return get(`/api/cpms/projectPriceMain/${id}`, {}).then((res) => res.data || {});
}
// 价格状态
export function getPriceStatus(query) {
  return get('/api/cpms/projectPriceMain/getStatus', query).then((res) => ({
    data: Object.keys(res.data || {}).map((key) => ({
      key,
      value: (res.data || {})[key],
    })),
    totalSize: (res.data || {}).total,
  }));
}
// 根据意向客户的id+分公司code+销售部code获取CRM客户信息
export function getCrmCust(query) {
  return get('/api/cpms/projectPriceMain/find-crm-cust', query).then((res) => res.data || []);
}
// 删除
export function delPriceMain(ids) {
  return del(`/api/cpms/projectPriceMain/${ids}`, {}).then((res) => res.data || {});
}

// 价格申请统计表
export function getPriceReportList(query) {
  return get('/api/cpms/projectMainReport/product-report', query).then((res) => ({
    ...res,
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}
