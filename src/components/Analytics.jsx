import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { usePosts } from '../hooks/usePosts';

const Analytics = () => {
  const { postAnalytics } = usePosts();
  const svgRef = useRef(null);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    const { yearlyData, monthlyData } = processData(postAnalytics);
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 40, right: 40, bottom: 80, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .range([height, 0]);

    const createBars = (data, isYearly = true) => {
      const transition = d3.transition().duration(750);

      // Mise à jour des échelles
      x.domain(Object.keys(data));
      y.domain([0, d3.max(Object.values(data))]);

      // Axes
      const xAxis = g.selectAll('.x-axis')
        .data([null]);

      xAxis.enter()
        .append('g')
        .attr('class', 'x-axis')
        .merge(xAxis)
        .attr('transform', `translate(0,${height})`)
        .transition(transition)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-45)');

      const yAxis = g.selectAll('.y-axis')
        .data([null]);

      yAxis.enter()
        .append('g')
        .attr('class', 'y-axis')
        .merge(yAxis)
        .transition(transition)
        .call(d3.axisLeft(y));

      // Barres
      const bars = g.selectAll('.bar')
        .data(Object.entries(data), d => d[0]);

      // Exit
      bars.exit()
        .transition(transition)
        .attr('y', height)
        .attr('height', 0)
        .remove();

      // Enter
      const barsEnter = bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d[0]))
        .attr('y', height)
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .attr('fill', '#82ca9d');

      // Update + Enter
      bars.merge(barsEnter)
        .transition(transition)
        .attr('x', d => x(d[0]))
        .attr('y', d => y(d[1]))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d[1]));

      // Interactivité pour les barres annuelles
      if (isYearly) {
        bars.merge(barsEnter)
          .style('cursor', 'pointer')
          .on('click', (event, d) => setSelectedYear(d[0]))
          .on('mouseover', function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('fill', '#61b082');
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('fill', '#82ca9d');
          });
      }

      // Étiquettes de valeur
      const labels = g.selectAll('.bar-label')
        .data(Object.entries(data), d => d[0]);

      labels.exit().remove();

      const labelsEnter = labels.enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('text-anchor', 'middle');

      labels.merge(labelsEnter)
        .transition(transition)
        .attr('x', d => x(d[0]) + x.bandwidth() / 2)
        .attr('y', d => y(d[1]) - 5)
        .text(d => d[1]);
    };

    // Titre
    g.append('text')
      .attr('class', 'title')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(selectedYear ? `Répartition mensuelle des posts en ${selectedYear}` : 'Posts par année');

    if (selectedYear) {
      // Bouton retour
      const backButton = g.append('g')
        .attr('class', 'back-button')
        .style('cursor', 'pointer')
        .on('click', () => setSelectedYear(null));

      backButton.append('text')
        .attr('x', -40)
        .attr('y', -20)
        .text('←')
        .style('font-size', '20px');

      backButton.append('text')
        .attr('x', -20)
        .attr('y', -20)
        .text('Retour')
        .style('font-size', '14px');

      createBars(monthlyData[selectedYear], false);
    } else {
      createBars(yearlyData, true);
    }
  }, [postAnalytics, selectedYear]);

  const processData = (data) => {
    const yearlyData = {};
    const monthlyData = {};
    const monthNames = {
      "01": "Janvier", "02": "Février", "03": "Mars", "04": "Avril",
      "05": "Mai", "06": "Juin", "07": "Juillet", "08": "Août",
      "09": "Septembre", "10": "Octobre", "11": "Novembre", "12": "Décembre"
    };

    Object.entries(data).forEach(([date, count]) => {
      const [year, month] = date.split('-');
      
      if (!yearlyData[year]) yearlyData[year] = 0;
      yearlyData[year] += count;

      if (!monthlyData[year]) monthlyData[year] = {};
      if (!monthlyData[year][monthNames[month]]) monthlyData[year][monthNames[month]] = 0;
      monthlyData[year][monthNames[month]] += count;
    });

    // Remplir les mois manquants avec des zéros
    Object.keys(monthlyData).forEach(year => {
      Object.values(monthNames).forEach(month => {
        if (!monthlyData[year][month]) monthlyData[year][month] = 0;
      });
    });

    return { yearlyData, monthlyData };
  };

  return (
    <div className="w-full h-full bg-white rounded-lg p-4">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export default Analytics;