<template>
    <div :class="['head-portrait', { online: isOnline }]">
        <img :src="imgUrl" alt="">
    </div>
</template>

<script>
export default {
    props: {
        imgUrl: { default: require('@/assets/img/head_portrait.jpg') },
        isOnline: {
            type: Boolean,
            default: false
        },
    },
}
</script>

<style lang="scss" scoped>
// .head-portrait {
//     width: 50px;
//     height: 50px;
//     border-radius: 50%;
//     // border: 2px solid rgb(137,140,151);
//     border: 2px solid rgb(255, 255, 255);
//     position: relative;

//     &::before {
//         content: '';
//         width: 15px;
//         height: 15px;
//         z-index: 1;
//         display: block;
//         border-radius: 50%;
//         background-color: rgb(144, 225, 80);
//         position: absolute;
//         right: 0;
//     }

//     img {
//         width: 45px;
//         height: 45px;
//         border-radius: 50%;
//         // padding: 2px;
//         box-sizing: border-box;
//         position: absolute;
//         left: 50%;
//         top: 50%;
//         transform: translate(-50%, -50%);
//         vertical-align: middle;
//     }
// }
.head-portrait {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid rgb(255, 255, 255);
    position: relative;

    &::before {
        content: '';
        width: 15px;
        height: 15px;
        z-index: 1;
        display: block;
        border-radius: 50%;
        background-color: rgb(229, 44, 44); // Default color for offline
        position: absolute;
        right: 0;
    }

    &.online::before {
        background-color: rgb(144, 225, 80); // Color for online
    }

    img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        box-sizing: border-box;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        vertical-align: middle;
    }
}
</style>