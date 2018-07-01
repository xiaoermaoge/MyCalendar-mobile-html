<template>
    <div class="my_home">
        <div class="vux-demo">
            <h1></h1>
        </div>
        <grid>
            <grid-item :key="1" style="width: 30%;">
                <img slot="icon" src="../assets/icon/head.png" v-bind:src="user.wxHeadImgUrl" width="80px" height="80px">
            </grid-item>
            <grid-item :key="2" style=" position: absolute; margin-top: 20px">
                姓名：{{user.name}}<br/>
            </grid-item>
        </grid>
        <div class="footer_quit" v-show="!isWechat">
            <x-button type="warn" action-type="button" @click.native="quit">退出</x-button>
        </div>
<!--        <div>
            <alert v-model="controlVariable.alert.show" :title="controlVariable.alert.title">
                {{controlVariable.alert.content}}
            </alert>
        </div>-->
    </div>
</template>

<script>
    import {Tab, TabItem, ButtonTab, Box, XButton, ButtonTabItem, Divider, Grid, GridItem, Alert} from 'vux';

    import '../model/touch/jqueryui/jquery-ui-1.10.2.custom.min.css';
    import '../model/touch/jqueryui/jquery-ui.min.js';
    import '../model/touch/jquery-touch-punch/jquery.ui.touch-punch.min.js';

    import userInfoModel from '../model/base/UserInfoModel';
    import ComponentAPI from '../api/Component';

    export default {
        components: {
            Tab, TabItem,
            ButtonTab,
            ButtonTabItem,
            Divider,
            Box, XButton, Grid, GridItem, Alert
        },
        data() {
            return {
                user:{
                    createDate:"",
                    email:"",
                    id:"",
                    loginName:"",
                    name:"",
                    tel:"",
                    wxHeadImgUrl:""
                }
            }
        },

        computed:{
            isWechat:function () {
                let isWechat = ComponentAPI.checkIsWechat();
                return isWechat;
            }
        },

        created: async function () {
        	this.user = await userInfoModel.getUserInfo();
        	if(null == this.user.wxHeadImgUrl){
                this.user.wxHeadImgUrl="http://img.edu-hb.com/NewsImg/201105/18/11051822052165chm.png";
            }
        },

        methods: {

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

    .my_home {
        height: 610px;
    }

    .footer_quit {
        position: relative;
        top: 500px;
    }
</style>
