import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { usePosts } from '../hooks/usePosts';
import { getMonthlyDataFromAnnualData } from '../utils/chartUtils';

const Analytics = () => {
  const { posts } = usePosts();
  const [postsByDate, setPostsByDate] = useState([]);
  const [monthlyPostData, setMonthlyPostData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const formattedPostsByDate = Object.entries(posts).map(([date, count]) => ({
      date,
      count,
    }));
    setPostsByDate(formattedPostsByDate);
  }, [posts]);

  const handleBarClick = (data) => {
    const year = data.date.slice(0, 4);
    setSelectedYear(year);
    const monthlyData = getMonthlyDataFromAnnualData(posts);
    setMonthlyPostData(monthlyData.filter((item) => item.year === year));
    updateChart(monthlyData.filter((item) => item.year === year));
  };

  useEffect(() => {
    if (chartRef.current) {
      updateChart(monthlyPostData);
    }
  }, [monthlyPostData]);

  const updateChart = (data) => {
    d3.select(chartRef.current).selectAll('*').remove();

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleBand()
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height - margin.bottom, margin.top]);

    x.domain(data.map((d) => `${d.month + 1}`));
    y.domain([0, d3.max(data, (d) => d.count)]);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(`${d.month + 1}`))
      .attr('width', x.bandwidth())
      .attr('y', (d) => y(d.count))
      .attr('height', (d) => height - margin.bottom - y(d.count))
      .attr('fill', '#82ca9d');

    if (selectedYear) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .text(`Posts en ${selectedYear}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Statistiques HackerNews</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Nombre de posts par date</h2>
        <div ref={chartRef} />
      </div>
    </div>
  );
};

export default Analytics;