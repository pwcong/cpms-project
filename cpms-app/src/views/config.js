import imgClue from '@/assets/images/clue.svg';
import imgCustomer from '@/assets/images/customer.svg';
import imgProject from '@/assets/images/project.svg';
import imgPrice from '@/assets/images/price.svg';
import imgContract from '@/assets/images/contract.svg';
import imgLocation from '@/assets/images/location.svg';
import imgCalendar from '@/assets/images/calendar.svg';

import imgPosition from '@/assets/images/position.svg';
import imgList from '@/assets/images/list.svg';
import imgGame from '@/assets/images/game.svg';
import imgReport1 from '@/assets/images/report1.svg';
import imgOrder from '@/assets/images/order.svg';
import imgReport4 from '@/assets/images/report4.svg';
import imgDoc from '@/assets/images/document.svg';
import imgIssue from '@/assets/images/issue.svg';
import imgPC from '@/assets/images/pc.svg';
import imgData from '@/assets/images/data.svg';
import imgModule from '@/assets/images/module.svg';

export const MODULES = [
  {
    title: '线索管理',
    path: '/Clue',
    children: [
      {
        icon: imgClue,
        path: '/Clue/ClueList/MyCreate',
        title: '我创建的',
      },
      {
        icon: imgClue,
        path: '/Clue/ClueList/AllocationMe',
        title: '我跟进的',
      },
      {
        icon: imgClue,
        path: '/Clue/ClueList/MyAllocation',
        title: '我分配的',
      },
      {
        icon: imgClue,
        path: '/Clue/CluePool',
        title: '线索池',
      },
      {
        icon: imgClue,
        path: '/Clue/CluePick',
        title: '淘一淘',
      },
    ],
  },
  {
    title: '客户管理',
    path: '/Customer',
    children: [
      {
        icon: imgCustomer,
        path: '/Customer/InterdCustomerList',
        title: '意向客户',
      },
      {
        icon: imgCustomer,
        path: '/Customer/SAPCustomerList',
        title: '正式客户',
      },
      {
        icon: imgCustomer,
        path: '/Customer/InvalidCustomerList',
        title: '无效客户',
      },
    ],
  },
  {
    title: '商机管理',
    path: '/Business',
    children: [
      {
        icon: imgProject,
        path: '/Business/ProjectList',
        title: '项目列表',
      },
      {
        icon: imgProject,
        path: '/Business/ProjectQuery',
        title: '项目查重',
      },
      {
        icon: imgProject,
        path: '/Business/ProjectSurvey',
        title: '项目推进状态',
      },
      {
        icon: imgContract,
        path: '/Business/Grant/GrantList',
        title: '授权查询',
      },
      {
        icon: imgPrice,
        path: '/Business/Price/PriceList',
        title: '价格查询',
      },
      {
        icon: imgContract,
        path: '/Business/Contract/ContractList',
        title: '合同查询',
      },
    ],
  },
  {
    title: '业务员管理',
    path: '/Salesman',
    children: [
      {
        icon: imgPosition,
        path: '/Salesman/Clock/ClockIn',
        title: '考勤打卡',
      },
      {
        icon: imgList,
        path: '/Salesman/Clock/ClockList',
        title: '考勤打卡列表',
      },
      {
        icon: imgPosition,
        path: '/Salesman/Clock/ExternalClockIn',
        title: '外勤打卡',
      },
      {
        icon: imgList,
        path: '/Salesman/Clock/OutclockList',
        title: '外勤打卡列表',
      },
      {
        icon: imgCalendar,
        path: '/Salesman/Weekly/WeeklyList',
        title: '周报列表',
      },
      {
        icon: imgLocation,
        path: '/Salesman/Visit/VisitList',
        title: '拜访计划',
      },
    ],
  },
  {
    title: '订单管理',
    path: '/Order',
    children: [
      {
        icon: imgOrder,
        path: '/Order/SalesOrderList',
        title: '销售单列表',
      },
    ],
  },
  {
    title: '报表管理',
    path: '/Report',
    children: [
      {
        icon: imgReport4,
        path: '/Report/ReportOverview',
        title: '报表概览',
      },
      {
        icon: imgReport4,
        path: '/Report/BasicReport',
        title: '基础信息报表',
        children: [
          {
            icon: imgReport4,
            path: '/Report/BasicReport/ProjectReport',
            title: '项目报备统计表',
          },
          {
            icon: imgReport4,
            path: '/Report/BasicReport/PriceReport',
            title: '价格申请统计表',
          },
        ],
      },
      {
        icon: imgReport4,
        path: '/Report/TeamReport',
        title: '团队报表',
        children: [
          {
            icon: imgReport4,
            path: '/Report/TeamReport/SummaryReport',
            title: '团队汇总报表',
          },
          {
            icon: imgReport4,
            path: '/Report/TeamReport/ClockInReport',
            title: '团队打卡报表',
          },
        ],
      },
      {
        icon: imgReport4,
        path: '/Report/ManagerReport',
        title: '管理者报表',
      },
    ],
  },
  {
    title: '个人空间',
    path: '/Own',
    children: [
      {
        icon: imgIssue,
        path: '/Own/IssueList',
        title: '我的反馈',
      },
    ],
  },

  {
    title: '后台管理',
    path: '/Admin',
    children: [
      // {
      //   icon: imgGame,
      //   path: '/Admin/Test',
      //   title: '开发测试',
      //   auth: false,
      // },
      {
        icon: imgData,
        path: '/Admin/BaseData',
        title: '基础数据管理',
        children: [
          {
            path: '/Admin/BaseData/Customer',
            title: '客户',
            icon: imgDoc,
          },
          {
            path: '/Admin/BaseData/Corporate',
            title: '法人',
            icon: imgDoc,
          },
          {
            path: '/Admin/BaseData/Warehouse',
            title: '仓库',
            icon: imgDoc,
          },
          {
            path: '/Admin/BaseData/CustomerAddress',
            title: '客户地址',
            icon: imgDoc,
          },
          {
            path: '/Admin/BaseData/Product',
            title: '产品',
            icon: imgDoc,
          },
          {
            path: '/Admin/BaseData/ProductCate',
            title: '产品分类',
            icon: imgDoc,
          },
          {
            path: '/Admin/BaseData/ProductLine',
            title: '产品线',
            icon: imgDoc,
          },
          {
            path: '/Admin/BaseData/Province',
            title: '省',
            icon: imgDoc,
          },
          {
            path: '/Admin/BaseData/City',
            title: '市',
            icon: imgDoc,
          },
          {
            path: '/Admin/BaseData/County',
            title: '县区',
            icon: imgDoc,
          },
          {
            path: '/Admin/BaseData/Street',
            title: '街道',
            icon: imgDoc,
          },
          {
            path: '/Admin/BaseData/Agency',
            title: '机构',
            icon: imgDoc,
          },
          {
            path: '/Admin/BaseData/Business',
            title: '商务中心',
            icon: imgDoc,
          },
        ],
      },
      {
        icon: imgModule,
        path: '/Admin/ModuleManage',
        title: '业务模块管理',
        children: [
          {
            icon: imgDoc,
            path: '/Admin/ModuleManage/Clue',
            title: '线索模块',
          },
          {
            icon: imgDoc,
            path: '/Admin/ModuleManage/Customer',
            title: '客户模块',
            children: [
              {
                icon: imgDoc,
                path: '/Admin/ModuleManage/Customer/InterdCustomerList',
                title: '意向客户',
              },
              {
                icon: imgDoc,
                path: '/Admin/ModuleManage/Customer/SAPCustomerSyncList',
                title: '同步成功客户',
              },
              {
                icon: imgDoc,
                path: '/Admin/ModuleManage/Customer/SAPCustomerSyncWithoutSalesmanList',
                title: '无业务员客户',
              },
              {
                icon: imgDoc,
                path: '/Admin/ModuleManage/Customer/SAPCustomerSyncFailedList',
                title: '同步失败客户',
              },
            ],
          },
          {
            icon: imgDoc,
            path: '/Admin/ModuleManage/Project',
            title: '项目模块',
            children: [
              {
                icon: imgDoc,
                path: '/Admin/ModuleManage/Project/ProjectList',
                title: '项目',
              },
            ],
          },
          {
            icon: imgDoc,
            path: '/Admin/ModuleManage/Grant',
            title: '授权模块',
          },
          {
            icon: imgDoc,
            path: '/Admin/ModuleManage/Price',
            title: '价格模块',
          },
          {
            icon: imgDoc,
            path: '/Admin/ModuleManage/Contract',
            title: '合同模块',
          },
          {
            icon: imgDoc,
            path: '/Admin/ModuleManage/Salesman',
            title: '业务员模块',
            children: [
              {
                icon: imgDoc,
                path: '/Admin/ModuleManage/Salesman/AttendanceList',
                title: '考勤',
              },
              {
                icon: imgDoc,
                path: '/Admin/ModuleManage/Salesman/WeeklyList',
                title: '周报',
              },
              {
                icon: imgDoc,
                path: '/Admin/ModuleManage/Salesman/VisitList',
                title: '拜访',
              },
            ],
          },
        ],
      },
      {
        icon: imgPC,
        path: '/Admin/SystemManage',
        title: '系统运维管理',
        children: [
          {
            icon: imgIssue,
            path: '/Admin/SystemManage/IssueList',
            title: '问题列表',
          },
          {
            icon: imgDoc,
            path: '/Admin/SystemManage/ReleaseLog',
            title: '发版日志',
          },
        ],
      },
    ],
  },
];
