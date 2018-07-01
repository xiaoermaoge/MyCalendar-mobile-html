<template>
    <div style="height:100%;">


        <view-box ref="viewBox">
            <!--<x-header slot="header" style="width:100%;position:absolute;left:0;top:0;z-index:100;"></x-header>-->
            <transition name="move" mode="out-in">
                <router-view></router-view>
            </transition>
            <tabbar slot="bottom">
                <tabbar-item v-model="nowIndex" link="/user/viewRoomList" >
                    <img slot="icon" src="../assets/icon/room.png">
                    <span slot="label">预定会议室</span>
                </tabbar-item>
                <tabbar-item v-model="nowIndex" link="/user/myOrder">
                    <img slot="icon" src="../assets/icon/cnd.png">
                    <span slot="label">我的预定</span>
                </tabbar-item>
                <tabbar-item v-model="nowIndex" link="/user/myHome">
                    <img slot="icon" src="../assets/icon/my.png">
                    <span slot="label">我的</span>
                </tabbar-item>
            </tabbar>
        </view-box>
    </div>
</template>

<script>
    import {ViewBox, Tabbar, TabbarItem, XHeader, Group} from 'vux';


    export default {
        components: {
            ViewBox, XHeader, Tabbar, Group, TabbarItem
        },
        data () {
            return {
                nowIndex: 1
            }
        },
        methods: {
            clickItem(){

            }
        }
    }
</script>

<style>
    html, body {
        height: 100%;
        width: 100%;
        overflow-x: hidden;
    }
</style>
