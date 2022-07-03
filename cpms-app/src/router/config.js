export const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/index'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  {
    path: '/sso',
    name: 'SSO',
    component: () => import('@/views/sso.vue'),
    meta: {
      auth: false,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login.vue'),
    meta: {
      auth: false,
    },
  },
  {
    path: '/Business/ProjectList',
    name: 'ProjectList',
    component: () => import('@/views/Business/ProjectList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  {
    path: '/Business/ProjectDetail/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/Business/ProjectDetail'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/Business/ProjectEdit/:id',
    name: 'ProjectEdit',
    component: () => import('@/views/Business/ProjectEdit'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/Business/ProjectCreate',
    name: 'ProjectCreate',
    component: () => import('@/views/Business/ProjectEdit'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/Business/ProjectFollow/:id',
    name: 'ProjectFollow',
    component: () => import('@/views/Business/ProjectFollow'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/Business/ProjectQuery',
    name: 'ProjectQuery',
    component: () => import('@/views/Business/ProjectQuery'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  {
    path: '/Business/ProjectSurvey',
    name: 'ProjectSurvey',
    component: () => import('@/views/Business/ProjectSurvey'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  // 授权列表
  {
    path: '/Business/Grant/GrantList',
    name: 'GrantList',
    component: () => import('@/views/Business/Grant/GrantList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  // 授权详情
  {
    path: '/Business/Grant/GrantDetail/:id',
    name: 'GrantDetail',
    component: () => import('@/views/Business/Grant/GrantDetail'),
    meta: {
      auth: true,
    },
  },
  // 授权新建
  {
    path: '/Business/Grant/GrantCreate',
    name: 'GrantCreate',
    component: () => import('@/views/Business/Grant/GrantEdit'),
    meta: {
      auth: true,
    },
  },
  //授权编辑
  {
    path: '/Business/Grant/GrantEdit/:id',
    name: 'GrantEdit',
    component: () => import('@/views/Business/Grant/GrantEdit'),
    meta: {
      auth: true,
    },
  },
  // 合同列表
  {
    path: '/Business/Contract/ContractList',
    name: 'ContractList',
    component: () => import('@/views/Business/Contract/ContractList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  // 合同新建
  {
    path: '/Business/Contract/ContractCreate',
    name: 'ContractCreate',
    component: () => import('@/views/Business/Contract/ContractEdit'),
    meta: {
      auth: true,
    },
  },
  // 合同编辑
  {
    path: '/Business/Contract/ContractEdit/:id',
    name: 'ContractEdit',
    component: () => import('@/views/Business/Contract/ContractEdit'),
    meta: {
      auth: true,
    },
  },
  // 合同详情
  {
    path: '/Business/Contract/ContractDetail/:id',
    name: 'ContractDetail',
    component: () => import('@/views/Business/Contract/ContractDetail'),
    meta: {
      auth: true,
    },
  },

  // 价格列表
  {
    path: '/Business/Price/PriceList',
    name: 'PriceList',
    component: () => import('@/views/Business/Price/PriceList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  // 价格详情
  {
    path: '/Business/Price/PriceDetail/:id',
    name: 'PriceDetail',
    component: () => import('@/views/Business/Price/PriceDetail'),
    meta: {
      auth: true,
    },
  },
  // 价格编辑
  {
    path: '/Business/Price/PriceEdit/:id',
    name: 'PriceEdit',
    component: () => import('@/views/Business/Price/PriceEdit'),
    meta: {
      auth: true,
    },
  },
  //价格新建 /Business/Price/PriceCreate
  {
    path: '/Business/Price/PriceCreate',
    name: 'PriceEdit',
    component: () => import('@/views/Business/Price/PriceEdit'),
    meta: {
      auth: true,
    },
  },
  // 意向客户列表
  {
    path: '/Customer/InterdCustomerList',
    name: 'InterdCustomerList',
    component: () => import('@/views/Customer/InterdCustomerList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  // 正式客户列表
  {
    path: '/Customer/SAPCustomerList',
    name: 'SAPCustomerList',
    component: () => import('@/views/Customer/SAPCustomerList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  // 正式客户详情
  {
    path: '/Customer/SAPCustomerDetail/:id',
    name: 'SAPCustomerDetail',
    component: () => import('@/views/Customer/SAPCustomerDetail'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  // 正式客户新建
  {
    path: '/Customer/SAPCustomerCreate/',
    name: 'SAPCustomerCreate',
    component: () => import('@/views/Customer/SAPCustomerEdit'),
    meta: {
      auth: true,
    },
  },
  // 正式客户编辑
  {
    path: '/Customer/SAPCustomerEdit/:id',
    name: 'SAPCustomerEdit',
    component: () => import('@/views/Customer/SAPCustomerEdit'),
    meta: {
      auth: true,
    },
  },
  // 无效客户列表
  {
    path: '/Customer/InvalidCustomerList',
    name: 'InvalidCustomerList',
    component: () => import('@/views/Customer/InvalidCustomerList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  // 意向客户详情
  {
    path: '/Customer/InterdCustomerDetail/:id',
    name: 'InterdCustomerDetail',
    component: () => import('@/views/Customer/InterdCustomerDetail'),
    meta: {
      auth: true,
    },
  },
  // 意向客户新建
  {
    path: '/Customer/InterdCustomerCreate/',
    name: 'InterdCustomerCreate',
    component: () => import('@/views/Customer/InterdCustomerEdit'),
    meta: {
      auth: true,
    },
  },
  // 意向客户编辑
  {
    path: '/Customer/InterdCustomerEdit/:id',
    name: 'InterdCustomerEdit',
    component: () => import('@/views/Customer/InterdCustomerEdit'),
    meta: {
      auth: true,
    },
  },
  //线索池
  {
    path: '/Clue/CluePool',
    name: 'CluePool',
    component: () => import('@/views/Clue/CluePool'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },

  //淘一淘
  {
    path: '/Clue/CluePick',
    name: 'CluePick',
    component: () => import('@/views/Clue/CluePick'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },

  // 线索我跟进的列表
  {
    path: '/Clue/ClueList/AllocationMe',
    name: 'ClueAllocationMe',
    component: () => import('@/views/Clue/ClueList/allocation-me.vue'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },

  //线索我分配的列表
  {
    path: '/Clue/ClueList/MyAllocation',
    name: 'ClueMyAllocation',
    component: () => import('@/views/Clue/ClueList/my-allocation.vue'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },

  //线索我创建的列表
  {
    path: '/Clue/ClueList/MyCreate',
    name: 'ClueMyCreate',
    component: () => import('@/views/Clue/ClueList/my-create.vue'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //线索新增
  {
    path: '/Clue/ClueCreate',
    name: 'ClueCreate',
    component: () => import('@/views/Clue/ClueEdit'),
    meta: {
      auth: true,
    },
  },
  //线索编辑
  {
    path: '/Clue/ClueEdit/:id',
    name: 'ClueEdit',
    component: () => import('@/views/Clue/ClueEdit'),
    meta: {
      auth: true,
    },
  },
  //线索详情页
  {
    path: '/Clue/ClueDetail/:id',
    name: 'ClueDetail',
    component: () => import('@/views/Clue/ClueDetail'),
    meta: {
      auth: true,
    },
  },
  //考勤打卡
  {
    path: '/Salesman/Clock/ClockIn',
    name: 'ClockClockIn',
    component: () => import('@/views/Salesman/Clock/ClockIn'),
    meta: {
      auth: true,
    },
  },
  //考勤打卡列表
  {
    path: '/Salesman/Clock/ClockList',
    name: 'ClockList',
    component: () => import('@/views/Salesman/Clock/ClockList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //外勤打卡列表
  {
    path: '/Salesman/Clock/OutclockList',
    name: 'OutclockList',
    component: () => import('@/views/Salesman/Clock/OutclockList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //外勤打卡详情
  {
    path: '/Salesman/Clock/OutclockDetail/:id',
    name: 'OutclockDetail',
    component: () => import('@/views/Salesman/Clock/OutclockDetail'),
    meta: {
      auth: true,
    },
  },
  //外勤打卡
  {
    path: '/Salesman/Clock/ExternalClockIn',
    name: 'ExternalClockIn',
    component: () => import('@/views/Salesman/Clock/ExternalClockIn'),
    meta: {
      auth: true,
    },
  },
  //周报列表
  {
    path: '/Salesman/Weekly/WeeklyList',
    name: 'WeeklyList',
    component: () => import('@/views/Salesman/Weekly/WeeklyList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //周报详情
  {
    path: '/Salesman/Weekly/WeeklyDetail/:id',
    name: 'WeeklyDetail',
    component: () => import('@/views/Salesman/Weekly/WeeklyDetail'),
    meta: {
      auth: true,
    },
  },
  //周报新建
  {
    path: '/Salesman/Weekly/WeeklyCreate',
    name: 'WeeklyCreate',
    component: () => import('@/views/Salesman/Weekly/WeeklyEdit'),
    meta: {
      auth: true,
    },
  },
  //周报编辑
  {
    path: '/Salesman/Weekly/WeeklyEdit/:id',
    name: 'WeeklyEdit',
    component: () => import('@/views/Salesman/Weekly/WeeklyEdit'),
    meta: {
      auth: true,
    },
  },
  //拜访列表
  {
    path: '/Salesman/Visit/VisitList',
    name: 'VisitList',
    component: () => import('@/views/Salesman/Visit/VisitList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //拜访计划新建
  {
    path: '/Salesman/Visit/VisitCreate',
    name: 'VisitCreate',
    component: () => import('@/views/Salesman/Visit/VisitEdit'),
    meta: {
      auth: true,
    },
  },
  //拜访计划编辑
  {
    path: '/Salesman/Visit/VisitEdit/:id',
    name: 'VisitEdit',
    component: () => import('@/views/Salesman/Visit/VisitEdit'),
    meta: {
      auth: true,
    },
  },
  //拜访反馈新建
  {
    path: '/Salesman/Visit/VisitFeedbackCreate',
    name: 'VisitFeedbackCreate',
    component: () => import('@/views/Salesman/Visit/VisitFeedback'),
    meta: {
      auth: true,
    },
  },
  //拜访反馈编辑
  {
    path: '/Salesman/Visit/VisitFeedbackEdit/:id',
    name: 'VisitFeedbackEdit',
    component: () => import('@/views/Salesman/Visit/VisitFeedback'),
    meta: {
      auth: true,
    },
  },
  //拜访详情
  {
    path: '/Salesman/Visit/VisitDetail/:id',
    name: 'VisitDetail',
    component: () => import('@/views/Salesman/Visit/VisitDetail'),
    meta: {
      auth: true,
    },
  },
  //拜访打卡
  {
    path: '/Salesman/Visit/ClockIn',
    name: 'VisitClockIn',
    component: () => import('@/views/Salesman/Visit/ClockIn'),
    meta: {
      auth: true,
    },
  },
  {
    path: '/Admin/Test',
    name: 'AdminTest',
    component: () => import('@/views/Admin/Test'),
    meta: {
      auth: true,
    },
  },
  //后台管理-基础数据模块-客户
  {
    path: '/Admin/BaseData/Customer',
    name: 'Customer',
    component: () => import('@/views/Admin/BaseData/Customer'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-基础数据模块-法人
  {
    path: '/Admin/BaseData/Corporate',
    name: 'Corporate',
    component: () => import('@/views/Admin/BaseData/Corporate'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-基础数据模块-仓库
  {
    path: '/Admin/BaseData/Warehouse',
    name: 'Warehouse',
    component: () => import('@/views/Admin/BaseData/Warehouse'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-基础数据模块-客户地址
  {
    path: '/Admin/BaseData/CustomerAddress',
    name: 'CustomerAddress',
    component: () => import('@/views/Admin/BaseData/CustomerAddress'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-基础数据模块-产品
  {
    path: '/Admin/BaseData/Product',
    name: 'Product',
    component: () => import('@/views/Admin/BaseData/Product'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-基础数据模块-产品分类
  {
    path: '/Admin/BaseData/ProductCate',
    name: 'ProductCate',
    component: () => import('@/views/Admin/BaseData/ProductCate'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-基础数据模块-产品线
  {
    path: '/Admin/BaseData/ProductLine',
    name: 'ProductLine',
    component: () => import('@/views/Admin/BaseData/ProductLine'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-基础数据模块-省
  {
    path: '/Admin/BaseData/Province',
    name: 'Province',
    component: () => import('@/views/Admin/BaseData/Province'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-基础数据模块-市
  {
    path: '/Admin/BaseData/City',
    name: 'City',
    component: () => import('@/views/Admin/BaseData/City'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-基础数据模块-县
  {
    path: '/Admin/BaseData/County',
    name: 'County',
    component: () => import('@/views/Admin/BaseData/County'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-基础数据模块-街道
  {
    path: '/Admin/BaseData/Street',
    name: 'Street',
    component: () => import('@/views/Admin/BaseData/Street'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-基础数据模块-机构
  {
    path: '/Admin/BaseData/Agency',
    name: 'Agency',
    component: () => import('@/views/Admin/BaseData/Agency'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-基础数据模块-商务中心
  {
    path: '/Admin/BaseData/Business',
    name: 'Business',
    component: () => import('@/views/Admin/BaseData/Business'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-业务员模块-合同模块
  {
    path: '/Admin/ModuleManage/Contract',
    name: 'Contract',
    component: () => import('@/views/Admin/ModuleManage/Contract'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-业务员模块-价格模块
  {
    path: '/Admin/ModuleManage/Price',
    name: 'Price',
    component: () => import('@/views/Admin/ModuleManage/Price'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-业务员模块-授权模块
  {
    path: '/Admin/ModuleManage/Grant',
    name: 'Grant',
    component: () => import('@/views/Admin/ModuleManage/Grant'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-业务员模块-同步客户无业务员模块
  {
    path: '/Admin/ModuleManage/Customer/SAPCustomerSyncWithoutSalesmanList',
    name: 'SAPCustomerSyncWithoutSalesmanList',
    component: () => import('@/views/Admin/ModuleManage/Customer/SAPCustomerSyncWithoutSalesmanList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-业务员模块-同步失败客户模块
  {
    path: '/Admin/ModuleManage/Customer/SAPCustomerSyncFailedList',
    name: 'SAPCustomerSyncFailedList',
    component: () => import('@/views/Admin/ModuleManage/Customer/SAPCustomerSyncFailedList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-业务员模块-线索模块
  {
    path: '/Admin/ModuleManage/Clue',
    name: 'Clue',
    component: () => import('@/views/Admin/ModuleManage/Clue'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-业务员模块-意向客户模块
  {
    path: '/Admin/ModuleManage/Customer/InterdCustomerList',
    name: 'InterdCustomerList',
    component: () => import('@/views/Admin/ModuleManage/Customer/InterdCustomerList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-业务员模块-同步成功客户模块
  {
    path: '/Admin/ModuleManage/Customer/SAPCustomerSyncList',
    name: 'SAPCustomerSyncList',
    component: () => import('@/views/Admin/ModuleManage/Customer/SAPCustomerSyncList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-业务员模块-考勤
  {
    path: '/Admin/ModuleManage/Salesman/AttendanceList',
    name: 'AttendanceList',
    component: () => import('@/views/Admin/ModuleManage/Salesman/AttendanceList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-业务员模块-周报
  {
    path: '/Admin/ModuleManage/Salesman/WeeklyList',
    name: 'WeeklyList',
    component: () => import('@/views/Admin/ModuleManage/Salesman/WeeklyList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-业务员模块-拜访
  {
    path: '/Admin/ModuleManage/Salesman/VisitList',
    name: 'VisitList',
    component: () => import('@/views/Admin/ModuleManage/Salesman/VisitList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  {
    //订单管理
    path: '/Order/SalesOrderList',
    name: 'SalesOrderList',
    component: () => import('@/views/Order/SalesOrderList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  {
    //订单新建页
    path: '/Order/SalesOrderCreate',
    name: 'SalesOrderEdit',
    component: () => import('@/views/Order/SalesOrderEdit'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  {
    //订单编辑页
    path: '/Order/SalesOrderEdit/:id',
    name: 'SalesOrderEdit',
    component: () => import('@/views/Order/SalesOrderEdit'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  {
    //订单详情页
    path: '/Order/SalesOrderDetail/:id',
    name: 'SalesOrderDetail',
    component: () => import('@/views/Order/SalesOrderDetail'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  {
    //报表概览
    path: '/Report/ReportOverview',
    name: 'ReportOverview',
    component: () => import('@/views/Report/ReportOverview'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  {
    //管理者报表
    path: '/Report/ManagerReport',
    name: 'ManagerReport',
    component: () => import('@/views/Report/ManagerReport'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  {
    //团队汇总报表
    path: '/Report/TeamReport/SummaryReport',
    name: 'SummaryReport',
    component: () => import('@/views/Report/TeamReport/SummaryReport'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  {
    //团队打卡报表
    path: '/Report/TeamReport/ClockInReport',
    name: 'ClockInReport',
    component: () => import('@/views/Report/TeamReport/ClockInReport'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //后台管理-业务员模块-项目
  {
    path: '/Admin/ModuleManage/Project/ProjectList',
    name: 'ProjectList',
    component: () => import('@/views/Admin/ModuleManage/Project/ProjectList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  //个人空间-我的反馈
  {
    path: '/Own/IssueList',
    name: 'IssueList',
    component: () => import('@/views/Own/IssueList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },

  //后台管理-系统运维管理-问题列表
  {
    path: '/Admin/SystemManage/ReleaseLog',
    name: 'ReleaseLog',
    component: () => import('@/views/Admin/SystemManage/ReleaseLog'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },

  //后台管理-系统运维管理-问题列表
  {
    path: '/Admin/SystemManage/IssueList',
    name: 'IssueList',
    component: () => import('@/views/Admin/SystemManage/IssueList'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  // 基础数据报表-项目报表统计表
  {
    path: '/Report/BasicReport/ProjectReport',
    name: 'ProjectReport',
    component: () => import('@/views/Report/BasicReport/ProjectReport'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  // 基础数据报表-价格申请统计表
  {
    path: '/Report/BasicReport/PriceReport',
    name: 'PriceReport',
    component: () => import('@/views/Report/BasicReport/PriceReport'),
    meta: {
      keepAlive: true,
      auth: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
  },
  { path: '*', redirect: '/404' },
];
