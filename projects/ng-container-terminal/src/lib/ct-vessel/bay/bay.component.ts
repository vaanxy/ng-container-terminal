import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { CtVesselService } from '../ct-vessel.service';
import { Cell, BayInfoGroup, Prestow, PrestowDigest } from '../../../model';
import * as d3 from 'd3';

@Component({
  selector: 'ct-bay',
  templateUrl: './bay.component.html',
  styleUrls: ['./bay.component.css']
})
export class BayComponent implements OnInit {
  @Input() bayInfoGroup: BayInfoGroup;
  @Input() prestows: Prestow[];
  @Input() prestowDigest: PrestowDigest;
  // @Input() holdBay: BayInfo;
  private host: d3.Selection<any, any, any, any>;
  private svg:  d3.Selection<any, any, any, any>;
  private xb:  d3.Selection<any, any, any, any>;
  private hb:  d3.Selection<any, any, any, any>;
  private xbTitleLabel:  d3.Selection<any, any, any, any>;
  private hbTitleLabel:  d3.Selection<any, any, any, any>;
  private xbDeckTierLabel:  d3.Selection<any, any, any, any>;
  private hbDeckTierLabel:  d3.Selection<any, any, any, any>;
  private xbHoldTierLabel:  d3.Selection<any, any, any, any>;
  private hbHoldTierLabel:  d3.Selection<any, any, any, any>;
  private xbRowLabel:  d3.Selection<any, any, any, any>;
  private hbRowLabel:  d3.Selection<any, any, any, any>;
  private xbDeck:  d3.Selection<any, any, any, any>;
  private hbDeck:  d3.Selection<any, any, any, any>;
  private xbHold:  d3.Selection<any, any, any, any>;
  private hbHold:  d3.Selection<any, any, any, any>;
  private deckBayStruct: Cell[] = [];
  private holdBayStruct: Cell[] = [];
  private basicInfo = {
    maxRow: 17,
    deckHeight: 8,
    // holdHeight: 17,
    holdHeight: 9,
    cabinPos: 0,
    supply00: 0 // 是否包含00列，0表示有00列，1表示没有00列
  };


  private w = 15; // 每个船箱位的宽度
  private h = 15; // 每个船箱位的高度
  private hatchHeight = 15; // 预留的舱盖板位置
  private padding = 16;
  private offset = 20;
  private bayWidth: number;
  private boxWidth: number;
  private boxHeight: number;

  tooltip;


  constructor(private el: ElementRef, private vesselService: CtVesselService) {
    this.host = d3.select(this.el.nativeElement);
    // this.host.html('');
    this.svg = this.host.append('svg');
    this.bayWidth = this.basicInfo.maxRow * this.w;
    this.boxWidth = this.bayWidth + 2 * (this.padding + this.offset);
    this.boxHeight = (this.basicInfo.deckHeight + this.basicInfo.holdHeight) * this.h + this.hatchHeight + 2 * (this.padding + this.offset);
    this.svg
      .attr('width', this.boxWidth * 2)
      .attr('height', this.boxHeight);
  }


  ngOnInit() {
    if (!this.bayInfoGroup) {
      return;
    }
    this.tooltip = this.host.select('div.prestow-tooltip');
    if (this.bayInfoGroup.deck) {
      this.deckBayStruct = this.vesselService.getBay(this.bayInfoGroup.deck.name);
    }
    if (this.bayInfoGroup.hold) {
      this.holdBayStruct = this.vesselService.getBay(this.bayInfoGroup.hold.name);
    }
    this.basicInfo.supply00 = this.deckBayStruct.some(cell => cell.name.slice(4, 6) === '00') ? 0 : 1;

    this.xb = this.svg.append('g');
    this.hb = this.svg.append('g')
      .attr('transform', 'translate(' + this.boxWidth + ', 0)');

    this.xbTitleLabel =
      this.xb.append('g')
          .attr('class', 'xb-title-label')
          .attr('transform', 'translate(0, ' + this.padding * 2 + ')')
          .append('text')
          .text(this.bayInfoGroup.name)
          .attr('x', this.boxWidth / 2)
          .attr('text-anchor', 'middle');

    this.hbTitleLabel =
      this.hb.append('g')
          .attr('class', 'hb-title-label')
          .attr('transform', 'translate(0, ' + this.padding * 2 + ')')
          .append('text')
          .text(this.bayInfoGroup.name)
          .attr('x', this.boxWidth / 2)
          .attr('text-anchor', 'middle');

    this.xbDeck =
      this.xb.append('g')
          .attr('class', 'xb-deck')
          .attr('transform', 'translate(' + (this.padding + this.offset) + ', ' + (this.padding + this.offset) + ')');

    this.hbDeck =
      this.hb.append('g')
          .attr('class', 'hb-deck')
          .attr('transform', 'translate(' + (this.padding + this.offset) + ', ' + (this.padding + this.offset) + ')');

    this.xbHold =
      this.xb.append('g')
          .attr('class', 'xb-hold')
          .attr('transform', 'translate('
            + (this.padding + this.offset) + ', '
            + (this.padding + this.offset + this.basicInfo.deckHeight * this.h + this.hatchHeight)
            + ')');

    this.hbHold =
      this.hb.append('g')
          .attr('class', 'hb-hold')
          .attr('transform', 'translate('
          + (this.padding + this.offset) + ', '
          + (this.padding + this.offset + this.basicInfo.deckHeight * this.h + this.hatchHeight)
          + ')');

    this.xbRowLabel =
      this.svg.append('g')
          .attr('class', 'xb-row-label')
          .attr('transform', 'translate(' + (this.padding + this.offset) + ', ' + (this.boxHeight - this.padding) + ')')
          .selectAll('text')
          .data(['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16'])
          .enter()
          .append('text')
          .text((row) => row)
          .attr('x', (row) => this.calcXPos(+row) + this.w / 2)
          .attr('font-size', '8')
          .attr('text-anchor', 'middle')
          ;

    const hbDecks = this.deckBayStruct
      .map((c) => {
        const cell = {
          'cell': c.hb,
          'supply00': c.supply00
        };
        return cell;
        })
      .filter(hb => null !== hb.cell);

    const xbDecks = this.deckBayStruct
      .map((c) => {
        const cell = {
          'cell': c.xb,
          'supply00': c.supply00
        };
        return cell;
        })
      .filter(xb => null !== xb.cell);
    const hbHolds = this.holdBayStruct
      .map((c) => {
        const cell = {
          'cell': c.hb,
          'supply00': c.supply00
        };
        return cell;
        })
      .filter(hb => null !== hb.cell);

    const xbHolds = this.holdBayStruct
      .map((c) => {
        const cell = {
          'cell': c.xb,
          'supply00': c.supply00
        };
        return cell;
        })
      .filter(xb => null !== xb.cell);
      this.renderBay(this.xbDeck, xbDecks);
      this.renderBay(this.hbDeck, hbDecks);
      this.renderBay(this.xbHold, xbHolds);
      this.renderBay(this.hbHold, hbHolds);


      const xbDeckPrestow = this.prestows.filter(p => {
        return p.cell.slice(3, 4) === 'D' && (
            p.cell.slice(0, 3) === this.bayInfoGroup.name ||
            parseInt(p.cell.slice(0, 3), 10) + 1 === parseInt(this.bayInfoGroup.name.slice(0, 3), 10)
          );
      });

      const xbHoldPrestow = this.prestows.filter(p => {
        return p.cell.slice(3, 4) === 'H' && (
            p.cell.slice(0, 3) === this.bayInfoGroup.name ||
            parseInt(p.cell.slice(0, 3), 10) + 1 === parseInt(this.bayInfoGroup.name.slice(0, 3), 10)
          );
      });
      const hbDeckPrestow = this.prestows.filter(p => {
        return p.cell.slice(3, 4) === 'D' && (
            p.cell.slice(0, 3) === this.bayInfoGroup.name ||
            parseInt(p.cell.slice(0, 3), 10) - 1 === parseInt(this.bayInfoGroup.name.slice(0, 3), 10)
          );
      });

      const hbHoldPrestow = this.prestows.filter(p => {
        return p.cell.slice(3, 4) === 'H' && (
            p.cell.slice(0, 3) === this.bayInfoGroup.name ||
            parseInt(p.cell.slice(0, 3), 10) - 1 === parseInt(this.bayInfoGroup.name.slice(0, 3), 10)
          );
      });
      this.renderPrestow(this.xbDeck, xbDeckPrestow);
      this.renderPrestow(this.xbHold, xbHoldPrestow);
      this.renderPrestow(this.hbDeck, hbDeckPrestow);
      this.renderPrestow(this.hbHold, hbHoldPrestow);




    // let zoom = d3.zoom()
    //   .scaleExtent([0.25, 2])
    //   .on('zoom', () => {
    //     let transform = d3.zoomTransform(this.hb.node());
    //     this.hb.attr('transform', transform.toString());
    //     // this.hb.attr('transform', 'translate(' + transform.x + ',' + transform.y + ') scale(' + '2.0' + ')');
    //   });



  }

  /**
   * @description: 利用d3渲染贝位图
   * @param: svg宿主，贝位图将会被渲染在该svg宿主之中;
   * @param: 贝位的船箱位数据;
   */
  renderBay(host: d3.Selection<any, any, any, any>, bayData: {cell: string, supply00: number}[]) {
    host
      .selectAll('rect')
      .data(bayData)
      .enter()
      .append('rect')
      .attr('width', this.w)
      .attr('height', this.h)
      .attr('y', (data, i) => {
        return this.calcYPos(+data.cell.slice(6, 9));
      })
      .attr('x', (data, i) => {
        const cell: string = data.cell;
        const row = +cell.slice(4, 6);
        return this.calcXPos(row);
      })
      .attr('stroke', 'grey')
      .attr('stroke-width', '2px')
      .attr('fill', 'rgb(255, 255, 255)');
  }

  /**
   * @description: 利用d3渲染在贝位图上渲染预配船图
   * @param: svg宿主，预配船图将会被渲染在该svg宿主之中;
   * @param: 预配船图的预配数据;
   */
  renderPrestow(host: d3.Selection<any, any, any, any>, prestowData: Prestow[]) {
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(this.prestowDigest.pods);
    // console.log(color('1'), color('3'));
    host
      .selectAll('rect.prestow')
      .data(prestowData)
      .enter()
      .append('rect')
      .attr('class', 'prestow')
      .attr('width', this.w)
      .attr('height', this.h)
      .attr('y', (data, i) => {
        return this.calcYPos(+data.cell.slice(6, 9));
      })
      .attr('x', (data, i) => {
        const cell: string = data.cell;
        const row = +cell.slice(4, 6);
        return this.calcXPos(row);
      })
      .attr('stroke', (data) => {
        if (data.size === '40') {
          return 'red';
        }
        return 'black';
      })
      .attr('stroke-width', '2')
      .attr('fill', (data) => {
        return color(data.pod);
      })
      .on('mouseover', (d) => {
        this.tooltip.transition()
          .duration(200)
          .style('opacity', .9);

        this.tooltip.html(d.group)
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', (d) => {
        console.log('out');

          this.tooltip.transition()
              .duration(500)
              .style('opacity', 0);
      });
  }

  /**
   * @description: 利用d3渲染在贝位图上渲染集装箱信息
   * @param: svg宿主，贝位图将会被渲染在这个制定的svg宿主之中;
   * @param: 制定贝位的船箱位数据;
   */
  renderContainer(host: d3.Selection<any, any, any, any>, bayData: {cell: string, supply00: number}[]) {
    host
      .selectAll('rect')
      .data(bayData)
      .enter()
      .append('rect')
      .attr('width', this.w)
      .attr('height', this.h)
      .attr('y', (data, i) => {
        let tier, yPos;
        const cell: string = data.cell;
        if (cell[3] === 'D') {
          tier = (+cell.slice(6, 9) - 80) / 2;
          yPos = (this.basicInfo.deckHeight - tier) * this.h;
        } else {
          tier = +cell.slice(6, 9) / 2;
          yPos = (this.basicInfo.holdHeight - tier) * this.h + this.hatchHeight;
        }
        return yPos;
      })
      .attr('x', (data, i) => {
        const cell: string = data.cell;
        const row = +cell.slice(4, 6);
        return this.calcXPos(row);
      })
      .attr('stroke', 'grey')
      .attr('stroke-width', '2px')
      .attr('fill', 'rgb(255, 255, 255)');
  }

  private calcXPos(row: number) {
    let xPos;
    // let cell: string = data.cell;
    // row = +cell.slice(4, 6);
    row = row * ((row % 2) * 2 - 1) + this.basicInfo.maxRow + this.basicInfo.maxRow % 2;
    row = (row + row % 2) / 2;
    xPos = (row + ((this.basicInfo.supply00 - 1) / 2)) * this.w;
    return xPos;
  }

  private calcYPos(tier: number) {
    let yPos;
    // let cell: string = data.cell;
    if (tier > 60) {
      tier = (tier - 80) / 2;
      yPos = (this.basicInfo.deckHeight - tier) * this.h;
    } else {
      tier = tier / 2;
      yPos = (this.basicInfo.holdHeight - tier) * this.h;
    }
    return yPos;
  }
}
