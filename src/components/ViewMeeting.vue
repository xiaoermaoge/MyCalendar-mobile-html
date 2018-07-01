<template>
    <div>
        <div class="vux-demo">
            <group>
                <!--<selector title="会议室" placeholder="请选择会议室" :options="roomListOptions"
                          v-model="formData.roomId" :readonly="true"></selector>-->
                <x-input title="会议室" v-model="formData.roomName" :readonly="true"></x-input>
                <x-textarea title="会议主题" v-model="formData.title" :max="30" placeholder="请输入会议主题" :readonly="true"></x-textarea>
                <x-input title="预订人" v-model="formData.userName" :readonly="true"></x-input>
                <datetime
                    v-model="formData.orderDay"
                    title="预约日期" :readonly="true"></datetime>
                <datetime v-model="formData.start" :start-date="orderDay" :end-date="orderDay" format="HH:mm" title="开始时间" :readonly="true"></datetime>
                <datetime v-model="formData.end" :start-date="orderDay" :end-date="orderDay" format="HH:mm" title="结束时间" :readonly="true"></datetime>
                <!--<x-input title="会议时间" v-model="password" type="password"></x-input>-->

            </group>

            <div  v-show="null != devList && devList.length>0">
                <divider>智能设备</divider>
                <x-table>
                    <thead>
                    <tr>
                        <th>类型</th>
                        <th>名称</th>
                        <th>授权码</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in devList" v-show="item.value1">
                        <td>智能门锁</td>
                        <td>{{item.deviceName}}</td>
                        <td>{{item.value1}}</td>
                    </tr>
                    </tbody>
                </x-table>
            </div>

            <box gap="10px 10px">
                <x-button type="default" link="BACK">返回</x-button>
            </box>
        </div>


    </div>
</template>

<script>
    import {Group, Selector,XTextarea, Datetime,XButton, Box, XInput, XTable, Divider  } from 'vux';

    import '../model/touch/jqueryui/jquery-ui-1.10.2.custom.min.css';
    import '../model/touch/jqueryui/jquery-ui.min.js';
    import '../model/touch/jquery-touch-punch/jquery.ui.touch-punch.min.js';

    import RoomModel from '../model/base/RoomModel';

    export default {
        components: {
            Group, Selector,XTextarea, Datetime,XButton, Box, XInput, XTable, Divider
        },
        data () {
            return {
                canSelectRooms: [],
                roomListOptions: [],
                orderDay: '',
                formData: {
                    start: '',//1515009600000
                    end: '',//1515025800000
                    roomId: '',
                    title: '',//会议内容jiocjwioq低价位穷
                    roomName: '',
                },
                devList:[]
            }
        },

        computed:{
        },

        created: async function () {
        	let result = await RoomModel.getDurationEventById({id:this.$route.query.id});
        	if(result.status){
        		this.formData.title = result.detail.roomEventVO.title;
        		this.formData.start = result.detail.roomEventVO.start;
        		this.formData.end = result.detail.roomEventVO.end;
        		this.formData.roomName = result.detail.roomEventVO.roomName;
        		this.formData.userName = result.detail.roomEventVO.userName;
        		this.formData.orderDay = result.detail.roomEventVO.userName;
        		this.devList = result.detail.scheduleDevPlanTypeVOList;
            }
        	console.log("获取到的会议详情：", result);
        },

        methods:{

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
