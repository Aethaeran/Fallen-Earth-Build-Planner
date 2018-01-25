//-----------------------------------------------------------------------------   
function Gauge(id, min, value, max)
{
  this.id      = id;
  this.minimum = min;
  this.value   = value;
  this.maximum = max;
}
//-----------------------------------------------------------------------------   
Gauge.prototype.setValue = function (value, draw) 
{ 
  this.value   = value;
  if (this.value > this.maximum)
  {
    this.value = this.maximum;
  } 
  if (this.value < this.minimum)
  {
    this.value = this.minimum;
  } 
  
  if (draw)
  {
    this.redraw();
  } 
};
//-----------------------------------------------------------------------------   
Gauge.prototype.setAll = function (min, max, value, draw) 
{ 
  this.minimum = min;
  this.value   = value;
  this.maximum = max;
  
  if (draw === true)
  {
    this.redraw();
  } 
};
//-----------------------------------------------------------------------------   
Gauge.prototype.setMinimum = function (value) { this.minimum = value; this.redraw(); };
//-----------------------------------------------------------------------------   
Gauge.prototype.setMaximum = function (value) { this.maximum = value; this.redraw(); };
//-----------------------------------------------------------------------------   
Gauge.prototype.setMax = function () 
{ 
  this.setValue(parseInt(this.maximum, 10), true); 
  st_stats[this.id] = parseInt(this.value, 10);
  setStats();  
};
Gauge.prototype.setMin = function () 
{ 
  this.setValue(parseInt(this.minimum, 10), true); 
  st_stats[this.id] = parseInt(this.value, 10);
  setStats();  
};
//-----------------------------------------------------------------------------   
Gauge.prototype.adjustValue = function (v) 
{ 
  this.setValue(parseInt(this.value, 10) + v, true); 
  st_stats[this.id] = parseInt(this.value, 10);
  setStats();
};
//-----------------------------------------------------------------------------   
Gauge.prototype.setX = function (x)
{
  var full_width = parseInt(document.getElementById("bar" + this.id).style.width, 10);
  var v = Math.round(((x / full_width) * (this.maximum - this.minimum)) + this.minimum);
  
  this.setValue(v, true);

  st_stats[this.id] = v;
  setStats();
};
//-----------------------------------------------------------------------------   
Gauge.prototype.redraw = function ( ) 
{ 
  var full_width = parseInt(document.getElementById("bar" + this.id).style.width, 10);
  var x = (full_width / (this.maximum - this.minimum)) * (this.value - this.minimum); 

  document.getElementById("min" + this.id).innerHTML = parseInt(this.minimum, 10);
  document.getElementById("max" + this.id).innerHTML = parseInt(this.maximum, 10);
  document.getElementById("value" + this.id).innerHTML = parseInt(this.value, 10);
  document.getElementById("gauge" + this.id).style.width = x + "px";
};
//-----------------------------------------------------------------------------   
function clickit(subEvent, i)
{
  var mainEvent = subEvent ? subEvent : window.event;
  var x = mainEvent.clientX - document.getElementById("bar" + i).offsetLeft - document.getElementById("main" + i).offsetLeft;

  if ((i === CRAFT) || (i === ALPHA))
  {
    return;
  } // else not crafting or alpha
  
  window["g" + i].setX(x-11);
}
//-----------------------------------------------------------------------------   
function lower(i)  { window["g" + i].adjustValue(-1); }
//-----------------------------------------------------------------------------   
function raise(i)  { window["g" + i].adjustValue(+1); }
//-----------------------------------------------------------------------------   
function setmax(i) { window["g" + i].setMax(); }
function setmin(i) { window["g" + i].setMin(); }
//-----------------------------------------------------------------------------   
