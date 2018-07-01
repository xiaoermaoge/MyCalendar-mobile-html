import request from 'superagent'
export default {

  /*获取所有房间*/
  async roomList(param){
    return new Promise(function (resolve, reject) {
      request
        .get('/web/room/getRoomList')
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

  /*新增预约*/
  async addRoomEvent(param){
    return new Promise(function (resolve, reject) {
      request
        .post('/web/roomSchedule/addRoomEvent')
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
  /*获取可预定时间段列表*/
  async getDurationEvent(param){
    return new Promise(function (resolve, reject) {
      request
        .get('/web/roomSchedule/getDurationEvents')
        .type('form')
        .query(param)
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
  /*获取我的预定时间段列表*/
  async getMyDurationEventList(param){
    return new Promise(function (resolve, reject) {
      request
        .get('/web/roomSchedule/getMyDurationEventList')
        .type('form')
        .query(param)
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

  /*查看单个会议详情*/
  async getDurationEventById(param){
    return new Promise(function (resolve, reject) {
      request
        .get('/web/roomSchedule/getDurationEventsById')
        .type('form')
        .query(param)
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
