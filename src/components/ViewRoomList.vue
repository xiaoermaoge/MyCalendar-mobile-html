<template>
    <div class="xxs">
        <!--<sticky class="my-sticky">-->
        <scroller lock-y scrollbar-x class="my-sticky">
            <div class="box1">
                <div v-bind:class="{'box1-item':true,'on-selected':day.selected}" v-for="day in canSelectDays"
                     @click="clickSelectedDay(day)">
                    <span>{{day.week}}</span>
                    <span>{{day.day}}</span>
                </div>
            </div>
        </scroller>

        <divider>请选择会议室</divider>
        <div>
            <div style="width: 100%;overflow:scroll;-webkit-overflow-scrolling:touch;">
                <tab v-bind:style="{width:canSelectRoomsLength*18.7+'px'}">
                    <tab-item v-for="item in canSelectRooms" :key="item.id" @on-item-click="handlerRoomChange"
                              v-bind:style="{width:item.name.length*17.11+'px'}">{{item.name}}
                    </tab-item>
                </tab>
            </div>
        </div>
        <div v-show="0 != nowMeetingRoomId" class="test">
            <div style="overflow-y: scroll">
                <divider>请选择时间段</divider>
                <ol id="selectable" v-bind:style="{height: controlVariable.height+'px'}">
                    <li v-for="item in canSelectTimes" :key="item.comp" :label="item.orderStatus"
                        v-bind:class="{'ui-widget-content':true, 'unselectable':item.orderStatus==-1,'ui-ordered':item.orderStatus==2, 'ui-selecting': item.orderStatus==1, 'ui-selected':item.orderStatus==9}"
                        @click="chooseTimes(item)">
                        {{item.start}}-{{item.end}} {{item.title | stringifyStr}}
                    </li>
                </ol>
            </div>
        </div>
        <div class="confirm-btn" style="background-color: white;width: 100%">
            <box gap="10px 10px">
                <x-button type="primary" @click.native="orderThisTime" :disabled="canOrderButton">立即预定</x-button>
            </box>
        </div>

        <alert v-model="controlVariable.alert.show" :title="controlVariable.alert.title">
            {{ controlVariable.alert.content }}
        </alert>
        <loading :show="controlVariable.loading.show" :text="controlVariable.loading.content"></loading>
    </div>
</template>

<script>
    import {
        Tab,
        TabItem,
        ButtonTab,
        Box,
        XButton,
        ButtonTabItem,
        Divider,
        Scroller,
        dateFormat,
        Alert,
        Loading,
        Sticky
    } from 'vux';

    import {strToDate} from  '../model/base/Date';
    //    import '../model/touch/jqueryui/jquery-ui-1.10.2.custom.min.css';
    //    import '../model/touch/jqueryui/jquery-ui.min.js';
    //    import '../model/touch/jquery-touch-punch/jquery.ui.touch-punch.min.js';

    import RoomModel from '../model/base/RoomModel';

    export default {
        components: {
            Tab, TabItem,
            ButtonTab,
            ButtonTabItem,
            Divider,
            Box, XButton,
            Scroller, Alert, Loading, Sticky
        },
        data () {
            return {
                controlVariable: {
                    alert: {
                        show: false,
                        title: "",
                        content: "",
                    },
                    loading: {
                        show: false,
                        title: "",
                        content: "",
                    },
                    height: 600,
                    selectedTimeLi: {
                        firstTimeSelected: false,
                        first: {},
                        last: {}
                    },
                },
                nowDay: 1,
                nowMeetingRoomId: 0,
                canSelectDays: [],
                canSelectRooms: [],
                canSelectTimes: [],
                selectedTime: {
                    beginTime: 0,
                    endTime: 0,
                    times: []
                },
            }
        },

        computed: {
            canOrderButton: function () {
                if (0 != this.selectedTime.beginTime && 0 != this.selectedTime.endTime)
                    return false;
                else
                    return true;
            },
            canSelectRoomsLength: function () {
                let sb = "";
                this.canSelectRooms.forEach(row => {
                    sb += row.NAME;
                });
//                console.log(sb, sb.length);
                return sb.length;
            }
        },

        created: async function () {
            let _self = this;
            await _self.getCanSelectDays();
            await _self.getRoomList();

            $(document).ready(function () {
                _self.controlVariable.height = $(document.body).height();//浏览器当前窗口文档body的高度
                _self.controlVariable.height = _self.controlVariable.height - 300;
            })
        },

        methods: {
            orderThisTime(){
                if (0 == this.nowMeetingRoomId) {
                    this.controlVariable.alert.show = true;
                    this.controlVariable.alert.title = "警告";
                    this.controlVariable.alert.content = "请先选择想要预定的会议室";
                    return;
                }
                let param = {
                    nowDay: this.nowDay,
                    nowMeetingRoomId: this.nowMeetingRoomId,
                    startTime: this.selectedTime.beginTime,
                    endTime: this.selectedTime.endTime,
                };
                this.$router.push({path: '/user/orderRoom', query: param});
            },

            getCanSelectDays(){
                let now = new Date();
                let today = this.getDateStr(now, 0);
                if(now.getHours()<19) {
                    this.canSelectDays.push({week: '今天', selected: true, day: today,});
                    this.nowDay = today;
                    this.canSelectDays.push({week: '明天', selected: false, day: this.getDateStr(now, 1),});
                } else {
                	let tomorrow = this.getDateStr(now, 1);
                    this.canSelectDays.push({week: '明天', selected: true, day: tomorrow,});
                    this.nowDay = tomorrow;
                }
                for (let i = 2; i < 15; i++) {
                    let str = "星期" + "一二三四五六日".charAt(now.getDay());
                    this.canSelectDays.push({week: str, selected: false, day: this.getDateStr(now, 1),});
                }
            },

            getDateStr(dd, AddDayCount) {
                dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
                return dateFormat(dd, "YYYY-MM-DD");
            },
            async clickSelectedDay(day){
                this.nowDay = day.day;
                this.canSelectDays.forEach(row => {
                    if (day.day == row.day) {
                        row.selected = true;
                    } else {
                        row.selected = false;
                    }
                });

                if (0 != this.nowMeetingRoomId) {
                    await this.getNowCanUseTime();
                }
            },

            async getRoomList(){
                let param = {
                    isMobile: true,
                    pageNum: 1,
                    numPerPage: 100
                };
                let result = await RoomModel.roomList(param);
                if (result.status) {
                    this.canSelectRooms = result.records;
                } else {
                    if (result.code == -1) {
                        // 是否是打印错误信息？
                        this.$router.push('/');
                    }
                }
            },

            async handlerRoomChange(index){
//            	console.log("选择的会议室："+index, this.canSelectRooms[index]);
                this.nowMeetingRoomId = this.canSelectRooms[index].id;
                let _self = this;
                await _self.getNowCanUseTime();
            },
            checkTimeSelected(time){
                let beginArr = this.selectedTime.beginTime.split(":");
                let endArr = this.selectedTime.endTime.split(":");
                let nowBeginArr = time.start.split(":");
                let nowEndArr = time.end.split(":");
                let start = beginArr[0] * 60 + Number(beginArr[1]);
                let end = endArr[0] * 60 + Number(endArr[1]);
                let nowBegin = nowBeginArr[0] * 60 + Number(nowBeginArr[1]);
                let nowEnd = nowEndArr[0] * 60 + Number(nowEndArr[1]);
                //如果当前li的开始时间大于等于已被选择的开始时间，且当前li的结束时间小于等于已被选择的结束时间
//                console.log("当前li的开始时间",nowBegin, start, nowEnd, end);
                if (nowBegin >= start && nowEnd <= end) {
                    return true;
                } else {
                    return false;
                }
            },

            viewMeeting(id){
                this.$router.push({path: '/user/viewMeeting', query: {id: id}});
            },

            async getNowCanUseTime(){

                this.selectedTime.beginTime = 0;
                this.selectedTime.endTime = 0;
                this.controlVariable.loading.content = "正在获取可用时段";
                this.controlVariable.loading.show = true;
                //times里面的comp=(时*60+分钟)/10;;;;orderStatus:-1表示已过当前时间，0表示可预定，1表示当前已选中，2表示已经被预定待审核，3表示已预定已审核通过，4表示已预定未审核通过
                this.canSelectTimes = [{"comp": 48, "start": "8:00", "end": "8:30", "orderStatus": 0}, {
                    "comp": 51,
                    "start": "8:30",
                    "end": "9:00",
                    "orderStatus": 0
                }, {"comp": 54, "start": "9:00", "end": "9:30", "orderStatus": 0}, {
                    "comp": 57,
                    "start": "9:30",
                    "end": "10:00",
                    "orderStatus": 0
                }, {"comp": 60, "start": "10:00", "end": "10:30", "orderStatus": 0}, {
                    "comp": 63,
                    "start": "10:30",
                    "end": "11:00",
                    "orderStatus": 0
                }, {"comp": 66, "start": "11:00", "end": "11:30", "orderStatus": 0}, {
                    "comp": 69,
                    "start": "11:30",
                    "end": "12:00",
                    "orderStatus": 0
                }, {"comp": 72, "start": "12:00", "end": "12:30", "orderStatus": 0}, {
                    "comp": 75,
                    "start": "12:30",
                    "end": "13:00",
                    "orderStatus": 0
                }, {"comp": 78, "start": "13:00", "end": "13:30", "orderStatus": 0}, {
                    "comp": 81,
                    "start": "13:30",
                    "end": "14:00",
                    "orderStatus": 0
                }, {"comp": 84, "start": "14:00", "end": "14:30", "orderStatus": 0}, {
                    "comp": 87,
                    "start": "14:30",
                    "end": "15:00",
                    "orderStatus": 0
                }, {"comp": 90, "start": "15:00", "end": "15:30", "orderStatus": 0}, {
                    "comp": 93,
                    "start": "15:30",
                    "end": "16:00",
                    "orderStatus": 0
                }, {"comp": 96, "start": "16:00", "end": "16:30", "orderStatus": 0}, {
                    "comp": 99,
                    "start": "16:30",
                    "end": "17:00",
                    "orderStatus": 0
                }, {"comp": 102, "start": "17:00", "end": "17:30", "orderStatus": 0}, {
                    "comp": 105,
                    "start": "17:30",
                    "end": "18:00",
                    "orderStatus": 0
                }, {"comp": 108, "start": "18:00", "end": "18:30", "orderStatus": 0}, {
                	"comp": 111, "start": "18:30", "end": "19:00", "orderStatus": 0}, {
                	"comp": 114, "start": "19:00", "end": "19:30", "orderStatus": 0}, {
                	"comp": 117, "start": "19:30", "end": "20:00", "orderStatus": 0}, {
                	"comp": 120, "start": "20:00", "end": "20:30", "orderStatus": 0}, {
                	"comp": 123, "start": "20:30", "end": "21:00", "orderStatus": 0}, {
                	"comp": 126, "start": "21:00", "end": "21:30", "orderStatus": 0}, {
                	"comp": 129, "start": "21:30", "end": "22:00", "orderStatus": 0}, {
                	"comp": 132, "start": "22:00", "end": "22:30", "orderStatus": 0}, {
                	"comp": 135, "start": "22:30", "end": "23:00", "orderStatus": 0}];
                //获取已被预定的记录
                let startTime = this.nowDay + " 00:00:00";
                let endTime = this.nowDay + " 23:59:59";
                let startTimestamp = strToDate(startTime).getTime();
                let endTimestamp = strToDate(endTime).getTime() + 1000;
                let param = {
                    roomId: this.nowMeetingRoomId,
                    start: startTimestamp / 1000,
                    end: endTimestamp / 1000,
                };
                let result = await RoomModel.getDurationEvent(param);
                if (!result.status) {
                    this.controlVariable.loading.show = false;
                    this.controlVariable.alert.show = true;
                    this.controlVariable.alert.title = "错误";
                    this.controlVariable.alert.content = "获取会议室预定记录失败，请重试";
                    return;
                }
                //计算已预定时间列表
                let hasOrderedTimes = [];
                if (result.records.length > 0) {
                    result.records.forEach(row => {
                        let startTime = row.start;
                        let endTime = row.end;
                        let startDate = strToDate(startTime);
                        let endDate = strToDate(endTime);
                        hasOrderedTimes.push({
                            start: startDate.getHours() * 60 + startDate.getMinutes(),
                            end: endDate.getHours() * 60 + endDate.getMinutes(),
                            title: row.title,
                            status: row.status,
                            id: row.id
                        })
                    })
                }

                let now = new Date();
                let isToday = false;
                let nowTime = 0;
                //判断是否为今天，若为今天，则需要将当前时间之前的时间段设置为不可选择
                if (dateFormat(now, 'YYYY-MM-DD') == this.nowDay) {
                    isToday = true;
                    nowTime = now.getHours() * 60 + now.getMinutes();
                }
//                this.canSelectTimes.forEach((row,index) => {
                for (let i = 0; i < this.canSelectTimes.length; i++) {
                    let row = this.canSelectTimes[i];
                    let arr = row.end.split(":");
                    let tmst = Number(arr[0]) * 60 + Number(arr[1]);
                    tmst = tmst-15;//减去15是为了更合理，比如15:13分能预定15:00点开始选，15:17分能预定只能从15：30分开始选择
                    if (isToday) {
                        if (tmst <= nowTime) {
//                            row.canOrder = 0;//0表示已过期时间，无法预定
                            this.canSelectTimes.splice(i--, 1);
                        }
                    }
                }
                this.canSelectTimes.forEach(row => {
                    let beginArr = row.start.split(":");
                    let endArr = row.end.split(":");
                    //当前li的时间起止
                    let startTimestamp = Number(beginArr[0]) * 60 + Number(beginArr[1]);
                    let endTimestamp = Number(endArr[0]) * 60 + Number(endArr[1]);
                    if (hasOrderedTimes.length > 0) {
                        hasOrderedTimes.forEach(hrow => {
                            //如果当前li的开始时间等于已被预定记录的开始时间，则该条li已被预定
                            //如果当前li的开始时间大于已被预定记录的开始时间，并且当前li的结束时间等于或小于该条记录的结束时间，则该条li已被预定
                            if ((startTimestamp > hrow.start && endTimestamp <= hrow.end) || (startTimestamp == hrow.start)) {
                            	if(hrow.status == 0){
                                    row.orderStatus = 9;//9表示已预定但未审核
                                    row.title = hrow.title;
                                    row.id = hrow.id;
                                } else {
                                    row.orderStatus = 2;//2表示已预定
                                    row.title = hrow.title;
                                    row.id = hrow.id;
                                }
                            }
                        })
                    }
                });
                this.controlVariable.loading.show = false;
            },

            chooseTimes(chooseItems){
                let _self = this;
                //如果点的是已被预定的
                let orderid = chooseItems.id;
                if (null != orderid) {
                    _self.viewMeeting(orderid);
                    return;
                }

                //如果同一个点了两次，则取消所有选择
                if (_self.controlVariable.selectedTimeLi.firstTimeSelected && chooseItems.comp === _self.controlVariable.selectedTimeLi.first.comp) {
                    _self.canSelectTimes.forEach(row => {
                        row.selected = false;
                    });
                    _self.controlVariable.selectedTimeLi.firstTimeSelected = false;
                    return;
                }

                //如果点的是未被预定的，且是第一次点击
                if (!_self.controlVariable.selectedTimeLi.firstTimeSelected) {
                    _self.selectedTime.beginTime = chooseItems.start;
                    _self.selectedTime.endTime = chooseItems.end;
                    _self.controlVariable.selectedTimeLi.firstTimeSelected = true;
                    _self.controlVariable.selectedTimeLi.first = chooseItems;
                    _self.canSelectTimes.forEach(row => {
                        if (row.orderStatus === 1) {
                            row.orderStatus = 0;
                        }
                    });
                    chooseItems.orderStatus = 1;
//                    console.log("设置为一辈子选中：", chooseItems.start);
                } else {
                    //如果是第二次点击，判断第二次点击的时间是在此上面还是下面，如果是上面，则修改开始时间，如果是下面，则修改结束时间
                    if (chooseItems.comp !== _self.controlVariable.selectedTimeLi.first.comp) {
                        if (chooseItems.comp < _self.controlVariable.selectedTimeLi.first.comp) {
                            _self.selectedTime.beginTime = chooseItems.start;
                        } else if (chooseItems.comp > _self.controlVariable.selectedTimeLi.first.comp) {
                            _self.selectedTime.endTime = chooseItems.end;
                        }
                        _self.canSelectTimes.forEach(row => {
                            let isSelected = _self.checkTimeSelected(row);
                            if (isSelected) {
                                row.orderStatus = 1;
                            }
                        });
                    } else if (chooseItems.comp === _self.controlVariable.selectedTimeLi.first.comp) {
                        //如果等于，则表示同一个点了两次，则取消所有选择
                        _self.canSelectTimes.forEach(row => {
                            row.orderStatus = 0;
                        });
                    }
                    _self.controlVariable.selectedTimeLi.firstTimeSelected = false;

                }

//              console.log("开始判断有效性");
                if (_self.selectedTime.times.length >= 2) {
                    let canDoThisChoose = true;
                    st: for (let i = 0; i < _self.selectedTime.times.length; i++) {
                        for (let o = 0; o < _self.canSelectTimes.length; o++) {
                            if (_self.selectedTime.times[i] == _self.canSelectTimes[o].time && _self.canSelectTimes[o].orderStatus != 0) {
                                canDoThisChoose = false;
                                break st;
                            }
                        }
                    }
//                                console.log("判断有效性结束：", canDoThisChoose);
                    if (!canDoThisChoose) {
//                                    console.log("不能这样选择");
                        _self.canSelectTimes.forEach(row => {
                            if (row.orderStatus === 1) {
                                row.orderStatus = 0;
                            }
                        });
                        _self.selectedTime.beginTime = 0;
                        _self.selectedTime.endTime = 0;
                        _self.selectedTime.times = [];
                    }
                }
            }
        },

        filters: {
            stringifyStr(str){
                if (null != str) {
                    if (str.length > 10) {
                        return str.substring(0, 10) + "...";
                    }
                }
            }
        }
    }
</script>

<style>
    .vux-demo {
        text-align: center;
    }

    .logo {
        width: 100px;
        height: 100px
    }

    body {
        background: #fff;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }

    #feedback {
        font-size: 1.4em;
    }

    #selectable .ui-selecting {
        background: #e0cb2a;
    }

    #selectable .ui-selected {
        background: #a9d563;
        color: white;
    }

    #selectable .unselectable {
        background: #e6e6df;
        color: #000000;
    }

    #selectable .ui-ordered {
        background: #159215;
        color: white;
    }

    #selectable {
        list-style-type: none;
        width: 100%;
        padding-bottom: 55px;
    }

    #selectable li {
        /*margin: 3px;*/
        padding: 0.4em;
        font-size: 1.4em;
        height: 18px;
    }

    .box1 {
        height: 65px;
        position: relative;
        width: 1550px;
    }

    .box1-item {
        width: 100px;
        height: 65px;
        background-color: #f5f5f5;
        display: inline-block;
        margin-left: 1px;
        float: left;
        text-align: center;
        line-height: 100px;
        border-style: solid;
        border-width: 1px;
        border-color: #bfbfbf
    }

    .on-selected {
        background-color: #d7e3ff;
        border-style: solid;
        border-width: 1px;
        border-color: #2631bf
    }

    .box1-item:first-child {
        margin-left: 0;
    }

    .box1-item span {
        display: block;
        height: 30px;
        line-height: 30px;
    }

    /* li{
         width: 25%;
         height: 50px;
         float: left;
     }*/
    .confirm-btn {
        position: fixed;
        bottom: 50px;
        width: 100%;
    }

    .my-sticky {
        background: white;
        /*position: fixed;*/
    }

    .room-item {
        color: #4c5e4c;
    }

    .on-room-selected {
        color: #4fff5d;
    }
</style>
