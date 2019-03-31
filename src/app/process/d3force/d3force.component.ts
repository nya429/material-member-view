import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3force',
  templateUrl: './d3force.component.html',
  styleUrls: ['./d3force.component.css']
})
export class D3forceComponent implements OnInit {
  @ViewChild('force') private chartContainer: ElementRef;
  private nodes: any;
  private links: any;
  private simulation: any;
  private canvas: any;
  private context: any;
  private width: any;
  private height: any;
  constructor() { }

  
  ngOnInit() {

    this.canvas = this.chartContainer.nativeElement;
    this.context = this.canvas.getContext("2d");
    this.width = this.canvas.width;
    this.height = this.canvas.height;



    this.nodes = d3.range(1000).map(i =>  {return {index: i}});
    this.links =  d3.range(this.nodes.length - 1).map(i => { return {
        source: Math.floor(Math.sqrt(i)),
        target: i + 1
      };
    });
    console.log('hi', this.chartContainer.nativeElement)



    this.simulation = d3.forceSimulation(this.nodes)
    .force("charge", d3.forceManyBody())
    .force("link", d3.forceLink(this.links).distance(20).strength(1))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .on("tick", this.ticked());

    console.log(this.chartContainer.nativeElement)


    
    this.canvas
    .call(d3.drag()
        .container(this.canvas)
        .subject(this.dragsubject())
        .on("start", this.dragstarted())
        .on("drag", this.dragged())
        .on("end", this.dragended()));
  }

  ticked() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.save();
    this.context.translate(this.width / 2, this.height / 2);
  
    this.context.beginPath();
    this.links.forEach(d => this.drawLink(d));
    this.context.strokeStyle = "#aaa";
    this.context.stroke();
  
    this.context.beginPath();
    this.nodes.forEach(d => this.drawNode(d));
    this.context.fill();
    this.context.strokeStyle = "#fff";
    this.context.stroke();
  
    this.context.restore();
  }

  dragsubject() {
    return this.simulation.find(d3.event.x - this.width / 2, d3.event.y - this.height / 2);
  }
  
  dragstarted() {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  }
  
  dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }
  
  dragended() {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }
  
  drawLink(d) {
    this.context.moveTo(d.source.x, d.source.y);
    this.context.lineTo(d.target.x, d.target.y);
  }
  
 drawNode(d) {
  this.context.moveTo(d.x + 3, d.y);
  this.context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
  }

}
