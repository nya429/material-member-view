import { MemberListService } from './../member-list.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-memebr-diff-chart',
  templateUrl: './memebr-diff-chart.component.html',
  styleUrls: ['./memebr-diff-chart.component.css']
})
export class MemebrDiffChartComponent implements OnInit {
  @ViewChild('lineChart') private chartContainer: ElementRef;

  private dataset = [
    {'year' : '2017/10', 'value': 671100},
    {'year' : '2017/11', 'value': 684700},
    {'year' : '2017/12', 'value': 711100},
    {'year' : '2018/01', 'value': 724200},
    {'year' : '2018/02', 'value': 745300},
    {'year' : '2018/03', 'value': 774100},
    {'year' : '2018/04', 'value': 755200},
    {'year' : '2018/05', 'value': 774100},
    {'year' : '2018/06', 'value': 726700},
    {'year' : '2018/07', 'value': 737100},
    {'year' : '2018/08', 'value': 689200},
    {'year' : '2018/09', 'value': 652300},
    {'year' : '2018/10', 'value': 727100},
    {'year' : '2018/11', 'value': 708200},
];


private dataset2 = [
  {'year' : '2017/10', 'value': 578800},
  {'year' : '2017/11', 'value': 614700},
  {'year' : '2017/12', 'value': 591100},
  {'year' : '2018/01', 'value': 624320},
  {'year' : '2018/02', 'value': 645300},
  {'year' : '2018/03', 'value': 674100},
  {'year' : '2018/04', 'value': 655200},
  {'year' : '2018/05', 'value': 671100},
  {'year' : '2018/06', 'value': 684700},
  {'year' : '2018/07', 'value': 711100},
  {'year' : '2018/08', 'value': 724200},
  {'year' : '2018/09', 'value': 745300},
  {'year' : '2018/10', 'value': 774100},
  {'year' : '2018/11', 'value': 755200},
];

  line: any;
  element;
  svg: any;


  private width: number;
  private height: number;
  private margin = { top: 20, bottom: 30, left: 30, right: 20};

  private xScale: any;
  private yScale: any;

  private g: any;
  private lineG: any;

  private tooltip
  private showTootip: boolean;
  private tooltipW = 150;
  private tooltipH = 80;
  


  constructor(private memberListService: MemberListService) { }

  ngOnInit() {
    this.element = this.chartContainer.nativeElement;
    this.createBase();
    this.createChart();
    this.memberListService.windowResized.subscribe(() => this.resize());
  }

  createBase() {
    this.width = this.element.offsetWidth;
    this.height = 400;
    if (this.element.parentNode.parentNode.getBoundingClientRect().height === 300) {
      this.height = 600;
    }
     /* ----------create svg------------*/
    this.svg = d3.select(this.element).append('svg');
    this.svg.attr('class', 'chartBase')
              .attr('width', this.element.offsetWidth)
              .attr('height', this.height);
  }
  
  resize() {
    this.width =  this.element.offsetWidth;
    this.svg.attr('width', this.element.offsetWidth);

    this.xScale = d3.scaleTime().range([0, this.width - this.margin.left - this.margin.right]);
    // this.yScale = d3.scaleLinear().range([this.height - this.margin.top - this.margin.bottom, 0]);
    this.xScale.domain(d3.extent(this.dataset, d =>  d.year ));

    this.line
      .x(d => this.xScale(d.year))

    this.g.select('.axis--x')
    .attr('transform', 'translate(0,' + (this.height  - this.margin.top - this.margin.bottom) + ')')
    // TODO add scalbel axis condition here .ticks()
    .call(d3.axisBottom(this.xScale));

    console.log(this.line(this.dataset))
    this.lineG.select('.line')
    .attr('d', this.line(this.dataset))
  }

  createChart() {

    this.xScale = d3.scaleTime().range([0, this.width - this.margin.left - this.margin.right]);
    this.yScale = d3.scaleLinear().range([this.height - this.margin.top - this.margin.bottom, 0]);



    /* ----------create line generator------------*/
    this.line = d3.line();
    this.line
      .x(d => this.xScale(d.year))
      .y(d => this.yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

  /* ----------set data parser------------*/

    this.dataset.forEach(d => this.dataparse(d));
    this.dataset2.forEach(d => this.dataparse(d));

    /* ----------set scale domain------------*/
    const min = (d3.min([d3.min(this.dataset2, d => d.value), d3.min(this.dataset, d => d.value)]));
    const max = (d3.max([d3.max(this.dataset2, d => d.value), d3.max(this.dataset, d => d.value)]));
    this.xScale.domain(d3.extent(this.dataset, d =>  d.year ));
    this.yScale.domain([min / 1.002, max * 1.002]);

    /* ----------append Axis------------*/
   this.svg.append('g').attr('class', 'line-g');
   this.g = this.svg.select('g');
   this.g.attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
   this.g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + (this.height  - this.margin.top - this.margin.bottom) + ')')
      // TODO add scalbel axis condition here .ticks()
      .call(d3.axisBottom(this.xScale));

      this.g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(this.yScale).ticks(6).tickFormat(function(d) { return (d / 1000) + 'k'; }))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .attr('fill', '#5D6971');

     this.lineG = this.svg.select('.line-g');

      this.lineG.append('path')
      .datum(this.dataset)
      .attr('class', 'line2')
      .attr('d', this.line)
      .style('fill', 'none')
      .style('stroke', 'SKYBLUE')
      .style('stroke-width', 2)
        .transition()
          .delay(500)
          .duration(1000)
          .attr('d', this.line(this.dataset2))
          .style('stroke', 'cyan')
          .ease(d3.easeQuadOut);


      

      

      this.lineG.append('path')
          .datum(this.dataset2)
          .attr('class', 'line')
          .attr('d', this.line)
          .style('fill', 'none')
          .style('stroke', 'SKYBLUE')
          .style('stroke-width', 2)
            .transition()
              .delay(1000)
              .duration(500)
              .attr('d', this.line(this.dataset))
              .style('stroke', 'LIGHTSEAGREEN')
              .ease(d3.easeQuadOut);

      this.lineG
            .append('g')
            .attr('class', 'line-dot-g')

     const points = this.lineG.select('.line-dot-g')
              .selectAll('circle')
              .data(this.dataset)
              .enter()
              .append('circle')
              
              points.attr('r', 4)
              .style('fill', 'SKYBLUE')
              .attr('cx', d => this.xScale(d.year))
              .attr('cy', d => this.yScale(d.value))

              points 
              .data(this.dataset2)
              .transition()
              .delay(1000)
              .duration(500)
              .style('fill', 'LIGHTSEAGREEN')
              .attr('cx', d => this.xScale(d.year))
              .attr('cy', d => this.yScale(d.value))
              .ease(d3.easeQuadOut);

          const that = this;
           points.on('mouseover', function(d, i) {
               const thisPoint = d3.select(this);

               thisPoint
                .transition()
                .duration(200)
                .attr('r', 10)
                .ease(d3.easeQuadOut)

                console.log(thisPoint.datum())

               that.showTooltip(thisPoint.datum());

            })
            .on('mouseout', function(d, i) {
              const thisPoint = d3.select(this);

              thisPoint
              .transition()
              .duration(100)
              .attr('r', 5)
              .ease(d3.easeQuadOut)

              that.hideTooltip();
            })

         this.lineG.append('defs')
                  .append('filter')
                  .attr('id', 'shadow')
                  .append('feDropShadow')
                  .attr('dx', 2)
                  .attr('dy', 5)
                  .attr('stdDeviation', 3)
                  .attr('flood-color', '#999')

        this.tooltip = this.lineG.append('g')
                .attr('class', 'tooltip')
                .style('opacity', 0)

        this.tooltip.append('rect')
                .attr('id', 'tooltip-rect')
                .attr('width', this.tooltipW)
                .attr('height', this.tooltipH)
                .attr('rx', 5)
                .attr('ry', 5)
                .style('fill', 'white')
                .style('stroke', '#eee')
                .style('filter','url(#shadow)')
         this.tooltip.append('text')
              .attr('id', 'tooltip-text')
              .style('text-anchor', 'middle')
              .style('font-size', '16px')
              .attr('font-weight', 'bolder')
              .attr('storke', 'black')
              .attr('x', this.tooltipW / 2)
              .attr('y', this.tooltipH * 3 / 4)

        this.tooltip.select('#tooltip-text')
              .append('tspan').attr('id', 'tooltip-text-value')
        this.tooltip.select('#tooltip-text')
              .append('tspan').attr('id', 'tooltip-text-year')
              
              
  }
  
  showTooltip(data) {
    this.showTootip = true;
    this.tooltip
    .select('#tooltip-text-value')
    .datum(data)
    .attr('x', d => this.xScale(d.year) - this.tooltipW - 10 < 0 ?
    this.xScale(d.year) + 10 + this.tooltipW / 2:
    this.xScale(d.year) - this.tooltipW - 10  + this.tooltipW / 2)
   .attr('y', d => this.yScale(d.value) - this.tooltipH - 10 < 0 ?
   this.yScale(d.value) + 10 + this.tooltipH * 3 / 4:
   this.yScale(d.value) - this.tooltipH - 10 + this.tooltipH * 3 / 4)
    .text(d => ` value : ${d.value}`)

    this.tooltip
    .select('#tooltip-text-year')
    .datum(data)
    .attr('x', d => this.xScale(d.year) - this.tooltipW - 10 < 0 ?
    this.xScale(d.year) + 10 + this.tooltipW / 2:
    this.xScale(d.year) - this.tooltipW - 10  + this.tooltipW / 2)
   .attr('y', d => this.yScale(d.value) - this.tooltipH - 10 < 0 ?
   this.yScale(d.value) + 10 + this.tooltipH * 2 / 4:
   this.yScale(d.value) - this.tooltipH - 10 + this.tooltipH * 2 / 4)
    .text(d => ` year : ${d.value}`)

    this.tooltip        
      .select('#tooltip-rect')
      .datum(data)
      .attr('x', d => this.xScale(d.year) - this.tooltipW - 10 < 0 ?
      this.xScale(d.year) + 10:
      this.xScale(d.year) - this.tooltipW - 10)
     .attr('y', d => this.yScale(d.value) - this.tooltipH - 10 < 0 ?
     this.yScale(d.value) + 10 :
     this.yScale(d.value) - this.tooltipH - 10)
    
     this.tooltip  
     .style('display', 'block')
     .transition()
     .delay(100)
     .duration(300)
     .style('opacity', 0.8)
    

    
  }

  hideTooltip() {
    this.showTootip = false;

    this.tooltip           
    .transition()
    .duration(300)
    .style('opacity', 0)
    
    setTimeout(() => {
      if (!this.showTootip)
      this.tooltip           
      .style('display', 'none')
    }, 300)
  }


  dataparse(d) {
    const parseTime = d3.timeParse('%Y/%m');
    const bisectDate = d3.bisector(a => a.year).left;
    d.year = parseTime(d.year);
    d.value = +d.value;
  }
}
