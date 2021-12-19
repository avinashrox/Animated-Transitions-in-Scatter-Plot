let width
let height 
let margin = { top:50, bottom: 50, right: 50, left: 60 };
let innerWidth
let innerHeight
let childbirthdata
let regiondata
let incomedata
let lifedata
let popdata
let year
let singleLine
let timer

document.addEventListener('DOMContentLoaded', function() {
    svg = d3.select('#draw1').append('svg')
    width = +svg.style('width').replace('px','');
    height = +svg.style('height').replace('px','');
    margin = { top:50, bottom: 50, right: 50, left: 60 };
    innerWidth = width - margin.left - margin.right;
    innerHeight = height - margin.top - margin.bottom;
  
    // Load both files before doing anything else
    Promise.all([d3.csv('data/countries_regions.csv'),
                 d3.csv('data/children_per_woman_total_fertility.csv'),
                 d3.csv('data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv'),
                 d3.csv('data/life_expectancy_years.csv'),
                 d3.csv('data/population_total.csv'),
                 d3.csv('data/child_mortality_0_5_year_olds_dying_per_1000_born.csv')  ])
            .then(function(values){
      
      regiondata = values[0];
      childbirthdata = values[1];
      incomedata=values[2]
      lifedata=values[3]
      popdata=values[4]
      mortaldata=values[5]
      popdata.forEach(d => {
      for(var key in d)
      {if(key=='country')
        continue;
      var val= d[key]
      multiplier = val.substr(-1).toLowerCase();
      if (multiplier == "k")
        {d[key]=parseFloat(val) * 1000;
        }
      else if (multiplier == "m")
        d[key]= parseFloat(val) * 1000000;
      else if(multiplier == "b")  
        d[key]=parseFloat(val)*1000000000;  
      }
    });
    incomedata.forEach(d => {
      for(var key in d)
      {if(key=='country')
        continue;    
      var val= d[key]
      multiplier = val.substr(-1).toLowerCase();
      if (multiplier == "k")
        {d[key]=parseFloat(val) * 1000;
        }
      else if (multiplier == "m")
        d[key]= parseFloat(val) * 1000000;
      }
    });
  
  

      drawScatterPlot();
    })
});

function getExtents(Data)
{
        var max = 0;
        var min = 10000000;
        for(var key in Data) {
          if(key == 'country') 
            continue;
          let val = +Data[key];
          if(val > max)
            max = val;
          if(val < min)
            min = val;
        }
        return min,max;
}

function toggleAnimation(arg2=0) {
 // console.log(d3.select('#toggle-button').attr('value'))
  if(arg2==1 & d3.select('#toggle-button').attr('value')=='Pause')
  {timer = setInterval(step, 500);
  }
  else if(arg2==0)
  {const currentState = d3.select('#toggle-button').attr('value');
  const updatedLabel = currentState == 'Play' ? 'Pause' : 'Play';
  d3.select('#toggle-button').attr('value', updatedLabel)
  // year = d3.select('#year-input').property('value');
  // year=+year;
  if(updatedLabel=='Pause')
  {timer = setInterval(step, 500);
}
  else{
    clearInterval(timer);
  }
}
}
function step()
{ 
  year = d3.select('#year-input').attr('value');
  year=+year+1;
  if(year>2020)
  {
    d3.select('#toggle-button').attr('value', 'Play')
    clearInterval(timer);
  }
  else
  {
  d3.select('#year-input').property('value',year)
  d3.select('#year-input').attr('value',year);
  drawScatterPlot();
}
}
function drawScatterPlot(arg=0)
{   if(arg==1)
    {clearInterval(timer);
      toggleAnimation(1);
    }
    svg.select('g').remove();
    svg.select('path').remove();
    let region = d3.select('#region-select').property('value')   
    regarray=['South Asia','Europe & Central Asia','Middle East & North Africa','Sub-Saharan Africa','Latin America & Caribbean','East Asia & Pacific','North America']
    var colorScale = d3.scaleOrdinal()
                        .domain(regarray)
                        .range(['indigo','green','violet','blue','yellow','orange','pink'])
    //console.log(region)                    
    regcolor=colorScale(region)
   // console.log(regcolor)
    //console.log(region)
    let countries = regiondata.filter( d => d['World bank region'] == region);
    //console.log(countries[20]['name'])

    arr=[]
    for (let i = 0; i < countries.length; i++) {
        arr.push(countries[i]['name'])
      } 
    //console.log(arr)  
    let xAttrib = d3.select('#column-1-select').property('value');
    let yAttrib =  document.getElementById('column-2-select').value;
    year = d3.select('#year-input').property('value');
    d3.select('#year-input').attr('value',year);
    if(year>1799 & year<2021)
{    (lifedata4 = []).length = 221; 
lifedata4.fill(0);
    //console.log(year)
    //console.log(xAttrib)
    if(xAttrib=='Babies per woman')
    {
    childbirthdata2=childbirthdata.filter(d => arr.includes(d['country']))
    //console.log(childbirthdata2)
    var min=0
    var max=0
    childbirthdata2=childbirthdata2.filter(function(d){
      return (!(d[year]===""))
    })
    for(let j=0;j<childbirthdata2.length;j++)
    {   prev_min,prev_max=getExtents(childbirthdata2[j])
        if(prev_min<min)
        {    min=prev_min
        }
        if(prev_max>max)
        {
            max=prev_max
        }
    }
    //console.log(max,min)
    
}

  else if(xAttrib=='Population')
{
popdata2=popdata.filter(d => arr.includes(d['country']))
//console.log(childbirthdata2)
var min=0
var max=0
popdata2=popdata2.filter(function(d){
  return (!(d[year]===""))
})
for(let j=0;j<popdata2.length;j++)
{   prev_min,prev_max=getExtents(popdata2[j])
    if(prev_min<min)
    {    min=prev_min
    }
    if(prev_max>max)
    {
        max=prev_max
    }
}
//console.log(max,min)

}

else if(xAttrib=='Life expectancy')
{
lifedata2=lifedata.filter(d => arr.includes(d['country']))
//console.log(childbirthdata2)
var min=0
var max=0
lifedata2=lifedata2.filter(function(d){
  return (!(d[year]===""))
})
for(let j=0;j<lifedata2.length;j++)
{   prev_min,prev_max=getExtents(lifedata2[j])
    if(prev_min<min)
    {    min=prev_min
    }
    if(prev_max>max)
    {
        max=prev_max
    }
}
//console.log(max,min)


}

else if(xAttrib=='Income per person')
{
incomedata2=incomedata.filter(d => arr.includes(d['country']))
//console.log(childbirthdata2)
var min=0
var max=0
incomedata2=incomedata2.filter(function(d){
  return (!(d[year]===""))
})
for(let j=0;j<incomedata2.length;j++)
{   prev_min,prev_max=getExtents(incomedata2[j])
    if(prev_min<min)
    {    min=prev_min
    }
    if(prev_max>max)
    {
        max=prev_max
    }
}
//console.log(max,min)
}

else if(xAttrib=='Child mortality')
{
mortaldata2=mortaldata.filter(d => arr.includes(d['country']))
//console.log(childbirthdata2)
var min=0
var max=0
mortaldata2=mortaldata2.filter(function(d){
  return (!(d[year]===""))
})
for(let j=0;j<mortaldata2.length;j++)
{   prev_min,prev_max=getExtents(mortaldata2[j])
    if(prev_min<min)
    {    min=prev_min
    }
    if(prev_max>max)
    {
        max=prev_max
    }
}
//console.log(max,min)
}
var xScale = d3.scaleLinear()
                        .domain([min,max]) // data space
                        .range([0, innerWidth]);
if(yAttrib=='Babies per woman')
{
childbirthdata2=childbirthdata.filter(d => arr.includes(d['country']))
//console.log(childbirthdata2)
var prev_max = 0;
var prev_min = 0
var min=0
var max=0
for(let j=0;j<childbirthdata2.length;j++)
{   prev_min,prev_max=getExtents(childbirthdata2[j])
    if(prev_min<min)
    {    min=prev_min
    }
    if(prev_max>max)
    {
        max=prev_max
    }
}
//console.log(max,min)

}

else if(yAttrib=='Population')
{
popdata2=popdata.filter(d => arr.includes(d['country']))
//console.log(childbirthdata2)
var min=0
var max=0
popdata2=popdata2.filter(function(d){
  return (!(d[year]===""))
})
for(let j=0;j<popdata2.length;j++)
{   prev_min,prev_max=getExtents(popdata2[j])
if(prev_min<min)
{    min=prev_min
}
if(prev_max>max)
{
    max=prev_max
}
}
//console.log(max,min)

}

else if(yAttrib=='Life expectancy')
{
lifedata2=lifedata.filter(d => arr.includes(d['country']))
//console.log(childbirthdata2)
var min=0
var max=0
lifedata2=lifedata2.filter(function(d){
  return (!(d[year]===""))
})
for(let j=0;j<lifedata2.length;j++)
{   prev_min,prev_max=getExtents(lifedata2[j])
if(prev_min<min)
{    min=prev_min
}
if(prev_max>max)
{
    max=prev_max
}
}
//console.log(max,min)


}

else if(yAttrib=='Income per person')
{
incomedata2=incomedata.filter(d => arr.includes(d['country']))
//console.log(childbirthdata2)
var min=0
var max=0
incomedata2=incomedata2.filter(function(d){
  return (!(d[year]===""))
})
for(let j=0;j<incomedata2.length;j++)
{   prev_min,prev_max=getExtents(incomedata2[j])
if(prev_min<min)
{    min=prev_min
}
if(prev_max>max)
{
    max=prev_max
}
}
//console.log(max,min)
}

else if(yAttrib=='Child mortality')
{
mortaldata2=mortaldata.filter(d => arr.includes(d['country']))
//console.log(childbirthdata2)
var min=0
var max=0
mortaldata2=mortaldata2.filter(function(d){
  return (!(d[year]===""))
})
for(let j=0;j<mortaldata2.length;j++)
{   prev_min,prev_max=getExtents(mortaldata2[j])
if(prev_min<min)
{    min=prev_min
}
if(prev_max>max)
{
    max=prev_max
}
}
//console.log(max,min)
}

var yScale = d3.scaleLinear()
                        .domain([min,max]) // data space
                        .range([innerHeight,0]);                        

                        
 var div = d3.select("body").append("div")
                        .attr("class", "tooltip-donut")
                        .style("opacity", 0);
if(xAttrib=='Life expectancy' & yAttrib=='Babies per woman')
{ 
  arr1=[]
if(lifedata2.length>childbirthdata2.length)
{for(let i=0;i<childbirthdata2.length;i++)
  {
    arr1.push(childbirthdata2[i]['country'])
  }
 lifedata3 = lifedata2.filter( d => arr1.includes(d['country']));
childbirthdata3=childbirthdata2
}
else if(lifedata2.length<childbirthdata2.length)
{
  for(let i=0;i<lifedata2.length;i++)
  {
    arr1.push(lifedata2[i]['country'])
  }
childbirthdata3 = childbirthdata3.filter( d => arr1.includes(d['country']));
lifedata3=lifedata2
}
else
{
  lifedata3=lifedata2
  childbirthdata3=childbirthdata2
}
 //const g = svg.append('g')
 //                       .attr('transform', 'translate('+margin.left+', '+margin.top+')');

 svg.selectAll('circle.circles')
    .data(lifedata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          //console.log('mousemove on '+d['country']);
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                          //console.log('mouseout on ' + d['country']);
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          //.filter(d=>d[year]>0)
                          .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
    // exit.selectAll('text')
    //     .transition()
    //     .duration(250)
    //     .style('font-size','0em');
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(lifedata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            //console.log('mousemove on '+d['country']);
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            //console.log('mouseout on ' + d['country']);
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                      //.filter(d=>d[year]>0)
                                      .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Life expectancy' & yAttrib=='Income per person')
{ 
  arr1=[]



if(lifedata2.length>incomedata2.length)
{for(let i=0;i<incomedata2.length;i++)
  {
    arr1.push(incomedata2[i]['country'])
  }
 lifedata3 = lifedata2.filter( d => arr1.includes(d['country']));
incomedata3=incomedata2
}
else if(lifedata2.length<incomedata2.length)
{
  for(let i=0;i<lifedata2.length;i++)
  {
    arr1.push(lifedata2[i]['country'])
  }
incomedata3 = incomedata2.filter( d => arr1.includes(d['country']));
lifedata3=lifedata2
}
else
{
  lifedata3=lifedata2
  incomedata3=incomedata2
}
svg.selectAll('circle.circles')
.data(lifedata3,d=>d['country'])
.join(                       
      enter =>  enter.append('circle')
                    .attr('class','circles')
                    .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)
                    .attr('r',0)
                    .style('fill', regcolor)
                    .style('stroke','black')
                    .on('mouseover',function(d,i) {
                     
                    singleLine = d3.line()
                                              .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                              .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
        
                      div2 = svg.append('path')
                                .datum(lifedata4)  
                                .attr('class','singleLine')      
                                .style('fill','none')
                                .style('stroke','black')
                                .style('stroke-width','2')
                                .style('opacity',0.2)
                                .attr('d', singleLine);
                    })
                    .on('mousemove',function(d,i) {
                        div.transition()
                              .duration(50)
                              .style("opacity", 1);
                        let num =  'Country: '+d['country']
                        div.html(num)
                              .style("left", (d3.event.pageX + 15) + "px")
                              .style("top", (d3.event.pageY ) + "px");
                      
                    })
                    .on('mouseout', function(d,i) {
                      div.transition()
                              .duration('50')
                              .style("opacity", 0);
                      
                    div2.transition()
                      .style('opacity',0);   
                    })             
    .call(enter=> enter.transition()
    .delay(250)
    .duration(250)
    .attr('r',23)),           

    update => update.call(
       update=>update
      .on('mouseover',function(d,i) {
         
        singleLine = d3.line()
                                 .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                 .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
    
         div2 = svg.append('path')
                   .datum(lifedata4)  
                   .attr('class','singleLine')      
                   .style('fill','none')
                   .style('stroke','black')
                   .style('stroke-width','2')
                   .style('opacity',0.2)
                   .attr('d', singleLine);
       })      
              .transition()
                      .delay(0)
                      .duration(250)
                      .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)                          
),
      exit=> exit.call(exit=>

exit.transition()
    .duration(250)
    .attr('r',0)
    .end()
    .then(()=>{exit.remove();})    
)

);

svg.selectAll('text.texts')
.data(lifedata3,d=>d['country'])
.join(
  enter=>enter.append('text')
              .attr('class','texts')
              .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)
              .style('text-anchor','middle')
        .style('font-size','0em')
        .style('font-weight','bold')
         .style('fill','red')
         .text(d=>
          {for(let i=0;i<regiondata.length;i++)
          {if(regiondata[i]['name']==d['country'])
            return regiondata[i]['geo']    
          }
        })
        .on('mouseover',function(d,i) {
                     
         singleLine = d3.line()
                                  .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                  .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)

          div2 = svg.append('path')
                    .datum(lifedata4)  
                    .attr('class','singleLine')      
                    .style('fill','none')
                    .style('stroke','black')
                    .style('stroke-width','2')
                    .style('opacity',0.2)
                    .attr('d', singleLine);
        })
        .on('mousemove',function(d,i) {
          div.transition()
                 .duration(50)
                 .style("opacity", 1);
          let num =  'Country: '+d['country']
          div.html(num)
                 .style("left", (d3.event.pageX + 15) + "px")
                 .style("top", (d3.event.pageY ) + "px");
  
     
      })
      .on('mouseout', function(d,i) {
        div.transition()
                 .duration('50')
                 .style("opacity", 0);
        div2.transition()
                 .style('opacity',0); 
  
      })
      .call(enter=>enter.transition()
                        .delay(250)
                        .duration(250)
                        .style('font-size','1em')),
update => update.call(
                  update=>update
                  .on('mouseover',function(d,i) {
                     
                    singleLine = d3.line()
                                             .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                             .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
                
                     div2 = svg.append('path')
                               .datum(lifedata4)  
                               .attr('class','singleLine')      
                               .style('fill','none')
                               .style('stroke','black')
                               .style('stroke-width','2')
                               .style('opacity',0.2)
                               .attr('d', singleLine);
                    })      
                          .transition()
                                  .delay(0)
                                  .duration(250)
                                  .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
exit=>exit.transition()
        .duration(250)
        .style('font-size','0em')
        .end()
    .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Life expectancy' & yAttrib=='Population')
{ 
  arr1=[]

if(lifedata2.length>popdata2.length)
{for(let i=0;i<popdata2.length;i++)
  {
    arr1.push(popdata2[i]['country'])
  }
 lifedata3 = lifedata2.filter( d => arr1.includes(d['country']));
popdata3=popdata2
}
else if(lifedata2.length<popdata2.length)
{
  for(let i=0;i<lifedata2.length;i++)
  {
    arr1.push(lifedata2[i]['country'])
  }
popdata3 = popdata2.filter( d => arr1.includes(d['country']));
lifedata3=lifedata2
}
else
{
  lifedata3=lifedata2
  popdata3=popdata2
}
 
//console.log(popdata3.length)
//console.log(lifedata3.length)
svg.selectAll('circle.circles')
    .data(lifedata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15 ) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(lifedata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Life expectancy' & yAttrib=='Child mortality')
{ 
  arr1=[]

if(lifedata2.length>mortaldata2.length)
{for(let i=0;i<mortaldata2.length;i++)
  {
    arr1.push(mortaldata2[i]['country'])
  }
 lifedata3 = lifedata2.filter( d => arr1.includes(d['country']));
mortaldata3=mortaldata2
}
else if(lifedata2.length<mortaldata2.length)
{
  for(let i=0;i<lifedata2.length;i++)
  {
    arr1.push(lifedata2[i]['country'])
  }
mortaldata3 = mortaldata2.filter( d => arr1.includes(d['country']));
lifedata3=lifedata2
}
else
{
  lifedata3=lifedata2
  mortaldata3=mortaldata2
}
 
//console.log(popdata3.length)
//console.log(lifedata3.length)
svg.selectAll('circle.circles')
    .data(lifedata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15 ) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(lifedata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Life expectancy' & yAttrib=='Life expectancy')
{ 
  arr1=[]
  lifedata3=lifedata2
svg.selectAll('circle.circles')
    .data(lifedata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                          
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(lifedata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            //console.log('mousemove on '+d['country']);
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            //console.log('mouseout on ' + d['country']);
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(lifedata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                      .attr('transform', (d,i)=>`translate(${xScale(lifedata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Population' & yAttrib=='Population')
{ 
  arr1=[]
  popdata3=popdata2
svg.selectAll('circle.circles')
    .data(popdata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                          
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(popdata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY) + "px");
                     
            //console.log('mousemove on '+d['country']);
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            //console.log('mouseout on ' + d['country']);
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                      .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Population' & yAttrib=='Life expectancy')
{ 
  arr1=[]

if(popdata2.length>lifedata2.length)
{for(let i=0;i<lifedata2.length;i++)
  {
    arr1.push(lifedata2[i]['country'])
  }
 popdata3 = popdata2.filter( d => arr1.includes(d['country']));
lifedata3=lifedata2
}
else if(popdata2.length<lifedata2.length)
{
  for(let i=0;i<popdata2.length;i++)
  {
    arr1.push(popdata2[i]['country'])
  }
lifedata3 = lifedata2.filter( d => arr1.includes(d['country']));
popdata3=popdata2
}
else
{
  lifedata3=lifedata2
  popdata3=popdata2
}
svg.selectAll('circle.circles')
    .data(lifedata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(lifedata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Population' & yAttrib=='Babies per woman')
{ 
  arr1=[]

if(popdata2.length>childbirthdata2.length)
{for(let i=0;i<childbirthdata2.length;i++)
  {
    arr1.push(childbirthdata2[i]['country'])
  }
 popdata3 = popdata2.filter( d => arr1.includes(d['country']));
childbirthdata3=childbirthdata2
}
else if(popdata2.length<childbirthdata2.length)
{
  for(let i=0;i<popdata2.length;i++)
  {
    arr1.push(popdata2[i]['country'])
  }
childbirthdata3 = childbirthdata2.filter( d => arr1.includes(d['country']));
popdata3=popdata2
}
else
{
  childbirthdata3=childbirthdata2
  popdata3=popdata2
}
svg.selectAll('circle.circles')
    .data(popdata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(popdata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Population' & yAttrib=='Income per person')
{ 
  arr1=[]

if(popdata2.length>incomedata2.length)
{for(let i=0;i<incomedata2.length;i++)
  {
    arr1.push(incomedata2[i]['country'])
  }
 popdata3 = popdata2.filter( d => arr1.includes(d['country']));
 incomedata3=incomedata2
}
else if(popdata2.length<incomedata2.length)
{
  for(let i=0;i<popdata2.length;i++)
  {
    arr1.push(popdata2[i]['country'])
  }
incomedata3 = incomedata2.filter( d => arr1.includes(d['country']));
popdata3=popdata2
}
else
{
  incomedata3=incomedata2
  popdata3=popdata2
}
svg.selectAll('circle.circles')
    .data(popdata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(popdata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Population' & yAttrib=='Child mortality')
{ 
  arr1=[]

if(popdata2.length>mortaldata2.length)
{for(let i=0;i<mortaldata2.length;i++)
  {
    arr1.push(mortaldata2[i]['country'])
  }
 popdata3 = popdata2.filter( d => arr1.includes(d['country']));
 mortaldata3=mortaldata2
}
else if(popdata2.length<mortaldata2.length)
{
  for(let i=0;i<popdata2.length;i++)
  {
    arr1.push(popdata2[i]['country'])
  }
mortaldata3 = mortaldata2.filter( d => arr1.includes(d['country']));
popdata3=popdata2
}
else
{
  mortaldata3=mortaldata2
  popdata3=popdata2
}
svg.selectAll('circle.circles')
    .data(popdata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(popdata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(popdata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(popdata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Babies per woman' & yAttrib=='Population')
{ 
  arr1=[]

if(childbirthdata2.length>popdata2.length)
{for(let i=0;i<popdata2.length;i++)
  {
    arr1.push(popdata2[i]['country'])
  }
 childbirthdata3 = childbirthdata2.filter( d => arr1.includes(d['country']));
 popdata3=popdata2
}
else if(childbirthdata2.length<popdata2.length)
{
  for(let i=0;i<childbirthdata2.length;i++)
  {
    arr1.push(childbirthdata2[i]['country'])
  }
popdata3 = popdata2.filter( d => arr1.includes(d['country']));
childbirthdata3=childbirthdata2
}
else
{
  childbirthdata3=childbirthdata2
  popdata3=popdata2
}
svg.selectAll('circle.circles')
    .data(popdata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(popdata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Babies per woman' & yAttrib=='Life expectancy')
{ 
  arr1=[]

if(childbirthdata2.length>lifedata2.length)
{for(let i=0;i<lifedata2.length;i++)
  {
    arr1.push(lifedata2[i]['country'])
  }
 childbirthdata3 = childbirthdata2.filter( d => arr1.includes(d['country']));
 lifedata3=lifedata2
}
else if(childbirthdata2.length<lifedata2.length)
{
  for(let i=0;i<childbirthdata2.length;i++)
  {
    arr1.push(childbirthdata2[i]['country'])
  }
lifedata3 = lifedata2.filter( d => arr1.includes(d['country']));
childbirthdata3=childbirthdata2
}
else
{
  childbirthdata3=childbirthdata2
  lifedata3=lifedata2
}
svg.selectAll('circle.circles')
    .data(childbirthdata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(childbirthdata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Babies per woman' & yAttrib=='Babies per woman')
{ 
  arr1=[]

childbirthdata3=childbirthdata2
svg.selectAll('circle.circles')
    .data(childbirthdata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(childbirthdata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Babies per woman' & yAttrib=='Income per person')
{ 
  arr1=[]

if(childbirthdata2.length>incomedata2.length)
{for(let i=0;i<incomedata2.length;i++)
  {
    arr1.push(incomedata2[i]['country'])
  }
 childbirthdata3 = childbirthdata2.filter( d => arr1.includes(d['country']));
 incomedata3=incomedata2
}
else if(childbirthdata2.length<incomedata2.length)
{
  for(let i=0;i<childbirthdata2.length;i++)
  {
    arr1.push(childbirthdata2[i]['country'])
  }
incomedata3 = incomedata2.filter( d => arr1.includes(d['country']));
childbirthdata3=childbirthdata2
}
else
{
  childbirthdata3=childbirthdata2
  incomedata3=incomedata2
}
svg.selectAll('circle.circles')
    .data(childbirthdata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(childbirthdata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Babies per woman' & yAttrib=='Child mortality')
{ 
  arr1=[]

if(childbirthdata2.length>mortaldata2.length)
{for(let i=0;i<mortaldata2.length;i++)
  {
    arr1.push(mortaldata2[i]['country'])
  }
 childbirthdata3 = childbirthdata2.filter( d => arr1.includes(d['country']));
 mortaldata3=mortaldata2
}
else if(childbirthdata2.length<mortaldata2.length)
{
  for(let i=0;i<childbirthdata2.length;i++)
  {
    arr1.push(childbirthdata2[i]['country'])
  }
mortaldata3 = mortaldata2.filter( d => arr1.includes(d['country']));
childbirthdata3=childbirthdata2
}
else
{
  childbirthdata3=childbirthdata2
  mortaldata3=mortaldata2
}
svg.selectAll('circle.circles')
    .data(childbirthdata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(childbirthdata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(childbirthdata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(childbirthdata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Income per person' & yAttrib=='Population')
{ 
  arr1=[]

if(incomedata2.length>popdata2.length)
{for(let i=0;i<popdata2.length;i++)
  {
    arr1.push(popdata2[i]['country'])
  }
 incomedata3 = incomedata2.filter( d => arr1.includes(d['country']));
 popdata3=popdata2
}
else if(incomedata2.length<popdata2.length)
{
  for(let i=0;i<incomedata2.length;i++)
  {
    arr1.push(incomedata2[i]['country'])
  }
popdata3 = popdata2.filter( d => arr1.includes(d['country']));
incomedata3=incomedata2
}
else
{
  incomedata3=incomedata2
  popdata3=popdata2
}
svg.selectAll('circle.circles')
    .data(incomedata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(incomedata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Income per person' & yAttrib=='Life expectancy')
{ 
  arr1=[]

if(incomedata2.length>lifedata2.length)
{for(let i=0;i<lifedata2.length;i++)
  {
    arr1.push(lifedata2[i]['country'])
  }
 incomedata3 = incomedata2.filter( d => arr1.includes(d['country']));
 lifedata3=lifedata2
}
else if(incomedata2.length<lifedata2.length)
{
  for(let i=0;i<incomedata2.length;i++)
  {
    arr1.push(incomedata2[i]['country'])
  }
lifedata3 = lifedata2.filter( d => arr1.includes(d['country']));
incomedata3=incomedata2
}
else
{
  incomedata3=incomedata2
  lifedata3=lifedata2
}
svg.selectAll('circle.circles')
    .data(incomedata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(incomedata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Income per person' & yAttrib=='Babies per woman')
{ 
  arr1=[]

if(incomedata2.length>childbirthdata2.length)
{for(let i=0;i<childbirthdata2.length;i++)
  {
    arr1.push(childbirthdata2[i]['country'])
  }
 incomedata3 = incomedata2.filter( d => arr1.includes(d['country']));
 childbirthdata3=childbirthdata2
}
else if(incomedata2.length<childbirthdata2.length)
{
  for(let i=0;i<incomedata2.length;i++)
  {
    arr1.push(incomedata2[i]['country'])
  }
childbirthdata3 = childbirthdata2.filter( d => arr1.includes(d['country']));
incomedata3=incomedata2
}
else
{
  incomedata3=incomedata2
  childbirthdata3=childbirthdata2
}
svg.selectAll('circle.circles')
    .data(incomedata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(childbirthdata[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(incomedata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Income per person' & yAttrib=='Income per person')
{ 
  arr1=[]

incomedata3=incomedata2
svg.selectAll('circle.circles')
    .data(incomedata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(incomedata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Income per person' & yAttrib=='Child mortality')
{ 
  arr1=[]

if(incomedata2.length>mortaldata2.length)
{for(let i=0;i<mortaldata2.length;i++)
  {
    arr1.push(mortaldata2[i]['country'])
  }
 incomedata3 = incomedata2.filter( d => arr1.includes(d['country']));
 mortaldata3=mortaldata2
}
else if(incomedata2.length<mortaldata2.length)
{
  for(let i=0;i<incomedata2.length;i++)
  {
    arr1.push(incomedata2[i]['country'])
  }
mortaldata3 = mortaldata2.filter( d => arr1.includes(d['country']));
incomedata3=incomedata2
}
else
{
  incomedata3=incomedata2
  mortaldata3=mortaldata2
}
svg.selectAll('circle.circles')
    .data(incomedata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(incomedata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(incomedata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(incomedata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Child mortality' & yAttrib=='Population')
{ 
  arr1=[]

if(mortaldata2.length>popdata2.length)
{for(let i=0;i<popdata2.length;i++)
  {
    arr1.push(popdata2[i]['country'])
  }
 mortaldata3 = mortaldata2.filter( d => arr1.includes(d['country']));
 popdata3=popdata2
}
else if(mortaldata2.length<popdata2.length)
{
  for(let i=0;i<mortaldata2.length;i++)
  {
    arr1.push(mortaldata2[i]['country'])
  }
popdata3 = popdata2.filter( d => arr1.includes(d['country']));
mortaldata3=mortaldata2
}
else
{
  mortaldata3=mortaldata2
  popdata3=popdata2
}
svg.selectAll('circle.circles')
    .data(mortaldata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(mortaldata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(popdata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Child mortality' & yAttrib=='Babies per woman')
{ 
  arr1=[]

if(mortaldata2.length>childbirthdata2.length)
{for(let i=0;i<childbirthdata2.length;i++)
  {
    arr1.push(childbirthdata2[i]['country'])
  }
 mortaldata3 = mortaldata2.filter( d => arr1.includes(d['country']));
 childbirthdata3=childbirthdata2
}
else if(mortaldata2.length<childbirthdata2.length)
{
  for(let i=0;i<mortaldata2.length;i++)
  {
    arr1.push(mortaldata2[i]['country'])
  }
childbirthdata3 = childbirthdata2.filter( d => arr1.includes(d['country']));
mortaldata3=mortaldata2
}
else
{
  mortaldata3=mortaldata2
  childbirthdata3=childbirthdata2
}
svg.selectAll('circle.circles')
    .data(mortaldata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(mortaldata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(popdata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(childbirthdata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(childbirthdata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Child mortality' & yAttrib=='Life expectancy')
{ 
  arr1=[]

if(mortaldata2.length>lifedata2.length)
{for(let i=0;i<lifedata2.length;i++)
  {
    arr1.push(lifedata2[i]['country'])
  }
 mortaldata3 = mortaldata2.filter( d => arr1.includes(d['country']));
 lifedata3=lifedata2
}
else if(mortaldata2.length<lifedata2.length)
{
  for(let i=0;i<mortaldata2.length;i++)
  {
    arr1.push(mortaldata2[i]['country'])
  }
lifedata3 = lifedata2.filter( d => arr1.includes(d['country']));
mortaldata3=mortaldata2
}
else
{
  mortaldata3=mortaldata2
  lifedata3=lifedata2
}
svg.selectAll('circle.circles')
    .data(mortaldata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(mortaldata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(lifedata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(lifedata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Child mortality' & yAttrib=='Income per person')
{ 
  arr1=[]

if(mortaldata2.length>incomedata2.length)
{for(let i=0;i<incomedata2.length;i++)
  {
    arr1.push(incomedata2[i]['country'])
  }
 mortaldata3 = mortaldata2.filter( d => arr1.includes(d['country']));
 incomedata3=incomedata2
}
else if(mortaldata2.length<incomedata2.length)
{
  for(let i=0;i<mortaldata2.length;i++)
  {
    arr1.push(mortaldata2[i]['country'])
  }
incomedata3 = incomedata2.filter( d => arr1.includes(d['country']));
mortaldata3=mortaldata2
}
else
{
  mortaldata3=mortaldata2
  incomedata3=incomedata2
}
svg.selectAll('circle.circles')
    .data(mortaldata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(mortaldata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(incomedata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(incomedata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}

else if(xAttrib=='Child mortality' & yAttrib=='Child mortality')
{ 
  arr1=[]
mortaldata3=mortaldata2
svg.selectAll('circle.circles')
    .data(mortaldata3,d=>d['country'])
    .join(                       
          enter =>  enter.append('circle')
                        .attr('class','circles')
                        .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)
                        .attr('r',0)
                        .style('fill', regcolor)
                        .style('stroke','black')
                        .on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                  .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                                  .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
            
                          div2 = svg.append('path')
                                    .datum(lifedata4)  
                                    .attr('class','singleLine')      
                                    .style('fill','none')
                                    .style('stroke','black')
                                    .style('stroke-width','2')
                                    .style('opacity',0.2)
                                    .attr('d', singleLine);
                        })
                        .on('mousemove',function(d,i) {
                            div.transition()
                                  .duration(50)
                                  .style("opacity", 1);
                            let num =  'Country: '+d['country']
                            div.html(num)
                                  .style("left", (d3.event.pageX + 15) + "px")
                                  .style("top", (d3.event.pageY ) + "px");
                          
                        })
                        .on('mouseout', function(d,i) {
                          div.transition()
                                  .duration('50')
                                  .style("opacity", 0);
                
                        div2.transition()
                          .style('opacity',0);   
                        })             
        .call(enter=> enter.transition()
        .delay(250)
        .duration(250)
        .attr('r',23)),           

        update => update.call(
          update=>update.on('mouseover',function(d,i) {
             
            singleLine = d3.line()
                                     .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                     .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
        
             div2 = svg.append('path')
                       .datum(lifedata4)  
                       .attr('class','singleLine')      
                       .style('fill','none')
                       .style('stroke','black')
                       .style('stroke-width','2')
                       .style('opacity',0.2)
                       .attr('d', singleLine);
           })      
                  .transition()
                          .delay(0)
                          .duration(250)
                          .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)                          
),
          exit=> exit.call(exit=>
   
    exit.transition()
        .duration(250)
        .attr('r',0)
        .end()
        .then(()=>{exit.remove();})    
  )

);

svg.selectAll('text.texts')
    .data(mortaldata3,d=>d['country'])
    .join(
      enter=>enter.append('text')
                  .attr('class','texts')
                  .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)
                  .style('text-anchor','middle')
            .style('font-size','0em')
            .style('font-weight','bold')
             .style('fill','red')
             .text(d=>
              {for(let i=0;i<regiondata.length;i++)
              {if(regiondata[i]['name']==d['country'])
                return regiondata[i]['geo']    
              }
            })
            .on('mouseover',function(d,i) {
                         
             singleLine = d3.line()
                                      .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                      .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)

              div2 = svg.append('path')
                        .datum(lifedata4)  
                        .attr('class','singleLine')      
                        .style('fill','none')
                        .style('stroke','black')
                        .style('stroke-width','2')
                        .style('opacity',0.2)
                        .attr('d', singleLine);
            })
            .on('mousemove',function(d,i) {
              div.transition()
                     .duration(50)
                     .style("opacity", 1);
              let num =  'Country: '+d['country']
              div.html(num)
                     .style("left", (d3.event.pageX + 15) + "px")
                     .style("top", (d3.event.pageY ) + "px");
                     
            
          })
          .on('mouseout', function(d,i) {
            div.transition()
                     .duration('50')
                     .style("opacity", 0);
            div2.transition()
                     .style('opacity',0); 
            
          })
          .call(enter=>enter.transition()
                            .delay(250)
                            .duration(250)
                            .style('font-size','1em')),
update => update.call(
                      update=>update.on('mouseover',function(d,i) {
                         
                        singleLine = d3.line()
                                                 .x((d,j) => xScale(mortaldata3[i][+j+1800])+margin.left)
                                                 .y((d,j) => yScale(mortaldata3[i][+j+1800])+margin.top)
                    
                         div2 = svg.append('path')
                                   .datum(lifedata4)  
                                   .attr('class','singleLine')      
                                   .style('fill','none')
                                   .style('stroke','black')
                                   .style('stroke-width','2')
                                   .style('opacity',0.2)
                                   .attr('d', singleLine);
                       })      
                              .transition()
                                      .delay(0)
                                      .duration(250)
                                   .attr('transform', (d,i)=>`translate(${xScale(mortaldata3[i][year])+margin.left},${yScale(mortaldata3[i][year])+margin.top})`)                          
),
exit=>exit.call(
  exit=>exit.transition()
            .duration(250)
            .style('font-size','0em')
            .end()
        .then(()=>{exit.remove();})  )
);
}


var yAxis = d3.axisLeft(yScale);
var g = svg.append('g')
                        .attr('transform', 'translate('+margin.left+', '+margin.top+')');
g.append('g').call(yAxis
              .tickFormat(function (d) {
                if ((d / 1000) >= 1 & (d/1000000)<1) {
                  d = d / 1000 + "K";
                }
                else if((d/1000000)>=1 & (d/1000000000)<1)
                {
                  d=d/1000000 + "M";
                }
                else if((d/1000000000)>=1)
                {
                  d= d/1000000000 + "B"
                }
                return d;
              }));
var xAxis = d3.axisBottom(xScale);
g.append('g')
.attr('transform',`translate(0,${innerHeight})`)
.call(xAxis
.tickFormat(function (d) {
  if ((d / 1000) >= 1 & (d/1000000)<1) {
    d = d / 1000 + "K";
  }
  else if((d/1000000)>=1 & (d/1000000000)<1)
  {
    d=d/1000000 + "M";
  }
  else if((d/1000000000)>=1)
  {
    d= d/1000000000 + "B"
  }
  return d;
}))

g.append('text')
            .attr('x',innerWidth/2)
            .attr('y',innerHeight+40)
            .attr('text-anchor','middle')
            .text(xAttrib); 
g.append('text')
            .attr('transform','rotate(-90)')
            .attr('y','-45px')
            .attr('x',-innerHeight/2)
            .attr('text-anchor','middle')
            .text(yAttrib) 
g.append('text')
            .attr('x',innerWidth/2)
            .attr('y','-25px')
            .style('text-anchor','middle')
            .style('fill','red')
            .text('Year : '+year)
//console.log( d3.select('#year-input').attr('value'))
}
else{
  svg.selectAll('circle.circles').remove();
  svg.selectAll('text.texts').remove();
}           
}