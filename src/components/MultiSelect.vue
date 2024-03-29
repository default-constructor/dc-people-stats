<script lang="ts" setup>
import {ref, watch} from 'vue';
import Tag from '@/components/Tag.vue'
import {colors} from "@/constants/colors";

const emit = defineEmits(["update:modelValue"])

const props = defineProps({
  id: String,
  options: Map,
  defaults: {type: Array, default: [] as any[]},
  label: String
})

const optionsMap = ref((props.options ? new Map([...props.options]) : new Map()) as Map<any, string>)
const selectedMap = ref(new Map<any, string>())
props.defaults.forEach((key: any) => {
  if (optionsMap.value.get(key)) {
    selectedMap.value.set(key, optionsMap.value.get(key) as string)
    optionsMap.value.delete(key)
  }
})
const searchMap = ref([...optionsMap.value])

const inputText = ref('')

selectedMap.value.forEach((k, v) => {
  optionsMap.value.delete(k)
})

const addSelection = (key: string | number) => {
  selectedMap.value.set(key, props.options?.get(key) as string)
  selectedMap.value = new Map<any, string>([...selectedMap.value.entries()].sort((a, b) => {
    if (typeof a[0] === 'string') {
      return (a[0] as string).localeCompare(b[0] as string, 'de')
    } else {
      return a[0] - b[0]
    }
  }));
  optionsMap.value.delete(key)
  searchMap.value = [...optionsMap.value]
  inputText.value = ''
  emit("update:modelValue", Array.from(selectedMap.value.keys()))
}

const removeSelected = (key: any) => {
  optionsMap.value.set(key, props.options?.get(key) as string)
  optionsMap.value = new Map<any, string>([...optionsMap.value.entries()].sort((a, b) => {
    if (typeof a[0] === 'string') {
      return (a[0] as string).localeCompare(b[0] as string, 'de')
    } else {
      return a[0] - b[0]
    }
  }));
  selectedMap.value.delete(key)
  searchMap.value = [...optionsMap.value]
  emit("update:modelValue", Array.from(selectedMap.value.keys()))
}

watch(inputText, input => {
  console.log(input)
  const lowerCasedInput = input.toLowerCase()
  const firstLevelSearch = [...Array.from(optionsMap.value.entries())
      .filter(option =>
          option[0].toString().toLowerCase().includes(lowerCasedInput) ||
          option[1].toString().toLowerCase().includes(lowerCasedInput)
      )]
  // const secondLevelSearch = [...Array.from(optionsMap.value.entries()).filter(option => !option[0].toLowerCase().startsWith(lowerCasedInput) && !option[1].toLowerCase().startsWith(lowerCasedInput) && (option[0].toLowerCase().includes(lowerCasedInput) || option[1].toLowerCase().includes(lowerCasedInput)))]
  searchMap.value = [...firstLevelSearch]
})
</script>

<template>
  <div class="multi-select">
    <div>
      <div class="multi-select__selection">
        <input type="text" v-model="inputText" :placeholder="label" class="multi-select__selection__search" />
        <div class="multi-select__selection__choice">
          <ul>
            <li v-for="[key, value] in searchMap">
              <span @click="addSelection(key)">[{{key}}] {{value}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="multi-select__selected">
        <Tag v-for="([key, value], i) in selectedMap" :identifier="key" :label="'[' + key + '] ' + value" :color="colors[i]" @remove="removeSelected"></Tag>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.multi-select {
  > div {
    display: flex;
  }

  &__selected,
  &__selection {
    width: 368px;
    margin-left: 8px;
  }

  &__selected {
    ul {
      li {
        position: relative;
      }
    }
  }

  &__selection {
    > input {
      width: 100%;
      height: 32px;
    }

    &__choice {
      height: 234px;
      border: 1px solid black;
      background-color: white;
      overflow-y: scroll;

      ul {
        li {
          padding: 4px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
