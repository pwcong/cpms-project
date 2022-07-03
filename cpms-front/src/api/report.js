import { get, post, put, del } from 'poros/http';
//报表接口
//近半年新增统计表
export function getSemesterOverview(query) {
  return get('/api/cpms/report/total-trend', query).then((d) => {
    return d.data || {};
  });
}
// 本月转换统计率
export function getConversions(query) {
  return get('/api/cpms/report/conversion-rate', query).then((d) => {
    return d.data || {};
  });
}
//本月或本周项目报备情况
export function getProjectDistributionState(query) {
  return get('/api/cpms/project-main-report/get-project-filing', query).then((d) => {
    return d.data || {};
  });
}
//本月或本周客户新增情况
export function getCustMain(query) {
  return get('/api/cpms/custMain/get-cust-new-situation', query).then((d) => {
    return d.data || {};
  });
}
//客户渠道分布
export function getCustMainChannel(query) {
  return get('/api/cpms/custMain/channel', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-排行榜-客户排行榜
export function getRankList(query) {
  return get('/api/cpms/rank-list/customer-rank-list', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-排行榜-项目排行榜
export function getProjectRankList(query) {
  return get('/api/cpms/rank-list/project-rank-list', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-排行榜-线索排行榜
export function getClueRankList(query) {
  return get('/api/cpms/rank-list/clue-rank-list', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-排行榜-拜访
export function getVisitList(query) {
  return get('/api/cpms/rank-list/visit', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-线索页面
export function getClueReport(query) {
  return get('/api/cpms/clueMain/clue-report', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-线索页面
export function getClueMainClueStatus(query) {
  return get('/api/cpms/clueMain/clue-status', query).then((d) => {
    return d.data || {};
  });
}
//新增线索商务部分布
export function getDepartmentDistributed(query) {
  return get('/api/cpms/clueMain/commerce-department-distributed', query).then((d) => {
    return d.data || {};
  });
}
/** 报表的商务中心列表*/
export function getReportDeptConfig(query) {
  return get('/api/cpms/reportDeptConfig/list', query).then((res) => ({
    data: (res.data || {}).records,
    totalSize: (res.data || {}).total,
  }));
}

// 获取业务员列表
export function getSalesmanList(query) {
  return get('/api/cpms/report/salesman-list', query).then((d) => {
    return d.data || [];
  });
}

// 获取业务员详情
export function getSalesmanDetail(query) {
  return get('/api/cpms/report/get-details', query).then((d) => {
    return d.data || {};
  });
}
//业务员详情-近半年新增记录统计
export function getReportTotalTrend(query) {
  return get('/api/cpms/report/total-trend', query).then((d) => {
    return d.data || {};
  });
}
//业务员详情-客户行业分布&管理者报表-客户行业分布
export function getCustMainIndustry(query) {
  return get('/api/cpms/custMain/industry', query).then((d) => {
    return d.data || {};
  });
}
//业务员详情-项目行业分布&&管理者报表-项目-项目行业分布
export function getProjectIndustry(query) {
  return get('/api/cpms/project-main-report/project-industry', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-客户-
export function getCustMainReport(query) {
  return get('/api/cpms/custMain/report', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-客户-新增客户商务中心占比
export function getCustMainNewCreate(query) {
  return get('/api/cpms/custMain/new-create', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-项目-项目统计
export function getProjectMainReportProjectReport(query) {
  return get('/api/cpms/project-main-report/project-report', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-项目-项目渠道分布
export function getProjectMainReportChannel(query) {
  return get('/api/cpms/project-main-report/channel', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-项目-新增项目商务中心占比
export function getProjectMainReportNewCreate(query) {
  return get('/api/cpms/project-main-report/new-create', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-项目-项目类型统计
export function getProjectTypeName(query) {
  return get('/api/cpms/project-main-report/project_type_name', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-项目-新增项目阶段统计
export function getProjectTypeStatus(query) {
  return get('/api/cpms/project-main-report/project_type_status', query).then((d) => {
    return d.data || {};
  });
}
//管理者报表-项目-新增报备产品型号统计
export function getProjectProduct(query) {
  return get('/api/cpms/project-main-report/project_product', query).then((d) => {
    return d.data || {};
  });
}
