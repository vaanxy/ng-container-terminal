import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Prestow, Container } from '../shared';
import * as d3 from 'd3';

@Component({
  selector: 'app-pc-network',
  templateUrl: './pc-network.component.html',
  styleUrls: ['./pc-network.component.css']
})
export class PcNetworkComponent implements OnInit {

  @Input() prestows;
  @Input() containers;
  host;
  svg;
  tooltip;
  simulation: d3.Simulation<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>;
  nodes: d3.SimulationNodeDatum[];
  network = {
      nodes: [
        {'id': 'C1', 'group': 1},
        {'id': 'C2', 'group': 1},
        {'id': 'C3', 'group': 1},
        {'id': 'C4', 'group': 1},
        {'id': 'C5', 'group': 1},
        {'id': 'C6', 'group': 1},
        {'id': 'C7', 'group': 1},
        {'id': 'C8', 'group': 1},
        {'id': 'C9', 'group': 1},
        {'id': 'C10', 'group': 1},
        {'id': 'P1', 'group': 2},
        {'id': 'P2', 'group': 2},
        {'id': 'P3', 'group': 2}
      ],
      links: [
        {'source': 'C1', 'target': 'P1', 'value': 1},
        {'source': 'C1', 'target': 'P2', 'value': 2},
        {'source': 'C2', 'target': 'P1', 'value': 1},
        {'source': 'C2', 'target': 'P2', 'value': 3},
        {'source': 'C2', 'target': 'P3', 'value': 4},
        {'source': 'C3', 'target': 'P1', 'value': 2},
        {'source': 'C3', 'target': 'P2', 'value': 3},
        {'source': 'C3', 'target': 'P3', 'value': 1},
        {'source': 'C4', 'target': 'P1', 'value': 1},
        {'source': 'C4', 'target': 'P2', 'value': 1},
        {'source': 'C5', 'target': 'P1', 'value': 1},
        {'source': 'C6', 'target': 'P1', 'value': 1},
        {'source': 'C7', 'target': 'P1', 'value': 1},
        {'source': 'C8', 'target': 'P1', 'value': 1},
        {'source': 'C9', 'target': 'P1', 'value': 1},
        {'source': 'C10', 'target': 'P1', 'value': 10}
      ]
    };

  constructor(private elem: ElementRef) {
    this.host = d3.select(elem.nativeElement);
    this.svg = this.host.append('svg')
      .attr('width', 800)
      .attr('height', 600);
  }

  ngOnInit() {
    this.network = this.createPcNetwork(this.prestows.filter(p => p.group2 === 'AEABD-40-GP-F' && p.cell.slice(0, 3) === '010'), this.containers.filter(c => c.group2 === 'AEABD-40-GP-F'));
    this.tooltip = this.host.select('div.tooltip');


    let dragstarted = (d) => {
            if (!d3.event.active) {
              this.simulation.alphaTarget(0.3).restart();
            }
            d.fx = d.x;
            d.fy = d.y;
    }
    let draged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    let dragended = (d) => {
      if (!d3.event.active) {
        this.simulation.alphaTarget(0);
      };
      d.fx = null;
      d.fy = null;
    };


    let isolate = (force, filter) => {
      let initialize = force.initialize;
      force.initialize = () => { initialize.call(force, this.network.nodes.filter(filter)); };
      return force;
    };

    let link = this.svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.network.links)
      .enter().append('line')
      .attr('stroke', '#aaa');

    let node = this.svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.network.nodes)
      .enter().append('circle')
      .attr('r', 5)
      .attr('fill', (data) => {
        if (data.group === 1) {
          return 'brown';
        } else {
          return 'steelblue';
        }
      })
      .on('mouseover', (d) => {
        this.tooltip.transition()
          .duration(200)
          .style('opacity', .9);

        this.tooltip.html(d.id)
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', (d) => {
          this.tooltip.transition()
              .duration(500)
              .style('opacity', 0);
      })
      .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', draged)
          .on('end', dragended));


    this.simulation = d3.forceSimulation();
    this.simulation
      .nodes(this.network.nodes)
      .on('tick', ticked);
    this.simulation
      .force('link', d3.forceLink(this.network.links)
        .id((data: {id: string}) => data.id)
        .distance((data) => data.value * 2)
      )
      .force('brown', isolate(d3.forceX(-800 / 6), function(d) { return d.group === 1; }))
      .force('steelblue', isolate(d3.forceX(800 / 6), function(d) { return d.group === 2; }))
      .force('x', d3.forceX())
      // .force('y', d3.forceY())
      .force('charge', d3.forceManyBody().strength(-10))
      .force('center', d3.forceCenter(800 / 2, 600 / 2));

    function ticked() {
      link
          .attr('x1', function(d) { return d.source.x; })
          .attr('y1', function(d) { return d.source.y; })
          .attr('x2', function(d) { return d.target.x; })
          .attr('y2', function(d) { return d.target.y; });

      node
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; });
    }
  }

  createPcNetwork(prestows: Prestow[], containers: Container[]) {
    let prestowNodes, containerNodes, nodes, links = [];
    prestowNodes = prestows.map(p => {
      return {id: p.cell, group: 2};
    });
    containerNodes = containers.map(c => {
      return {id: c.no, group: 1};
    });

    nodes = containerNodes.concat(prestowNodes);
    prestows.forEach((p, i) => {
      let targets: Container[];
      targets = containers.filter((c) => {
        return c.group === p.group &&
          c.weight <= p.maxWeight &&
          c.weight >= p.minWeight;
      });
      links = links.concat(
        targets.map(t => {
          return {
            source: p.cell,
            target: t.no,
            value: 1
          };
        })
      );
    });
    console.log({
      'nodes': nodes,
      'links': links
    });
    
    return {
      'nodes': nodes,
      'links': links
    };
  }
}
