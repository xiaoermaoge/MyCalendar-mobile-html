<template>
    <div>
        <div class="vux-demo">
            <h1></h1>
        </div>
        <tab>
            <tab-item selected v-model="type" @on-item-click="onItemClick">即将开始</tab-item>
            <tab-item @on-item-click="onItemClick">已经过期</tab-item>
        </tab>
        <div>
            <div class="one-meeting-order" v-for="(item,index) in orderList" @click="viewOrderDetail(item)">

                <divider>{{index+1}}</divider>
                <p>会议室：{{item.roomName}}</p>
                <p>主题：{{item.title}}</p>
                <p>开始时间：{{item.start}}</p>
                <p>结束时间：{{item.end}}</p>
                <br/>
            </div>
        </div>
    </div>
</template>

<script>
    import {Tab, TabItem ,Divider } from 'vux';

    import '../model/touch/jqueryui/jquery-ui-1.10.2.custom.min.css';
    import '../model/touch/jqueryui/jquery-ui.min.js';
    import '../model/touch/jquery-touch-punch/jquery.ui.touch-punch.min.js';

    import RoomModel from '../model/base/RoomModel';

    export default {
        components: {
            Tab, TabItem, Divider
        },
        data () {
            return {
                type:0,
                orderList:[],
            }
        },

        computed:{

        },

        created: async function () {
        	let _self = this;
            await _self.queryOrderList();
        },

        methods:{
            async onItemClick(index){
                this.type = index;
                await this.queryOrderList();
            },

            async queryOrderList(){
            	let param = {
            		"flag":this.type==0?"new":"old"
                };
            	let result = await RoomModel.getMyDurationEventList(param);
            	if (result.status) {
                    this.orderList = result.records;
                }
            },

            viewOrderDetail(item){
                this.$router.push({path:'/user/viewMeeting', query:{id:item.id}});
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

    .one-meeting-order{

    }
</style>
