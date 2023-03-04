<script lang="ts" setup>
import {onMounted, watchEffect} from "vue"
import {Line, line, select} from "d3"
import {ChartData} from "@/models/chart-data.model"

const props = defineProps({
  scale: Object,
  xLabels: Array,
  chartData: Array,
  color: String,
  cssClass: String
})

const createGraph = (scale: any, data: ChartData[]) => {
  const graph = select(`.line-graph.${props.cssClass}`)
  graph.selectChild().remove()

  const lineGraph = graph.append("g").attr("class", "line-graph__line")

  lineGraph.append("path")
      .datum(data)
      .style("fill", "#00000000")
      .style("stroke-width", "4")
      .style("stroke", props.color as string)
      .attr("d", createLine(scale))
}

const createLine = (scale: any): Line<any> => {
  return line()
      .x((d: any) => scale.x(d.x))
      .y((d: any) => scale.y(d.y))
}

onMounted(() => {
  if (props.scale && props.chartData) {
    createGraph(props.scale as any, props.chartData as ChartData[])
  }
})

watchEffect(() => {
  if (props.scale && props.chartData) {
    createGraph(props.scale as any, props.chartData as ChartData[])
  }
})
</script>

<template>
  <g :class="'line-graph ' + cssClass"></g>
</template>

<style lang="scss">

</style>
