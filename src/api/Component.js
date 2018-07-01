import request from 'superagent'
export default {

    checkIsWechat(){
        let ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },

  /*检查登录*/
  async checkLogin(){
    return new Promise(function (resolve, reject) {
      request
        .get('/web/user/checkLogin')
        .type('form')
        .accept('json')
        .end(function (err, res) {
          if (res.status === 200) {
            resolve({status: res.body.booleanResult});
          } else {
            resolve({status: true})
          }
        });
    });
  },

    // 退出
    async quit(){
        return new Promise(function (resolve, reject) {
            request
                .get('/web/user/quit')
                .type('form')
                .accept('json')
                .end(function (err, res) {
                    if (res.status === 200) {
                        resolve(res.body)
                    } else {
                        resolve({status: false, reason: res.reason})
                    }
                });
        });
    },

}
