import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-site-status-chart',
  templateUrl: './site-status-chart.component.html',
  styleUrls: ['./site-status-chart.component.css']
})
export class SiteStatusChartComponent implements OnInit, AfterViewInit, OnDestroy  {
    @ViewChild('pieChart') private chartContainer: ElementRef;
    private dataset = [50, 0];
  
    element;
    svg: any;
    piedata: any;
    pie: any;
    centerText: any;
    arc = d3.arc();
  
    changeTimer;
  
    private width: number;
    private height: number;
    private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
    private circleWidth = 30;
    private innerRadius;
    private outerRadius;
    private xScale: any;
    private yScale: any;
    private colors: any;
    private xAxis: any;
    private yAxis: any;
  
    constructor() { }
  
    ngOnInit() {
      this.element = this.chartContainer.nativeElement;
  
      this.createBase();
      this.scaleSize();
      this.createChart();
      this.increaseScore();
      setTimeout(() => {
        this.changeTimer = setInterval(() => {
          this.change();
        }, 5000);
      }, 5000);
    }
  
    ngAfterViewInit() {
    }

    ngOnDestroy() {
      clearInterval(this.changeTimer);
    }
  
    createBase() {
      if (this.element.parentNode.parentNode.getBoundingClientRect().height === 300) {
        this.height = 300;
        this.circleWidth = 50;
      }
       /* ----------create svg------------*/
      this.svg = d3.select(this.element).append('svg');
      this.svg.attr('class', 'chartBase')
                .attr('width', this.element.offsetWidth)
                .attr('height', this.height);
    }
  
    createChart() {
       /* ----------create piedata------------*/
      this.pie = d3.pie().sort(null);
      this.piedata = this.pie(this.dataset);
       /* ----------create arc generator------------*/
      this.arc.innerRadius(this.innerRadius)
              .outerRadius(this.outerRadius)
              .padAngle(.03)
              .cornerRadius(5);
  
      const color = d3.scaleOrdinal().range(['#FF511E','#1E90FF']);
  
      const g = this.svg.append('g');
      g.attr('transform', 'translate(' + (this.width / 2) + ',' + (this.height / 2) + ')');
  
      g.selectAll('g').data(this.piedata).enter().append('g').attr('class', 'arc-g');
  
      this.svg.selectAll('.arc-g').data(this.piedata).append('path')
        .style('fill', d => color(d.data))
        .attr('transform', 'rotate(-90, 0, 0)')
        .transition()
        .ease(d3.easeLinear)
        .delay((d, i) =>  200 + i * 50)
        .duration(800)
        .attrTween('d', (d, i) => this.arcTween(d, i, this))
        .attr('transform', 'rotate(0, 0, 0)');
  
      /* ----------append text------------*/
      g.selectAll('.arc-g')
        .append('text')
        .attr('class', 'arc-text')
        .attr('transform', d => 'translate(' + this.arc.centroid(d) + ')')
        .attr('text-anchor', 'middle')
        .attr('fill', '#FFFFFF')
        .attr('font-weight', 'bolder')
        .style('font-size', '20px')
        .attr('y', d => 4)
        .text(d => d.data);
  
      /* ----------append  middle text------------*/
      this.centerText = g.append('text')
        .attr('class', 'arc-text-center')
        .style('text-anchor', 'middle');
      
      this.centerText.append('tspan')
        .attr('id', 'text-dynamic')  
        .attr('font-weight', 'bolder')
        .style('font-size', '60px')
        .attr('fill', '#31708f')
        .attr('y', d => 10 )
        .text(d => '0%');
      
      this.centerText.append('tspan')
        .attr('id', 'text-fixed')
        .attr('fill', '#31708f')
        .attr('font-weight', 'bolder')
        .style('font-size', '20px')
        .attr('y', d => 50 )
        .attr('x', d => 0 )
        .text(d => 'Finished');
    }

    increaseScore() {
      let score = 0;
      const limit =  Math.floor(this.dataset[1] / (this.dataset[0] + this.dataset[1]) * 100) 
      const step = limit / 40;
     
      let scoreTimer = setInterval(() => {
        score = score + step;
   
        this.centerText.select('#text-dynamic')
         .text(d => `${Math.floor(score)}%`);

        if(score >= limit) {
          clearInterval(scoreTimer);
        }
      }, 20);
    }
  
    scaleSize() {
      this.width = this.element.offsetWidth;
      this.height = this.element.offsetHeight;
  
      this.svg.attr('height', this.element.offsetHeight);
      // the differ between element.offsetHeight and svg.height
      this.outerRadius = d3.min([this.element.offsetWidth, this.element.offsetHeight]) / 2 - 5;
  
      this.width = this.element.offsetWidth;
      this.innerRadius = this.outerRadius - this.circleWidth;
    }
  
    arcTween(d, i, that) {
        return (t) => {
        const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
        return that.arc(interpolate(t));
      };
    }

    arcTween2(d, i, oldD, that) {
      return (t) => {
      const interpolate = d3.interpolate(oldD, d);
      return that.arc(interpolate(t));
    };
    }

    arcTweenText(d, oldD, that) {
        return (t) => {
          const interpolate = d3.interpolate(oldD, d);
          return 'translate(' + that.arc.centroid((interpolate(t))) + ')';
        }
    }

    change() {
      const oldPiedata = this.piedata;

      const failNum = Math.floor(Math.random() * 50);
      const succNum = 50 - failNum;
      const color = d3.scaleOrdinal().range(['#FF511E','#1E90FF']);
      
      this.dataset = [failNum, succNum];
      this.piedata = this.pie(this.dataset);
  
      this.svg.selectAll('path') 
         .data(this.piedata)
        .style('fill', d => color(d.data))
        .transition()
        .ease(d3.easeLinear)
        .duration(800)
        .attrTween('d', (d, i) => this.arcTween2(d, i, oldPiedata[i], this));

        /* ----------append text------------*/
        this.svg.selectAll('.arc-text')
        .data(this.piedata)
        .transition()
        .ease(d3.easeLinear)
        .duration(800)
        .attrTween('transform', (d, i) => this.arcTweenText(d, oldPiedata[i], this))
        .text(d => d.data);
        
        this.centerText.select('#text-dynamic')
          .text(d => `0%`);

        this.increaseScore();

    }
  
  }
  