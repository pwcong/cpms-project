const inquire = require('inquirer');
const mustache = require('mustache');
const fs = require('fs-extra');
const path = require('path');

const { viewPath } = require('../config');

async function initDirs(parent, children) {
  if (!fs.existsSync(parent)) {
    fs.mkdirpSync(parent);
  }

  if (children.some((c) => !!fs.existsSync(c))) {
    const goon = await inquire
      .prompt({
        type: 'confirm',
        name: 'goon',
        message: '模块已存在，是否确认清空并继续？',
      })
      .then((res) => res.goon);

    if (!goon) {
      throw undefined;
    }

    children.forEach((c) => fs.emptyDirSync(c));
  }

  children.forEach((c) => {
    !fs.existsSync(c) && fs.mkdirSync(c);
  });
}

function writeCode(target, tmpl, options) {
  fs.writeFileSync(
    target,
    mustache.render(
      fs.readFileSync(tmpl, {
        encoding: 'utf-8',
      }),
      options,
      {},
      ['<%', '%>']
    ),
    {
      encoding: 'utf-8',
    }
  );
}

async function createByRouteMode(options) {
  const { parentRoute, editRoute, detailRoute, listRoute } = options;

  const parentDir = path.join(viewPath, parentRoute);
  const editDir = path.join(viewPath, editRoute);
  const detailDir = path.join(viewPath, detailRoute);
  const listDir = path.join(viewPath, listRoute);

  try {
    await initDirs(parentDir, [editDir, detailDir, listDir]);

    writeCode(
      path.join(editDir, 'index.vue'),
      path.join(__dirname, 'tmpl/view_edit.tmpl'),
      options
    );
    writeCode(
      path.join(editDir, 'form.js'),
      path.join(__dirname, 'tmpl/js_form.tmpl'),
      options
    );
    writeCode(
      path.join(detailDir, 'index.vue'),
      path.join(__dirname, 'tmpl/view_detail.tmpl'),
      options
    );
    writeCode(
      path.join(listDir, 'index.vue'),
      path.join(__dirname, 'tmpl/view_list.tmpl'),
      options
    );
  } catch (e) {
    console.error(e);
  }
}

async function createByModalMode(options) {
  const { enName, parentRoute } = options;

  const parentDir = path.join(viewPath, parentRoute);
  const moduleDir = path.join(parentDir, enName);

  try {
    await initDirs(parentDir, [moduleDir]);

    writeCode(
      path.join(moduleDir, 'index.vue'),
      path.join(__dirname, 'tmpl/modal_module.tmpl'),
      options
    );
    writeCode(
      path.join(moduleDir, 'setting-item.vue'),
      path.join(__dirname, 'tmpl/modal_setting.tmpl'),
      options
    );
  } catch (e) {
    console.error(e);
  }
}

const MODE = {
  ROUTTE: '路由模式',
  MODAL: '弹窗模式',
};

module.exports = function () {
  inquire
    .prompt([
      {
        name: 'mode',
        message: '请选择页面模式',
        type: 'list',
        choices: [MODE.ROUTTE, MODE.MODAL],
      },
      {
        name: 'cnName',
        message: '请输入模块中文名称',
        type: 'input',
        validate(v) {
          return !!v;
        },
      },
      {
        name: 'enName',
        message: '请输入模块英文名称',
        type: 'input',
        validate(v) {
          return !!v;
        },
      },
      {
        name: 'parentRoute',
        message: '请输入父级路由地址',
        default: '/',
        type: 'input',
        validate(v) {
          return !!v;
        },
      },
    ])
    .then(async (answer) => {
      const { mode, cnName, enName, parentRoute } = answer;

      const createRoute = `${parentRoute}/${enName}Create`;
      const editRoute = `${parentRoute}/${enName}Edit`;
      const detailRoute = `${parentRoute}/${enName}Detail`;
      const listRoute = `${parentRoute}/${enName}List`;

      const options = {
        cnName,
        enName,
        parentRoute,
        createRoute,
        editRoute,
        detailRoute,
        listRoute,
      };

      switch (mode) {
        case MODE.ROUTTE:
          createByRouteMode(options);
          break;
        case MODE.MODAL:
          createByModalMode(options);
          break;
        default:
          break;
      }
    });
};
