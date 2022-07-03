import { get, post, put, del } from 'poros/http';

// 获取客户状态
export function getCustomerStatus(query) {
  return get('/api/cpms/cust/getStatus', query).then((res) => ({
    data: Object.keys(res.data || {}).map((key) => ({
      key,
      value: (res.data || {})[key],
    })),
    totalSize: (res.data || {}).total,
  }));
}

// 关联代理商
export function getAffiliatedAgents(query) {
  return get('/api/cpms/custMain/commonList', query).then((res) => ({
    data: res.data.records || {},
    totalSize: (res.data || {}).total,
  }));
}

// 客户报表统计
export function getCustomerReportStatistics(query) {
  return get('/api/cpms/cust/getStatistics', {}).then((res) => ({
    ...(res.data || {}),
    data: res.data || {},
  }));
}

// 意向客户列表
export function getCustomerList(query) {
  return get('/api/cpms/cust/pageList', query).then((res) => ({
    data: res.data.records || {},
    totalSize: (res.data || {}).total,
  }));
}

// 通用意向客户列表
export function getCommonCustomerList(query) {
  return get('/api/cpms/custMain/commonList', query).then((res) => ({
    data: res.data.records || {},
    totalSize: (res.data || {}).total,
  }));
}

// 无效客户列表
export function getInvalidCustomerList(query) {
  return get('/api/cpms/cust/getInvalidCust', query).then((res) => ({
    data: res.data.records || {},
    totalSize: (res.data || {}).total,
  }));
}

// 无效客户认领
export function postClaimCustomer(query) {
  return post(`/api/cpms/cust/claimCust`, query).then((res) => res.data || {});
}

// 客户置为无效
export function putInvalidCustomer(query) {
  return put(`/api/cpms/custMain/delete`, query).then((res) => res.data || {});
}

// 删除草稿状态意向客户
export function putDeleteCustomer(query) {
  return put(`/api/cpms/custMain/deleteById`, query).then((res) => res.data || {});
}

// 删除草稿状态正式客户
export function deleteDeleteSapCustomer(id) {
  return del(`/api/cpms/custSapMain/${id}`, {}).then((res) => res.data || {});
}

// 转正式客户
export function getTurnRegularCustomers(id) {
  return get(`/api/cpms/cust/convert/${id}`, {}).then((res) => res.data || {});
}

// 选择客户获取天眼查详情
export function getCustomerTianyanchaInfo(keyword) {
  return get(`/api/cpms/baseTianyancha/getDataBaseOrTianyancha/${keyword}`, {}).then(
    (res) => ({
      data: res.data || [],
      totalSize: (res.data || []).length,
    })
  );
}

// 更新客户天眼查详情
export function getSkeyeDetail(keyword) {
  return get(`/api/cpms/baseTianyancha/getTianyancha817Api/${keyword}`, {}).then(
    (res) => ({
      data: res.data || [],
      totalSize: (res.data || []).length,
    })
  );
}

// 更新客户名称  废弃
export function putCustomerNameholderupdate(query) {
  return put(`/api/cpms/custMain/update`, query).then((res) => res.data || {});
}

// 更新客户信息
export function putCustomerInfoholderupdate(query) {
  return put(`/api/cpms/custMain`, query).then((res) => res.data || {});
}

// 查看天眼查客户详情
export function getCustomerSkeyeDetail(id) {
  return get(`/api/cpms/baseTianyancha/${id}`, {}).then((res) => ({
    data: res.data || [],
    totalSize: (res.data || []).length,
  }));
}

// 创建意向客户
export function postCreateCustomer(query) {
  return post(`/api/cpms/cust/add`, query).then((res) => res.data || {});
}

// 客户查重
export function getCheckingRepeat(name) {
  return get(`/api/cpms/cust/selectRepeat?fdCreditCode=${name}`, {}).then(
    (res) => res || {}
  );
}

// 编辑意向客户
export function putEditCustomer(query) {
  return put(`/api/cpms/cust`, query).then((res) => res.data || {});
}

/** 废弃客户联系人 */
export function putCustomerContactholderInvalid(query) {
  return put(`/api/cpms/custContact`, query).then((res) => res.data || {});
}

/** 废弃客户办公地址*/
export function putCustomerOfficeAddressholderInvalid(query) {
  return put(`/api/cpms/custAddress`, query).then((res) => res.data || {});
}

/** 新增客户联系人*/
export function postAddCustomerContact(query) {
  return post('/api/cpms/custContact', query).then((res) => res.data || {});
}

// 编辑客户联系人上级
export function putCustomerContactholderEdit(query) {
  return put(`/api/cpms/custContact/update`, query).then((res) => res.data || {});
}

// 新增客户办公地址
export function postAddCustomerOfficeAddres(query) {
  return post('/api/cpms/custAddress', query).then((res) => res.data || {});
}

// 获取意向客户详情
export function getCustomerDetail(id) {
  return get(`/api/cpms/cust/${id}`, {}).then((res) => res.data || {});
}

// 获取无效客户详情
export function getValidCustomerDetail(id) {
  return get(`/api/cpms/cust/notValid/${id}`, {}).then((res) => res.data || {});
}

// 注册地址转换
export function postAddressTranslation(query) {
  return post('/api/cpms/baseAddressConfig/sky-eye-check-change-code', query).then(
    (res) => res.data || {}
  );
}
//分页获取反向客户关联列表
export function getRelateTheCustomerlistInReverse(query) {
  return get('/api/cpms/cust/page/relation-list', query).then((res) => ({
    data: res.data.records || {},
    totalSize: (res.data || {}).total,
  }));
}

// 查看所有客户列表信息
export function getAllCustList(query) {
  return get('/api/cpms/cust/list', query).then((res) => ({
    data: res.data.records || {},
    totalSize: (res.data || {}).total,
  }));
}

// sap客户反向关联意向客户
export function postInverselyCorrelatedCustomer(query) {
  return post('/api/cpms/custSapRelation/inversely-correlated-customer', query).then(
    (res) => res
  );
}

// 关联失败的客户关联公司
export function postRelationCompany(query) {
  return post('/api/cpms/custSapCustomer/relation-company', query).then(
    (res) => res.data || {}
  );
}

/** 分配业务员 */
export function putDistributeSalesman(form) {
  return put(`/api/cpms/cust/edit-login-name`, form).then((res) => res.data || {});
}

// 根据id获取sap正式客户
export function getCustSapCustomer(id) {
  return get(`/api/cpms/custSapCustomer/${id}`, {}).then((res) => res.data || {});
}

// 根据id获取关联sap正式客户id
export function getCustSapCustomerId(id) {
  return get(`/api/cpms/custMainSapRelate/${id}`, {}).then((res) => res.data || {});
}

// sap正式客户列表
export function getSapCustomerList(query) {
  return get('/api/cpms/custSapMain/list', query).then((res) => ({
    data: res.data.records || {},
    totalSize: (res.data || {}).total,
  }));
}

// sap正式客户新增
export function postCreateSAPCustomer(query) {
  return post(`/api/cpms/custSapMain`, query).then((res) => res.data || {});
}

/** 获取省级列表 */
export function getProvinceList(query) {
  return get('/api/cpms/baseSapAddress/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取市级列表 */
export function getCityList(query) {
  return get('/api/cpms/baseSapAddress/city-list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取县区列表 */
export function getCountyList(query) {
  return get('/api/cpms/baseSapAddress/county-list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

/** 获取县级、街道列表 */
export function getStreetList(query) {
  return get('/api/cpms/baseSapAddress/street-list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

// 正式客户spa地址转换
export function postSapAddressTransformation(query) {
  return post('/api/cpms/baseAddressConfig/spd-change-sap', query).then(
    (res) => res.data || {}
  );
}

// 获取当前登录人部门
export function getDepartment(data) {
  return get(`/api/poros-permission/secStaff/getByUid`, data).then(
    (res) => res.data || {}
  );
}

// 根据sap获取推送记录
export function getPushRecord(id) {
  return get(`/api/cpms/custSyncfsscResultInfo/${id}`, {}).then((res) => res.data || {});
}

// 获取业务员
export function getSalesman(data) {
  // /api/cpms/baseAccount/accountInfo
  return get(`/api/cpms/baseAccount/list`, data).then((res) => res.data || {});
}

// 获取销售组织
export function getSalesOrganization(data) {
  return get(`/api/cpms/baseSaleOrg/list`, data).then((res) => res.data || {});
}

// 获取经营部列表
export function getBusinessDepartment(data) {
  return get(`/api/cpms/baseSaleOffice/list`, data).then((res) => res.data || {});
}

// 获取分销渠道
export function getDistributionChannel(data) {
  return get('/api/poros-permission/dict/data/list', {
    systemCode: 'cpms',
    dictCode: 'cpms_sap_channel',
  }).then((res) => ({
    ...res,
    data: (res.data || []).map((d) => ({
      text: d.dataLabel,
      value: d.dataValue,
    })),
  }));
}

// 获取一级渠道
export function getLevelChannel(data) {
  return get(`/api/cpms/baseChannelOrg/getChannelOneTwoThreeBySaleCode/${data}`, {}).then(
    (res) => res.data || {}
  );
}

// 获取下一级渠道
export function getNextLevelChannel(data) {
  return get(`/api/cpms/baseChannel/getChannelByChannel/${data}`, {}).then(
    (res) => res.data || {}
  );
}

// 获取产品组
export function getProductGroupList(data) {
  return get('/api/poros-permission/dict/data/list', {
    systemCode: 'cpms',
    dictCode: 'cpms_sap_division',
  }).then((res) => ({
    ...res,
    data: (res.data || []).map((d) => ({
      text: d.dataLabel,
      value: d.dataValue,
    })),
  }));
}

// 获取国际贸易条件
export function getTermsTrade(data) {
  return get('/api/poros-permission/dict/data/list', {
    systemCode: 'cpms',
    dictCode: 'cpms_incoTerm',
  }).then((res) => ({
    ...res,
    data: (res.data || []).map((d) => ({
      text: d.dataLabel,
      value: d.dataValue,
    })),
  }));
}

// 根据id获取sap客户信息
export function getCustSapMain(id) {
  return get(`/api/cpms/custSapMain/${id}`).then((res) => res.data || {});
}

// 根据CustMainId 获取关联客户信息（意向转sap）
export function getRelatedCust(id) {
  return get(`/api/cpms/cust/${id}`, {}).then((res) => res.data || {});
}
