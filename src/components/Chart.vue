<script lang="ts">
import {defineComponent, ref, watchEffect} from "vue"
import {axisBottom, axisLeft, scaleBand, scaleLinear, scalePoint, select} from "d3"

export default defineComponent({
  name: "Chart",
  props: {
    type: String,
    xLabels: {
      type: Array,
      required: true
    },
    maxPositiveYValue: {
      type: Number,
      required: true
    },
    maxNegativeYValue: {
      type: Number,
      required: true
    }
  },

  setup(props) {
    const sizeRef = ref({width: 1344, height: 512})
    const marginRef = ref({left: 64, top: 16, right: 64, bottom: 64})
    const chart = {
      width: sizeRef.value.width - marginRef.value.left - marginRef.value.right,
      height: sizeRef.value.height - marginRef.value.top - marginRef.value.bottom
    }
    const scaleRef = ref()

    const createChart = (scale: any, tickValues: string[]) => {
      const chartArea = select("#chart-area")

      const areaScale = chartArea.select(".area__scale")
      areaScale.selectChild().remove()

      const scaleArea = areaScale.append("g").attr("class", "scale__area")

      scaleArea
          .append("g")
          .attr("transform", "translate(0," + chart.height + ")")
          .call(axisBottom(scale.x).tickValues(tickValues))
          .selectAll("text")
          .attr("x", -24)
          .attr("y", 8)
          .attr("dy", ".5em")
          .attr("transform", "rotate(-45)")

      scaleArea.append("g").call(axisLeft(scale.y))

      const areaGrid = chartArea.select(".area__grid")
      areaGrid.selectChild().remove()

      const gridArea = areaGrid.append("g").attr("class", "grid__area")

      gridArea
          .append("g")
          .attr("class", "grid grid--x")
          .attr("transform", "translate(0," + chart.height + ")")
          .call(axisBottom(scale.x).tickSize(-chart.height).tickValues(tickValues).tickFormat(() => ""))

      gridArea
          .append("g")
          .attr("class", "grid grid--y")
          .call(axisLeft(scale.y).tickSize(-chart.width).tickFormat(() => ""))
    }

    watchEffect(() => {
      if (props.xLabels && props.maxPositiveYValue) {
        scaleRef.value = {
          x: props.type === "band" ?
              scaleBand().domain(props.xLabels as string[]).range([0, chart.width]) :
              scalePoint().domain(props.xLabels as string[]).align(0).range([0, chart.width]),
          y: scaleLinear().domain([
            props.maxNegativeYValue,
            props.maxPositiveYValue + (props.maxPositiveYValue * 5 / 100)
          ]).range([chart.height, 0])
        }
        createChart(scaleRef.value, props.xLabels as string[])
      }
    })

    return {
      scaleRef,
      sizeRef,
      marginRef
    }
  }
})
</script>

<template>
  <div class="chart">
    <div class="chart__info">
      <slot name="info"></slot>
    </div>
    <svg :width="sizeRef.width" :height="sizeRef.height" class="chart__area">
      <g id="chart-area" :transform="'translate(' + marginRef.left + ',' + marginRef.top + ')'" class="area">
        <g class="area__scale"></g>
        <g class="area__grid"></g>
        <g class="area__graph">
          <slot name="graph" :scale="scaleRef"></slot>
        </g>
      </g>
    </svg>
    <div class="chart__legend">
      <slot name="legend"></slot>
    </div>
  </div>
</template>

<style lang="scss">
.chart {
  &__area {
    .area {
      &__grid {
        .grid {
          line {
            stroke: lightgrey;
            stroke-opacity: 1;
            shape-rendering: crispEdges;
          }

          path {
            stroke-width: 0
          }
        }
      }
    }
  }

  &__legend {
    margin: 0 64px;
  }
}
</style>
