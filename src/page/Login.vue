<template>
    <div>
        <div class="vux-demo">
            <group>
                <x-input title="用户名" v-model="userName"></x-input>
                <x-input title="密码" v-model="password" type="password"></x-input>
            </group>
            <box gap="10px 10px">
                <x-button type="primary" @click.native="login">登录</x-button>
            </box>
        </div>
        <div>
            <alert v-model="controlVariable.alert.show" :title="controlVariable.alert.title">
                {{controlVariable.alert.content}}
            </alert>
        </div>
    </div>
</template>

<script>
    import {XButton, Group, Box, XInput, Alert} from 'vux';

    import UserInfoModel from '../model/base/UserInfoModel';

    export default {
        components: {
            XButton, Group, Box, XInput, Alert
        },
        data () {
            return {
            	userName:'',
            	password:'',
                controlVariable: {
                    alert: {
                        show: false,
                        title: "",
                        content: "",
                    }
                },
            }
        },
        methods: {
            async login(){
                let self = this;
            	if('' != this.userName && '' != this.password){
            		let param = {
                        userName:this.userName,
                        password:this.password,
                    };
                    let result = await UserInfoModel.loginSubmit(param);
                    console.log(result, result.status);
            		if(result.status){
                        this.$router.push('/user/viewRoomList');
                    } else {
                        self.controlVariable.alert.show = true;
                        self.controlVariable.alert.title = "失败";
                        self.controlVariable.alert.content = "用户名或密码错误";
                    }
                } else {
                    self.controlVariable.alert.show = true;
                    self.controlVariable.alert.title = "警告";
                    self.controlVariable.alert.content = "用户名和密码不能为空";
                }
            },

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
