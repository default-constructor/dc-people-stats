<script lang="ts" setup>

const props = defineProps({
  identifier: [String, Number],
  label: String,
  color: String
})

const emit = defineEmits(["remove"])
</script>

<template>
  <div class="tag">
    <div class="tag__label">
      <div class="tag__label__text">
        <span>{{label}}</span>
      </div>
      <div @click="emit('remove', identifier)" class="close"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tag {
  width: 100%;
  margin: 0 0 .5rem;
  background-color: $color-white;

  &__label {
    padding: .5rem 32px .5rem .75rem;
    background-color: v-bind(color);
    border: 1px solid v-bind(color);
    border-radius: 5px;
    position: relative;

    &__text {
      color: $color-white;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .close {
      position: absolute;
      right: 8px;
      top: 12px;
      width: 16px;
      height: 16px;
      opacity: 0.3;
    }
    .close:hover {
      opacity: 1;
    }
    .close:before, .close:after {
      position: absolute;
      left: 7px;
      content: ' ';
      height: 16px;
      width: 2px;
      background-color: $color-white;
    }
    .close:before {
      transform: rotate(45deg);
    }
    .close:after {
      transform: rotate(-45deg);
    }
  }
}
</style>
