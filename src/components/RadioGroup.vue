<script lang="ts" setup>
defineProps({
  id: String,
  name: String,
  label: String,
  options: Array,
  modelValue: Boolean
})

const emit = defineEmits(["update:modelValue"])

const updateModelValue = (event: any) => {
  emit("update:modelValue", event.target.value)
}
</script>

<template>
  <div class="radio-group">
    <ul>
      <li v-for="option in options">
        <label :for="option.id">
          <input type="radio" :name="name" :id="option.id" :value="option.value" :checked="option.checked" @change="updateModelValue"/>
          {{ option.label }}
        </label>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.radio-group {
  ul {
    li {
      list-style: none;
    }
  }
}
</style>
