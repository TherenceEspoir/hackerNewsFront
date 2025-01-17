import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { usePosts } from '../hooks/usePosts';

const Analytics = () => {
  // On récupère l’objet renvoyé par le backend
  // exemple : {
  //   "2016": { "JUNE":14, "JULY":1, ... },
  //   "2017": { "JANUARY":2, "FEBRUARY":6, ... },
  //    ...
  // }
  const { postAnalytics,postAnalyticsByType } = usePosts();

  const svgRefBar = useRef(null);
  const svgRefPie = useRef(null);

  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    if (!postAnalytics) return; // si pas encore chargé, on sort

    const svg = d3.select(svgRefBar.current);
    svg.selectAll('*').remove(); // reset du contenu

    const margin = { top: 40, right: 40, bottom: 80, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Échelles
    const x = d3.scaleBand().range([0, width]).padding(0.2);
    const y = d3.scaleLinear().range([height, 0]);

    // ---- Étape 1: Préparer les données ----
    let chartData = {};   // { label: count }

    if (!selectedYear) {
      // Affichage annuel : calculer la somme pour chaque année
      // postAnalytics = { "2016": { "JUNE":14, ... }, "2017": {...}, ... }
      // On veut par ex : chartData = { "2016": 18, "2017": 45, ... }
      Object.keys(postAnalytics).forEach((year) => {
        const monthlyObj = postAnalytics[year];
        const totalForYear = Object.values(monthlyObj).reduce((sum, val) => sum + val, 0);
        chartData[year] = totalForYear;
      });
    } else {
      // Affichage mensuel : on prend directement postAnalytics[selectedYear]
      // par ex : { "JANUARY":19, "FEBRUARY":53, "MARCH":79, ... }
      chartData = postAnalytics[selectedYear];
    }

    // ---- Étape 2: tracer l’histogramme ----

    // On convertit `chartData` en tableau [ [label, count], ... ]
    const entries = Object.entries(chartData); 
    // Ex. [ ["2016", 18], ["2017", 45], ... ] ou [ ["JANUARY",19], ["FEBRUARY",53], ... ]

    // Définir le domaine des axes
    x.domain(entries.map(d => d[0]));
    y.domain([0, d3.max(entries, d => d[1])]);

    const transition = d3.transition().duration(750);

    // Axe X
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-45)');

    // Axe Y
    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    // Dessiner les barres
    g.selectAll('.bar')
      .data(entries)
      .enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d[0]))
        .attr('y', height)
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .attr('fill', '#82ca9d')
      .transition(transition)
        .attr('y', d => y(d[1]))
        .attr('height', d => height - y(d[1]));

    // Interactivité : si on est sur le graphique annuel, 
    // on peut cliquer sur une barre pour aller au détail mensuel.
    if (!selectedYear) {
      g.selectAll('.bar')
        .style('cursor', 'pointer')
        .on('click', (event, d) => setSelectedYear(d[0]))  // d[0] = "2016" / "2017"
        .on('mouseover', function() {
          d3.select(this).transition().duration(200).attr('fill', '#61b082');
        })
        .on('mouseout', function() {
          d3.select(this).transition().duration(200).attr('fill', '#82ca9d');
        });
    }

    // Étiquettes sur les barres
    g.selectAll('.bar-label')
      .data(entries)
      .enter()
      .append('text')
        .attr('class', 'bar-label')
        .attr('text-anchor', 'middle')
        .attr('x', d => x(d[0]) + x.bandwidth()/2)
        .attr('y', d => y(d[1]) - 5)
        .text(d => d[1]);

    // Titre
    g.append('text')
      .attr('class', 'title')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(!selectedYear ? 'Posts par année' : `Répartition mensuelle des posts en ${selectedYear}`);

    // Bouton "Retour" si une année est sélectionnée
    if (selectedYear) {
      const backButton = g.append('g')
        .attr('class', 'back-button')
        .style('cursor', 'pointer')
        .on('click', () => setSelectedYear(null));

      backButton.append('text')
        .attr('x', -40)
        .attr('y', -10)
        .text('←')
        .style('font-size', '20px');

      backButton.append('text')
        .attr('x', -20)
        .attr('y', -10)
        .text('Retour')
        .style('font-size', '14px');
    }

  }, [postAnalytics, selectedYear]);

  useEffect(() => {
    if (!postAnalyticsByType) return; // Attendre que les données soient chargées

    // --- Diagramme en Secteurs pour les Posts par Type ---
    const svgPie = d3.select(svgRefPie.current);
    svgPie.selectAll('*').remove(); // Réinitialiser le contenu

    const widthPie = 400;
    const heightPie = 400;
    const marginPie = 40;

    const radius = Math.min(widthPie, heightPie) / 2 - marginPie;

    const gPie = svgPie
      .append('g')
      .attr('transform', `translate(${widthPie / 2},${heightPie / 2})`);

    const data = postAnalyticsByType; // { "Type1": 10, "Type2": 20, ... }

    const color = d3.scaleOrdinal()
      .domain(Object.keys(data))
      .range(d3.schemeCategory10);

    const pie = d3.pie()
      .sort(null)
      .value(d => d[1]);

    const data_ready = pie(Object.entries(data));

    const arc = d3.arc()
      .innerRadius(0)         // Pour un pie chart
      .outerRadius(radius);
      // Pour un donut chart, définissez innerRadius à une valeur > 0, par ex :
      // .innerRadius(radius * 0.5)

    // Dessiner les secteurs
    gPie.selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data[0]))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('opacity', 0.7)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.7);
      });

    // Ajouter les étiquettes
    gPie.selectAll('text')
      .data(data_ready)
      .enter()
      .append('text')
        .text(d => `${d.data[0]} (${d.data[1]})`)
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .style('text-anchor', 'middle')
        .style('font-size', '12px');

    // Titre
    svgPie.append('text')
      .attr('x', widthPie / 2)
      .attr('y', marginPie / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Posts par Type');

  }, [postAnalyticsByType]);

  return (
    <div className="w-full h-full bg-white rounded-lg p-4 flex flex-col space-y-8">
      {/* Graphique en Barres */}
      <div className="w-full">
        <svg
          ref={svgRefBar}
          className="w-full h-full"
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>

      {/* Graphique en Secteurs */}
      <div className="w-full flex justify-center">
        <svg
          ref={svgRefPie}
          className="w-96 h-96"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </div>
  );
};

export default Analytics;
