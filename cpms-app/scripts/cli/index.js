const inquire = require('inquirer');

const CHOICES = {
  CREATE_MODULE: 0,
  FORMAT_CODE: 1,
};

const ACTIONS = {
  [CHOICES.CREATE_MODULE]: require('./create-module'),
  [CHOICES.FORMAT_CODE]: require('./format-code'),
};

const choices = [
  {
    name: '新建模块',
    value: 0,
  },
  {
    name: '代码格式化',
    value: 1,
  },
];

inquire
  .prompt({
    name: 'action',
    message: '请选择执行的操作',
    type: 'list',
    choices,
  })
  .then((answer) => {
    !!ACTIONS[answer.action] && ACTIONS[answer.action]();
  });
