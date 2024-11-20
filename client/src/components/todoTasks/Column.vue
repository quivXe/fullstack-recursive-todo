<script setup>

import {computed, onMounted, onUnmounted, ref} from "vue";

const props = defineProps({
    "columnStatusNumber": Number,
    "taskStatusName": String,
    "relativeIndex": Number,
})
const emit = defineEmits([
    "mouseOverColumn"
])

const MAIN_BREAKPOINT = 650;

const currentWidth = ref(window.innerWidth);
const isSmallScreen = computed(() => {
  return currentWidth.value <= MAIN_BREAKPOINT;
});

function resizeHandler() {
  currentWidth.value = window.innerWidth;
}
onMounted(() => {
  window.addEventListener('resize', resizeHandler)
})
onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
})
</script>
<template>
    <div
        class="column-container default"
        :class="{
          smallScreen: isSmallScreen,
          left: relativeIndex===-1,
          center: relativeIndex===0,
          right: relativeIndex===1,
          none: relativeIndex===null
        }"
        @mouseover="emit('mouseOverColumn', columnStatusNumber)"
    >
    
        <div class="column-header"><h3>{{ taskStatusName }}</h3></div>
        <div class="column-content">
            <slot></slot>
        </div>

    </div>

</template>
<style lang="sass" scoped>
    @use "@/assets/styles/common"

    .column-container 
        display: flex
        flex-direction: column

        position: relative
        width: calc(100% / 3)

        box-sizing: border-box

        border-radius: 15px
        border: common.$border
        overflow: hidden
        box-shadow: 0 0 4px 1px common.$box-shadow-color

        transition: transform .1s ease-in-out, box-shadow .1s ease-in-out

        &:hover
            transform: scale(1.003)
            box-shadow: 0 0 2px 0 common.$box-shadow-color-hover

            .column-header
                background-color: common.$bg-color-contrast-2

        .column-header
            text-align: center
            padding: 10px
            border-bottom: common.$border
            background-color: common.$bg-color-2

            transition: background-color .2s ease-in-out

            h3
                margin: 0

        .column-content
            padding: 10px
            display: flex
            flex-direction: column
            gap: 20px
            flex-grow: 1

            background: common.$bg-gradient
            overflow-y: scroll
            @extend %scrollbar
            

    .column-container.smallScreen.left
      order: 1
      width: 10%


    .column-container.smallScreen.center
      order: 2
      width: 80%


    .column-container.smallScreen.right
      order: 3
      width: 10%

    .column-container.smallScreen.left, .column-container.smallScreen.right
      height: 25%
      user-select: none

      .column-header
        height: 100%
        text-align: center
        word-break: break-word
        display: flex
        align-items: center
        justify-content: center
        border: 0

        h3
          writing-mode: sideways-lr


      .column-content
        display: none


</style>