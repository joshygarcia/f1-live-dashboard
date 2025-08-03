import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function LapTimeChart({ laps }) {
  const ref = useRef();

  useEffect(() => {
    if (!laps.length) return;
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();
    const width = 400;
    const height = 200;
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const x = d3
      .scaleLinear()
      .domain(d3.extent(laps, (d) => d.lap_number))
      .range([40, width - 10]);

    const y = d3
      .scaleLinear()
      .domain([d3.max(laps, (d) => d.lap_time), d3.min(laps, (d) => d.lap_time)])
      .range([height - 20, 10]);

    const line = d3
      .line()
      .x((d) => x(d.lap_number))
      .y((d) => y(d.lap_time));

    svg
      .append('path')
      .datum(laps)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2)
      .attr('d', line);

    const xAxis = d3.axisBottom(x).ticks(5);
    const yAxis = d3.axisLeft(y).ticks(5);

    svg.append('g').attr('transform', `translate(0,${height - 20})`).call(xAxis);
    svg.append('g').attr('transform', `translate(40,0)`).call(yAxis);
  }, [laps]);

  return <svg ref={ref} className="bg-gray-800 rounded w-full h-52"></svg>;
}
