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
        <!--</sticky>-->
        <!--<button-tab v-model="nowDay">
            <button-tab-item @on-item-click="selectDay">前一天</button-tab-item>
            <button-tab-item selected @on-item-click="selectDay">今天</button-tab-item>
            <button-tab-item @on-item-click="selectDay">后一天</button-tab-item>
        </button-tab>-->
        <divider>请选择会议室</divider>
        <scroller lock-y scrollbar-x class="my-sticky">
            <div v-bind:style="{width:canSelectRoomsLength*17.11+'px'}" bar-active-color="#668599" :line-width="1">
                <span v-bind:class="{'room-item':true,'on-room-selected':item.selected}" v-for="item in canSelectRooms"  @click="handlerRoomChange(item)">
                    {{item.NAME}}
                </span>
            </div>
        </scroller>
        <div v-show="0 != nowMeetingRoomId" class="test">
            <div style="overflow-y: scroll">
                <divider>请选择时间段</divider>
                <ol id="selectable">
                    <li v-for="item in canSelectTimes" :time="item.time" :orderid="item.id"
                        v-bind:class="{'ui-widget-content':true, 'unselectable':item.canOrder==0,'has-meeting':item.canOrder==2, 'ui-selected': item.selected}" @click="chooseTimes(item)">
                        {{item.time}} {{item.title | stringifyStr}}
                    </li>
                </ol>
            </div>
        </div>
        <div class="confirm-btn">
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
            Scroller, Alert, Loading,Sticky
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
                    }
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
            canSelectRoomsLength : function () {
                let sb = "";
                this.canSelectRooms.forEach(row=>{
                	sb+=row.NAME;
                });
                console.log(sb, sb.length);
                return sb.length;
            }
        },

        created: async function () {
            let _self = this;
            await _self.getCanSelectDays();
            await _self.getRoomList();
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
                this.canSelectDays.push({week: '今天', selected: true, day: today,});
                this.nowDay = today;
                this.canSelectDays.push({week: '明天', selected: false, day: this.getDateStr(now, 1),});
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
                    this.canSelectRooms = result.rows.list;
                } else {
                    if (result.code == -1) {
                        this.$router.push('/');
                    }
                }
            },

            async handlerRoomChange(item){
                this.nowMeetingRoomId = item.ID;
                let _self = this;
                await _self.getNowCanUseTime();
            },
            checkTimeSelected(time){
                let beginArr = this.selectedTime.beginTime.split(":");
                let endArr = this.selectedTime.endTime.split(":");
                let nowArr = time.split(":");
                let start = beginArr[0] * 60 + Number(beginArr[1]);
                let end = endArr[0] * 60 + Number(endArr[1]);
                let now = nowArr[0] * 60 + Number(nowArr[1]);
                if (start < end && now >= start && now <= end) {
                    return true;
                } else if (start > end && now <= start && now >= end) {
                    return true;
                }
            },

            viewMeeting(id){
                this.$router.push({path:'/user/viewMeeting', query:{id:id}});
            },

            async getNowCanUseTime(){

                this.selectedTime.beginTime = 0;
                this.selectedTime.endTime = 0;
                this.controlVariable.loading.content = "正在获取可用时段";
                this.controlVariable.loading.show = true;
                this.canSelectTimes = [
                    {
                        time: '8:00',
                        canOrder: 1,
                    }, {
                        time: '8:30',
                        canOrder: 1,
                    }, {
                        time: '9:00',
                        canOrder: 1,
                    }, {
                        time: '9:30',
                        canOrder: 1,
                    }, {
                        time: '10:00',
                        canOrder: 1,
                    }, {
                        time: '10:30',
                        canOrder: 1,
                    }, {
                        time: '11:00',
                        canOrder: 1,
                    }, {
                        time: '11:30',
                        canOrder: 1,
                    }, {
                        time: '12:00',
                        canOrder: 1,
                    }, {
                        time: '12:30',
                        canOrder: 1,
                    }, {
                        time: '13:00',
                        canOrder: 1,
                    }, {
                        time: '13:30',
                        canOrder: 1,
                    }, {
                        time: '14:00',
                        canOrder: 1,
                    }, {
                        time: '14:30',
                        canOrder: 1,
                    }, {
                        time: '15:00',
                        canOrder: 1,
                    }, {
                        time: '15:30',
                        canOrder: 1,
                    }, {
                        time: '16:00',
                        canOrder: 1,
                    }, {
                        time: '16:30',
                        canOrder: 1,
                    }, {
                        time: '17:00',
                        canOrder: 1,
                    }, {
                        time: '17:30',
                        canOrder: 1,
                    }, {
                        time: '18:00',
                        canOrder: 1,
                    }/*, {
                     time: '18:30',
                     canOrder: 1,
                     }, {
                     time: '19:00',
                     canOrder: 1,
                     }, {
                     time: '19:30',
                     canOrder: 1,
                     }, {
                     time: '20:00',
                     canOrder: 1,
                     },*/
                ];

                //获取已被预定的记录
                let startTime = this.nowDay + " 00:00:00";
                let endTime = this.nowDay + " 23:59:59";
                let startTimestamp = strToDate(startTime).getTime();
                let endTimestamp = strToDate(endTime).getTime() + 1000;
                let param = {
                    roomId: this.nowMeetingRoomId,
                    start: startTimestamp / 1000,
                    end: endTimestamp / 1000
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
                if (result.rows.length > 0) {
                    result.rows.forEach(row => {
                        let startTime = row.start;
                        let endTime = row.end;
                        let startDate = new Date(startTime);
                        let endDate = new Date(endTime);
                        hasOrderedTimes.push({
                            start: startDate.getHours() * 60 + startDate.getMinutes(),
                            end: endDate.getHours() * 60 + endDate.getMinutes(),
                            title: row.title,
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
                    nowTime = nowTime - 15;//减去15是为了更合理，比如15:13分能预定15:00点开始选，15:17分能预定只能从15：30分开始选择
                }
                this.canSelectTimes.forEach(row => {
//                for(let i = 0; i < this.canSelectTimes.length; i++){
//                	let row = this.canSelectTimes[i];
                    let arr = row.time.split(":");
                    let tmst = Number(arr[0]) * 60 + Number(arr[1]);
                    if (isToday) {
                        if (tmst <= nowTime) {
                            row.canOrder = 0;//0表示已过期时间，无法预定
                        }
                    }
                    if (hasOrderedTimes.length > 0) {
                        hasOrderedTimes.forEach(hrow => {
                            if (tmst >= hrow.start && tmst <= hrow.end) {
                                row.canOrder = 2;//2表示已预定
                                row.title = hrow.title;
                                row.id = hrow.id;
                            }
                        })
                    }

                });
                let _self = this;
                /*$(function () {
                    $("#selectable").selectable({
                        filter: "li:not(.unselectable)",
                        stop: function () {
                            let chooseItems = $(".ui-selected", this);
                            if (chooseItems.length == 1) {
                                let tt = $(".ui-selected", this).attr("time");
                                //如果点的是已被预定的
                                let orderid = $(".ui-selected", this).attr("orderid");
                                if (null != orderid) {
                                    _self.viewMeeting(orderid);
                                    return;
                                }
                                //如果点的是未被预定的
                                if (0 == _self.selectedTime.beginTime) {
                                    _self.selectedTime.beginTime = tt;
                                } else if (0 == _self.selectedTime.endTime) {
                                    _self.selectedTime.endTime = tt;
//                                    console.log("开始时间：", _self.selectedTime.beginTime);
//                                    console.log("结束时间：", _self.selectedTime.endTime);
                                    _self.selectedTime.times.push(_self.selectedTime.beginTime);
                                    _self.selectedTime.times.push(_self.selectedTime.endTime);
                                    $(".ui-selectee", this).each(function () {
                                        let thisTime = $(this).attr("time");
                                        let isSelected = _self.checkTimeSelected(thisTime);
                                        if (isSelected) {
                                            $(this).addClass("ui-selected");
                                            _self.selectedTime.times.push(thisTime);
                                        }
                                    });
                                } else {
                                    _self.selectedTime.beginTime = tt;
                                    _self.selectedTime.endTime = 0;
                                }
                            } else if (chooseItems.length > 1) {
                                for (let i = 0; i < chooseItems.length; i++) {
                                    _self.selectedTime.times.push($(chooseItems[i]).attr("time"));
                                }
                                _self.selectedTime.beginTime = $(chooseItems[0]).attr("time");
                                _self.selectedTime.endTime = $(chooseItems[chooseItems.length - 1]).attr("time");
                            }

//                            console.log("开始判断有效性");
                            if (_self.selectedTime.times.length >= 2) {
                                let canDoThisChoose = true;
                                st: for (let i = 0; i < _self.selectedTime.times.length; i++) {
                                    for (let o = 0; o < _self.canSelectTimes.length; o++) {
                                        if (_self.selectedTime.times[i] == _self.canSelectTimes[o].time && _self.canSelectTimes[o].canOrder != 1) {
                                            canDoThisChoose = false;
                                            break st;
                                        }
                                    }
                                }
//                                console.log("判断有效性结束：", canDoThisChoose);
                                if (!canDoThisChoose) {
//                                    console.log("不能这样选择");
                                    $(".ui-selected", this).each(function () {
                                        $(this).removeClass("ui-selected");
                                    });
                                    _self.selectedTime.beginTime = 0;
                                    _self.selectedTime.endTime = 0;
                                    _self.selectedTime.times = [];
                                }
                            }
                            /!*  var result = $( "#select-result" ).empty();
                             $( ".ui-selected", this ).each(function() {
                             console.log("循环this",this);
                             var index = $( "#selectable li" ).index( this );
                             result.append( " #" + ( index + 1 ) );
                             if(0 == _self.selectedTime.beginTime){
                             _self.selectedTime.beginTime = index;
                             } else if(0 == _self.selectedTime.endTime){
                             _self.selectedTime.endTime = index;
                             } else {
                             _self.selectedTime.beginTime = index;
                             _self.selectedTime.endTime = 0;
                             }
                             });*!/
                        }
                    });
                });*/
                _self.controlVariable.loading.show = false;
            },

            chooseTimes(chooseItems){
            	let _self = this;
                let tt = chooseItems.time;
                //如果点的是已被预定的
                let orderid = chooseItems.id;
                if (null != orderid) {
                    _self.viewMeeting(orderid);
                    return;
                }
                //如果点的是未被预定的
                if (0 == _self.selectedTime.beginTime) {
                    chooseItems.selected=true;
                    _self.selectedTime.beginTime = tt;
                } else if (0 == _self.selectedTime.endTime) {
                    _self.selectedTime.endTime = tt;
//                                    console.log("开始时间：", _self.selectedTime.beginTime);
//                                    console.log("结束时间：", _self.selectedTime.endTime);
                    _self.selectedTime.times.push(_self.selectedTime.beginTime);
                    _self.selectedTime.times.push(_self.selectedTime.endTime);
                    _self.canSelectTimes.forEach(row=>{
                        let thisTime = row.time;
                        let isSelected = _self.checkTimeSelected(thisTime);
                        if (isSelected) {
                            row.selected = true;
                            _self.selectedTime.times.push(thisTime);
                        }
                    });
                } else {
                    _self.selectedTime.beginTime = tt;
                    _self.selectedTime.endTime = 0;
                    _self.canSelectTimes.forEach(row=>{
                        row.selected = false;
                    });
                    chooseItems.selected=true;
                }

//                            console.log("开始判断有效性");
                if (_self.selectedTime.times.length >= 2) {
                    let canDoThisChoose = true;
                    st: for (let i = 0; i < _self.selectedTime.times.length; i++) {
                        for (let o = 0; o < _self.canSelectTimes.length; o++) {
                            if (_self.selectedTime.times[i] == _self.canSelectTimes[o].time && _self.canSelectTimes[o].canOrder != 1) {
                                canDoThisChoose = false;
                                break st;
                            }
                        }
                    }
//                                console.log("判断有效性结束：", canDoThisChoose);
                    if (!canDoThisChoose) {
//                                    console.log("不能这样选择");
                        $(".ui-selected", this).each(function () {
                            $(this).removeClass("ui-selected");
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
        background: #FECA40;
    }

    #selectable .ui-selected {
        background: #F39814;
        color: white;
    }

    #selectable .unselectable {
        background: #e6e6df;
        color: #000000;
    }

    #selectable .has-meeting {
        background: #f3ca15;
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
    .confirm-btn{
        position: fixed;
        bottom: 50px;
        width:100%;
    }
    .my-sticky{
        background: white;
        /*position: fixed;*/
    }

    .room-item{
        color: #4c5e4c;
    }

    .on-room-selected{
        color: #4fff5d;
    }
</style>
