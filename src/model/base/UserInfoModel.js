import request from 'superagent'
export default {

  /*登录接口*/
  async loginSubmit(param){
    return new Promise(function (resolve, reject) {
      request
        .post('/web/user/login')
        .type('form')
        .send(param)
        .accept('json')
        .end(function (err, res) {
          if (res.status == 200) {
            resolve(res.body)
          } else {
            resolve({status: false, reason: "操作失败请重试"})
          }
        });
    });
  },
  /*登录接口*/
  async getUserInfo(){
    return new Promise(function (resolve, reject) {
      request
        .get('/web/user/getUserInfo')
        .type('form')
        .accept('json')
        .end(function (err, res) {
          if (res.status == 200) {
            resolve(res.body)
          } else {
            resolve({status: false, reason: "操作失败请重试"})
          }
        });
    });
  },

  /*登录接口*/
  async bindSubmit(param){
    return new Promise(function (resolve, reject) {
      request
        .post('/web/user/bind')
        .type('form')
        .send(param)
        .accept('json')
        .end(function (err, res) {
          if (res.status == 200) {
            resolve(res.body)
          } else {
            resolve({status: false, reason: "操作失败请重试"})
          }
        });
    });
  },


  /*修改密码接口*/
  async submitChangePassword(param){
    return new Promise(function (resolve, reject) {
      request
        .post('/web/login/changePassword')
        .type('form')
        .send(param)
        .accept('json')
        .end(function (err, res) {
          if (res.status == 200) {
            resolve(res.body)
          } else {
            resolve({status: false, reason: "操作失败请重试"})
          }
        });
    });
  },

}
