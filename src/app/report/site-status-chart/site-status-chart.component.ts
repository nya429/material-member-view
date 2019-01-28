import { Subscription } from 'rxjs';
import { ReportService } from './../report.service';
import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import { windowCount } from 'rxjs/operators';


@Component({
  selector: 'app-site-status-chart',
  templateUrl: './site-status-chart.component.html',
  styleUrls: ['./site-status-chart.component.css']
})
export class SiteStatusChartComponent implements OnInit, AfterViewInit, OnDestroy  {
    @ViewChild('pieChart') private chartContainer: ElementRef;
    private dataset;
  
    element;
    svg: any;
    piedata: any;
    pie: any;
    centerText: any;
    arc = d3.arc();
  
    changeTimer;
    score = 0

    private width: number;
    private height: number;
    private circleWidth = 30;
    private innerRadius;
    private outerRadius;

    statusChangeSubscription: Subscription;

  
    constructor(private statusService: ReportService) { }
  
    ngOnInit() {
      this.element = this.chartContainer.nativeElement;
      
      this.createBase();
      this.scaleSize();
      setTimeout(() => {
        this.changeTimer = setInterval(() => {
          this.change();
        }, 3000);
      }, 3000);



      this.statusChangeSubscription = this.statusService.statusChartChanged.subscribe(counts => {
        
        if(!this.dataset) {
          this.dataset = counts;
          this.createChart();
          this.changeScore();
        } else {
          this.onStatusChanged(counts);
        }
      });

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
  
      // const color = d3.scaleOrdinal().range(['#FF511E','#1E90FF']);
      const color = ['#FF511E','#1E90FF'];

      const g = this.svg.append('g');
      g.attr('transform', 'translate(' + (this.width / 2) + ',' + (this.height / 2) + ')');
  
      g.selectAll('g').data(this.piedata).enter().append('g').attr('class', 'arc-g');
      
      this.svg.selectAll('.arc-g').data(this.piedata).append('path')
        .style('fill', (d,i) => color[i])
        .attr('opacity', .7)
        .attr('transform', 'rotate(-90, 0, 0)')
        .attr('going', true)
        .style('cursor', 'pointer')
        .transition()
        .ease(d3.easeLinear)
        .delay((d, i) =>  200 + i * 50)
        .duration(800)
        .attrTween('d', (d, i) => this.arcTween(d, i, this))
        .attr('transform', 'rotate(0, 0, 0)');
      
        const that = this;
        this.svg.selectAll('.arc-g')
          .on('mouseover', function(d, i) {
            const thisArc = d3.select(this)
         
            if(thisArc.attr('going') === "true") {
              return;
            }
  
            thisArc.select('path')
              .transition()
              .duration(100)
              .attr('opacity', 1);
          })
          .on('mouseout', function(d, i) {
            const thisArc = d3.select(this);

            if(thisArc.attr('going') === "true") {
              return;
            }

            thisArc.select('path')
               .transition()
               .duration(100)
              .attr('opacity', .7);

          })
          .on('click', function(d, i) {
            const thisArc = d3.select(this)
         
            if(thisArc.attr('going') === "true") {
              return;
            }
            
            that.onArcClick(thisArc.select('path').datum());

          });

          setTimeout(() => {
            this.svg.selectAll('.arc-g')
              .attr('going', false)
          }, 805);
  
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
        .text(d => 'Passed');

      
    }

    changeScore() {
      let prevScore = this.score;
      const newScore =  Math.floor(this.dataset[1] / (this.dataset[0] + this.dataset[1]) * 100) 
      this.score = newScore;

      const step = (newScore - prevScore) / 40;

      const isGreater = newScore >= prevScore ? true: false;
      let scoreTimer = setInterval(() => {
        prevScore = prevScore + step;
   
        this.centerText.select('#text-dynamic')
         .text(d => `${Math.floor(prevScore)}%`);

        if((isGreater && (prevScore >= newScore)) || (!isGreater && (prevScore <= newScore))) {
          this.centerText.select('#text-dynamic')
          .text(d => `${newScore}%`);
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
      // const color = d3.scaleOrdinal().range(['#FF511E','#1E90FF']);
      const color = ['#FF511E','#1E90FF'];



      this.dataset = [failNum, succNum];
      this.piedata = this.pie(this.dataset);
  
      this.svg.selectAll('.arc-g') 
      .data(this.piedata)


      this.svg.selectAll('path') 
         .data(this.piedata)
        .style('fill', (d,i) => color[i])
        .attr('opacity', .7)
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
        
        this.changeScore();

                /*-- status change ----*/

                this.svg.selectAll('.arc-g')
                .attr('going', true);
        
                setTimeout(() => {
                  this.svg.selectAll('.arc-g')
                    .attr('going', false)
                }, 805);

    }

    onStatusChanged(count) {
      const oldPiedata = this.piedata;
  
      const failNum = count[0];
      const succNum = count[1];
      const color = ['#FF511E','#1E90FF'];
      
      this.dataset = [failNum, succNum];
      this.piedata = this.pie(this.dataset);
  
      this.svg.selectAll('path') 
         .data(this.piedata)
         .style('fill', (d,i) => color[i])
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
        
        this.changeScore();


    }

      onArcClick(d) {

        console.log(d);
        window.confirm(`value: ${d.value}, startAngle: ${d.startAngle}, endAngle: ${d.endAngle}`);
      }
  
  }
  