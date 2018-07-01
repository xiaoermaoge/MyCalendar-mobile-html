<template>
    <div>
        <div class="vux-demo">
            <group>
                <selector title="会议室" placeholder="请选择会议室" :options="roomListOptions"
                          v-model="formData.roomId" :readonly="true"></selector>
                <x-textarea title="会议主题" v-model="formData.title" :max="30" placeholder="请输入会议主题"></x-textarea>
                <datetime
                    v-model="orderDay"
                    title="预约日期"></datetime>
                <datetime v-model="formData.start" :start-date="orderDay" :end-date="orderDay" format="HH:mm" title="开始时间" :minute-list="orderBegin"></datetime>
                <datetime v-model="formData.end" :start-date="orderDay" :end-date="orderDay" format="HH:mm" title="结束时间" :minute-list="orderEnd"></datetime>
                <!--<x-input title="会议时间" v-model="password" type="password"></x-input>-->
            </group>
            <box gap="10px 10px">
                <x-button type="primary" @click.native="submitOrder">提交预约</x-button>
                <x-button type="default" link="BACK">返回</x-button>
            </box>
            <alert v-model="controlVariable.alert.show" :title="controlVariable.alert.title" @on-hide="closeAlert"> {{ controlVariable.alert.content }}</alert>
        </div>

    </div>
</template>

<script>
    import {XButton, Group, Selector, Box, XInput, Datetime,XTextarea,Alert } from 'vux';
    import { Loading } from 'vux';

    import {strToDate} from  '../model/base/Date';

    import RoomModel from '../model/base/RoomModel';

    export default {
        components: {
            XButton, Group, Box, XInput, Selector, Datetime, XTextarea ,Alert
        },
        data () {
            return {
                controlVariable: {
                	alert: {
                        show:false,
                		title:"",
                        content:"",
                    }
                },
                orderBegin: ['00', '30'],
                orderEnd: ['00', '30'],
                canSelectRooms: [],
                roomListOptions: [],
                orderDay: '',
                formData: {
                    start: '',//1515009600000
                    end: '',//1515025800000
                    roomId: '',
                    title: '',//会议内容jiocjwioq低价位穷
                }
            }
        },
        created: async function () {
            this.formData.roomId = this.$route.query.nowMeetingRoomId;
            this.formData.start = this.$route.query.startTime;
            this.formData.end = this.$route.query.endTime;
            this.orderDay = this.$route.query.nowDay;
            await this.getRoomList();
        },
        methods: {

            async getRoomList(){
                let param = {
                    isMobile: true,
                    pageNum: 1,
                    numPerPage: 100
                };
                let result = await RoomModel.roomList(param);
                if (result.status) {
                    this.canSelectRooms = result.records;
                    for (let i = 0; i < this.canSelectRooms.length; i++) {
                        this.roomListOptions.push({key: this.canSelectRooms[i].ID, value: this.canSelectRooms[i].name});
                    }
                } else {
                    if(result.code == -1){
                        this.$router.push('/');
                    }
                }
            },

            async submitOrder(){
                this.$vux.loading.show({
                    text: '正在为您准备会议室，请稍后'
                });
                if ('' != this.formData.title && '' != this.formData.roomId) {
                	let startTime = strToDate(this.orderDay +" "+ this.formData.start);
                	let endTime = strToDate(this.orderDay +" "+ this.formData.end);
                    let param = {
                        start: startTime.getTime(),
                        end: endTime.getTime(),
                        roomId: this.formData.roomId,
                        title: this.formData.title,
                    };
                    let result = await RoomModel.addRoomEvent(param);
                    if (result.status) {
                        this.controlVariable.alert.show = true;
                        this.controlVariable.alert.title = "恭喜";
                        this.controlVariable.alert.content = "预定成功";
                    } else {
                        if(result.code == -1){
                            this.$router.push('/');
                        } else {
                            this.controlVariable.alert.show = true;
                            this.controlVariable.alert.title = result.reason;
                            this.controlVariable.alert.content = result.msg;
                        }
                    }
                } else {
                	this.controlVariable.alert.show = true;
                	this.controlVariable.alert.title = "警告";
                	this.controlVariable.alert.content = "请先填写内容";
                }
                this.$vux.loading.hide();
            },

            closeAlert(){
            	console.log("in closeAlert");
            	if(this.controlVariable.alert.content == "预定成功"){
                    this.$router.push('/user/myOrder');
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
        margin: 0;
        padding: 0;
        width: 100%;
    }

    #selectable li {
        /*margin: 3px;*/
        padding: 0.4em;
        font-size: 1.4em;
        height: 18px;
    }
</style>
