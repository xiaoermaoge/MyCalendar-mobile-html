<template>
    <div>
        <div class="Rcontainer">
            <div class="content">
                <div class="list" v-for="item in listData.records" :key="item.roomid">
                    <div>{{item.userName}}</div>
                    <div>{{item.roomName}}</div>
                    <div class="time" @click="closeModel(item.roomid)">预定时间</div>
                </div>

                <!--<checklist  :options="objectList" v-model="objectListValue" @on-change="change"></checklist>-->
            </div>

            <!-- 弹框 -->
            <div class="reserveM">
                <div>

                    <x-dialog v-model="showDialogStyle" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
                        <p class="close" @click="showDialogStyle = false">
                            <span>{{now}}</span>
                            <span class="icon">
                                <x-icon type="ios-close-outline" style="fill:#fff;"></x-icon>
                            </span>
                        </p>
                        <div class="moreTime">
                            <div class="timeList" v-for="time in canSelectTimes"
                                 :key="time.comp"
                                 v-bind:class="{'unselectable':time.orderStatus==-1,'':time.orderStatus==0,'ui-ordered':time.orderStatus==2, 'ui-selecting': time.orderStatus==1, 'ui-selected':time.orderStatus==9}"
                                 @click="toggleColor(time)">
                                {{time.start}}-{{time.end}}
                            </div>
                        </div>
                    </x-dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import '../assets/css/reserve.css'
    import {Checklist , dateFormat ,  XDialog , XButton, Group, XSwitch, TransferDomDirective as TransferDom,   } from 'vux'
    export default {
        components: {
            Checklist,
            XDialog,
            XButton,
            Group,
            XSwitch
        },
        filters: {
            dateFormat
        },
        // directives: {
        //     TransferDom
        // },
        name: "myreserve",
        data() {
            return {
                showDialogStyle: false, // 弹框开关
                isChoose: false,  // 预约时间选中开关 用作保存记录
                commonList:  [ 'China', 'Japan', 'America' ],
                now: dateFormat(new Date(), 'YYYY-MM-DD'),
                //times里面的comp=(时*60+分钟)/10;;;;
                // orderStatus:-1表示已过当前时间，
                // 0表示可预定，1表示当前已选中，
                // 2表示已经被预定待审核，
                // 3表示已预定已审核通过，
                // 4表示已预定未审核通过
                canSelectTimes: [
                    {"comp": 48, "start": "8:00", "end": "8:30", "orderStatus": 0}, {
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
                        "comp": 135, "start": "22:30", "end": "23:00", "orderStatus": 0}],
                listData: {
                    "status": true,
                    "total": 1,
                    "rows": 10,
                    "pages": 1,
                    "page": 1,
                    "searchCount": false,
                    "openSort": false,
                    "optimizeCount": false,
                    "orderByField": null,
                    "records": [
                        {
                            "id": 2,
                            "subject": "213",
                            "roomid": 1,
                            "userid": 2,
                            "start": "2016-06-13T01:17:42.000+0000",
                            "end": "2018-06-29T09:10:00.000+0000",
                            "createDate": "2018-06-15T01:17:55.000+0000",
                            "roomShStatus": 3,
                            "roomIdea": null,
                            "checkUserid": null,
                            "userName": "1天仙姐姐",
                            "roomName": "一楼大会议室"
                        },
                        {
                            "id": 2,
                            "subject": "213",
                            "roomid": 2,
                            "userid": 2,
                            "start": "2016-06-13T01:17:42.000+0000",
                            "end": "2018-06-29T09:10:00.000+0000",
                            "createDate": "2018-06-15T01:17:55.000+0000",
                            "roomShStatus": 3,
                            "roomIdea": null,
                            "checkUserid": null,
                            "userName": "2天仙姐姐",
                            "roomName": "一楼大会议室"
                        },
                        {
                            "id": 2,
                            "subject": "213",
                            "roomid": 3,
                            "userid": 2,
                            "start": "2016-06-13T01:17:42.000+0000",
                            "end": "2018-06-29T09:10:00.000+0000",
                            "createDate": "2018-06-15T01:17:55.000+0000",
                            "roomShStatus": 3,
                            "roomIdea": null,
                            "checkUserid": null,
                            "userName": "3天仙姐姐",
                            "roomName": "一楼大会议室"
                        },
                    ],
                    "asc": false
                }
            }
        },
        methods: {
            closeModel(roomid) {
                let _self = this;
                _self.showDialogStyle = true; // 打开弹框
                // 是否选中
                if(_self.isChoose){

                }else{
                    let now = new Date();
                    let nowComp = dateFormat(new Date(), 'HH')*60 + (dateFormat(new Date(), 'mm').toString());
                    console.log(nowComp)
                    for(let i in _self.canSelectTimes){
                        if(nowComp > _self.canSelectTimes[i].camp){
                            delete _self.canSelectTimes[i];
                            console.log(_self.canSelectTimes)
                            console.log(1)
                        }
                    }
                }

            },
            // 切换选中状态
            toggleColor(comp){
                let _self = this;
                for(let i in _self.canSelectTimes){
                    if(_self.canSelectTimes[i].comp == comp.comp){
                        console.log(_self.canSelectTimes[i].orderStatus)
                        if(_self.canSelectTimes[i].orderStatus == 0){
                            _self.canSelectTimes[i].orderStatus = 1;
                        }else if(_self.canSelectTimes[i].orderStatus == 1){
                            _self.canSelectTimes[i].orderStatus = 0;
                        }
                    }
                }
            }
        },
    }
</script>

<style scoped lang="less">

</style>
