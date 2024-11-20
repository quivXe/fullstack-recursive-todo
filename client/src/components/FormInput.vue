<script setup>
import {nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch} from "vue";
    import Debounce from "../utils/debounce";

    const props = defineProps({
      id: { type: String, required: true },
      label: { type: String, required: true },
      type: { type: String, default: "text" },
      value: { type: [String, Number], default: "" },
      placeholder: { type: String, default: "" },
      required: { type: Boolean, default: false },
      info: { type: String, default: null }, // Optional tooltip info
      showTooltipToggle: { type: Boolean, default: false },
    });
  
    const emit = defineEmits(["input", "focus", "blur"]);

    const _showTooltip = ref(false);
    
    const hideTooltip = new Debounce(() => _showTooltip.value = false, 3000);
    const debouncedAdjustTooltip = new Debounce(() => adjustTooltip(), 500);

    watch(() => props.showTooltipToggle, () => {
        _showTooltip.value = true;
        hideTooltip.run();
    });

    const tooltipRef = useTemplateRef("tooltip");

    function adjustTooltip() {
      if (tooltipRef.value) {

        tooltipRef.value.style.transform = '';

        nextTick(() => {

          const rect = tooltipRef.value.getBoundingClientRect();

          if (rect.right >= window.innerWidth) {
            const visible = window.innerWidth - rect.left;
            const notVisible = rect.width - visible;

            tooltipRef.value.style.transform = `translateX(-${notVisible + 10}px)`
          }

        })

      }
    }

    onMounted(() => {
      adjustTooltip();
      window.addEventListener("resize", debouncedAdjustTooltip.run);
    });
    onUnmounted(() => {
      window.removeEventListener("resize", debouncedAdjustTooltip.run);
    })

</script>
<template>
    <div class="field">
      <label :for="id" class="label">{{ label }}</label>
      <div class="input-container">
        <input
          :type="type"
          :id="id"
          :value="value"
          :placeholder="placeholder"
          :required="required"
          @input="event => emit('input', event.target.value)"
          @focus="emit('focus')"
          @blur="emit('blur')"
          class="input"
        />
        <!-- Optional Tooltip Icon -->
        <span 
            v-if="info"
            class="info-icon"
            @mouseover=" hideTooltip.stop(); _showTooltip = true "
            @mouseleave="_showTooltip = false"
            @touchstart.prevent.stop=" _showTooltip = true; hideTooltip.run() "
            :style="{overflow: _showTooltip ? 'visible' : 'hidden'}"
        >
          <img src="@/assets/images/info.svg" alt="ℹ️">
          <span :class="{hidden: !_showTooltip}" class="tooltip" ref="tooltip">{{ info }}</span>
        </span>
      </div>
    </div>
  </template>
  <style scoped lang="sass">
  @use "@/assets/styles/common"
  .field 
    display: flex
    flex-direction: column
    gap: 5px
    
  .input-container 
    position: relative
    display: flex
    align-items: center

  .input 
    padding: 12px 15px
    font-size: 1rem
    width: 100%

    @extend %input
  
  
  .info-icon 
    cursor: pointer
    position: absolute
    left: calc(100% + 5px)
    display: flex
    align-items: center


    img
      height: 20px
      margin: auto
  
  
  .tooltip 
    position: absolute

    top: calc(100% + 10px)
    background-color: common.$bg-color-3
    color: common.$text-color
    padding: 5px 10px
    border-radius: 4px
    font-size: 0.9rem
    white-space: nowrap
    transition: opacity .2s ease
    opacity: 1

    &.hidden
      opacity: 0

  </style>
  