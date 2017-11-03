import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Container } from '../../shared/container';
import * as d3 from 'd3';
@Component({
  selector: 'app-yard-bay',
  templateUrl: './yard-bay.component.html',
  styleUrls: ['./yard-bay.component.css']
})
export class YardBayComponent implements OnInit {
  host: d3.Selection<any, any, any, any>;
  svg: d3.Selection<any, any, any, any>;
  yardBayGroup: d3.Selection<any, any, any, any>;
  yardBayRowLabelGroup: d3.Selection<any, any, any, any>;
  yardBayTierLabelGroup: d3.Selection<any, any, any, any>;
  yardBayNameLabelGroup: d3.Selection<any, any, any, any>;
  containerGroup: d3.Selection<any, any, any, any>;

  cellSize: number = 30;
  padding: number = 16;
  containers: Container[];
  @Input() inputContainers: Container[];
  @Input() size: [number, number];
  @Input() yardBayName: string;
  @Output() onContainerClicked: EventEmitter<Container> = new EventEmitter();
  slots: string[] = [];

  constructor(private el: ElementRef) {
  }
  ngOnInit() {
    this.containers = [...this.inputContainers];
    d3.range(1, this.size[0] + 1)
      .forEach((row: number) => {
        d3.range(1, this.size[1] + 1).forEach((tier: number) => {
          this.slots.push(this.yardBayName + '0' + row + tier);
        });
    });
    this.host = d3.select(this.el.nativeElement);
    this.svg = this.host.select('svg')
      .attr('width', (this.size[0] + 1) * this.cellSize + 2 * this.padding)
      .attr('height', (this.size[1] + 1) * this.cellSize + 2 * this.padding);
    this.yardBayGroup = this.svg.append('g')
      .attr('class', 'yard-bay-group');
    this.containerGroup = this.svg.append('g')
      .attr('class', 'container-group');
    this.renderLayout();
    this.updateContainer();
    // this.addContainer(this.containers[0], '111');
    // d3.interval(_ => this.updateLayout(), 1000);
  }

  // updateLayout() {
  //   this.slots.pop();
  //   this.renderLayout();
  // }

  /**
   * 绘制贝位结构
   */
  renderLayout() {
    let rect = this.yardBayGroup
      .selectAll('rect')
      .data(this.slots);

    rect
      .enter()
      .append('rect')
      .attr('x', (cellName: string) => {
        return (parseInt(cellName.slice(5, 7), 10)) * this.cellSize;
      })
      .attr('y', (cellName: string) => {
        return (this.size[1] - (parseInt(cellName[cellName.length - 1], 10))) * this.cellSize;
      })
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('fill', 'white')
      .attr('stroke', 'rgb(0,0,0)')
      .attr('stroke-width', '2px');
    rect.exit().remove();

    // 绘制层标签
    this.yardBayTierLabelGroup = this.svg.append('g')
    .attr('class', 'yard-bay-tier-label-group');
    this.yardBayTierLabelGroup.selectAll('text').data(d3.range(1, this.size[1] + 1)).enter().append('text')
    .attr('width', this.cellSize)
    .attr('height', this.cellSize)
    .attr('transform', (label) => {
      let x = 0;
      let y = (this.size[1] - label) * this.cellSize;
      return `translate(${x}, ${y})`;
    })
    .attr('font-size', '12')
    .attr('text-anchor', 'middle')
    .attr('dx', this.cellSize / 3 * 2)
    .attr('dy', this.cellSize / 3 * 2)
    .text(c => c);

    // 绘制列标签
    this.yardBayRowLabelGroup = this.svg.append('g')
    .attr('class', 'yard-bay-row-label-group');
    this.yardBayRowLabelGroup.selectAll('text').data(d3.range(1, this.size[0] + 1)).enter().append('text')
    .attr('width', this.cellSize)
    .attr('height', this.cellSize)
    .attr('transform', (label) => {
      let x = label * this.cellSize;
      let y = this.size[1] * this.cellSize;
      return `translate(${x}, ${y})`;
    })
    .attr('font-size', '12')
    .attr('text-anchor', 'middle')
    .attr('dx', this.cellSize / 2)
    .attr('dy', this.cellSize / 2)
    .text(c => c);

    // 绘制区位号标签
    this.yardBayNameLabelGroup = this.svg.append('g')
    .attr('class', 'yard-bay-name-label-group');
    this.yardBayNameLabelGroup.append('text')
    .attr('transform', (label) => {
      let x = (this.size[0] + 1) / 2.0  * this.cellSize;
      let y = (this.size[1] + 1) * this.cellSize;
      return `translate(${x}, ${y})`;
    })
    .attr('font-size', '16')
    .attr('text-anchor', 'middle')
    .attr('dx', this.cellSize / 2)
    .attr('dy', this.cellSize / 2)
    .text(this.yardBayName);

  }

  updateContainer() {
    let cell = this.containerGroup
      .selectAll('g.container')
      .data(this.containers, (c: Container) => { return c.no; });

    let enteredCell = cell.enter();

    this.renderContainer(enteredCell);
    cell.exit()
    .transition()
    .attr('transform', (container: Container) => {
      let x = (parseInt(container.location.slice(5, 7), 10)) * this.cellSize;
      return `translate(${x}, -${this.cellSize})`;
    })
    .remove();
  }

  renderContainer(selection: d3.Selection<any, any, any, any>) {
    let g = selection.append('g')
      .style('cursor', 'pointer')
      .attr('class', 'container')
      .attr('transform', (container: Container) => {
        let x = (parseInt(container.location.slice(5, 7), 10)) * this.cellSize;
        let y = (this.size[1] - (parseInt(container.location[container.location.length - 1], 10))) * this.cellSize;
        return `translate(${x}, -${y + this.cellSize})`;
      })
      .on('click', (container: Container, index: number) => {
          this.removeContainer(container.no);
      });
    g.append('rect')
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .attr('fill', 'burlywood')
      .attr('stroke', 'rgb(0,0,0)')
      .attr('stroke-width', '2px');
    g.append('text')
      .attr('font-size', '9')
      .attr('text-anchor', 'middle')
      .attr('dx', this.cellSize / 2)
      .attr('dy', this.cellSize / 2)
      .text(c => c.weight.toFixed(2));
    g.transition()
    .delay((container) => {
      let tier = parseInt(container.location[container.location.length - 1], 10);
      return (tier) * 100;
    })
    .attr('transform', (container: Container) => {
      let x = (parseInt(container.location.slice(5, 7), 10)) * this.cellSize;
      let y = (this.size[1] - (parseInt(container.location[container.location.length - 1], 10))) * this.cellSize;
      return `translate(${x}, ${y})`;
    });
  }

  // removeContainer(index: number) {
  //   this.containers.splice(index, 1);
  //   this.updateContainer();
  // }
  removeContainer(containerNo: string) {
    this.containers = this.containers.filter(c => c.no !== containerNo);
    this.updateContainer();
  }


  addContainer(container: Container, location: string) {
    if (location.slice(0, 5) !== this.yardBayName) {
      throw new Error(`所安排的场地位置${location}不属于当前区位${this.yardBayName}`);
    }
    this.containers = [...this.containers, Object.assign({location: location}, container)];
  }
}
