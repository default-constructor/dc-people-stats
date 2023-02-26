<script lang="ts" setup>
import {ref} from "vue";
import ActionButton from "@/components/ActionButton.vue";

const props = defineProps({
  id: String,
  options: Array,
  defaults: Array,
  label: String
})

const selectedList = ref(props.defaults ? [...props.defaults] : [] as string[])
const optionsList = ref(props.options ? [...props.options] : [] as string[])
const inputText = ref('')
const showOptions = ref(false)

selectedList.value.forEach(selected => {
  const index = optionsList.value.indexOf(selected)
  if (index !== -1) {
    optionsList.value.splice(index, 1)
  }
})

const addSelection = (selection: string) => {
  selectedList.value.push(selection)
  selectedList.value.sort((a, b) => (a as string).localeCompare(b as string, 'de'))
  const optionIndex = optionsList.value.indexOf(selection)
  if (optionIndex !== -1) {
    optionsList.value.splice(optionIndex, 1)
  }
  showOptions.value = false
}

const removeSelected = (selected: string) => {
  const selectedIndex = selectedList.value.indexOf(selected)
  if (selectedIndex !== -1) {
    selectedList.value.splice(selectedIndex, 1)
  }

  optionsList.value.push(selected)
  optionsList.value.sort((a, b) => (a as string).localeCompare(b as string, 'de'))
}

const emit = defineEmits(["update:modelValue"])

const updateModelValue = () => {
  emit("update:modelValue", selectedList.value)
}
</script>

<template>
  <div class="multi-select">
    <span>{{label}}</span>
    <div class="multi-select__selected">
      <ul>
        <li v-for="selected in selectedList">
          <div>
            <span>{{selected}}</span>
            <div @click="removeSelected(selected)" class="close"></div>
          </div>
        </li>
      </ul>
    </div>
    <input type="text" :value="inputText" @focusin="showOptions = true" />
    <div v-if="showOptions" class="multi-select__selection">
      <ul>
        <li v-for="option in optionsList">
          <div @click="addSelection(option)">
            <span>{{option}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="multi-select__actions">
      <ActionButton label="Anwenden" @click="updateModelValue"></ActionButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.multi-select {
  display: flex;
  flex-direction: column;
  position: relative;

  > div,
  > input {
    width: 256px;
  }

  &__selected,
  &__selection {
    overflow-y: scroll;
  }

  &__selected {
    height: 64px;
    border: 1px solid black;

    ul {
      li {
        position: relative;
      }
    }
  }

  &__selection {
    height: 256px;
    border: 1px solid black;
    background-color: white;
    position: absolute;
    top: 110px;
    left: 0;
    z-index: 10;

    ul {
      li {
        cursor: pointer;
      }
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  ul {
    margin: 4px;
    padding: 4px;

    li {
      list-style: none;
    }
  }
}

.close {
  position: absolute;
  right: 4px;
  top: 4px;
  width: 8px;
  height: 8px;
  opacity: 0.3;
}
.close:hover {
  opacity: 1;
}
.close:before, .close:after {
  position: absolute;
  left: 0;
  content: ' ';
  height: 16px;
  width: 2px;
  background-color: #333;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}
</style>
