//-----------------------------------------------------------------------------   
function close_all_sub_windows()  
{ 
  close_sub_window('summarybox');
  close_sub_window('aboutbox');
  close_sub_window('startertownsbox');
  close_sub_window('factionwheelbox');
  close_sub_window('townlevelsbox');
  close_sub_window('banklocationsbox');
  close_sub_window('fasttravelbox');
  close_sub_window('transportbox');
  close_sub_window('creationguidebox');
  close_sub_window('predefinedbuildsbox');
  close_sub_window('garagemapbox');
  close_sub_window('capstonesbox');
  close_sub_window('craftingbox');
  close_sub_window('bonusapbox');
  close_sub_window('fansitebox');
  close_sub_window('abilitylistbox');
}
//-----------------------------------------------------------------------------  
function open_sub_window(name)
{
  close_all_sub_windows();
  document.getElementById(name).style.visibility = "visible";
  if (name == "transportbox")
  {
    document.getElementById("animals").style.visibility = "visible";
  }
}
//-----------------------------------------------------------------------------  
function close_sub_window(name)
{
  if (name == "transportbox")
  {
    document.getElementById("vehicles").style.visibility = "hidden";
    document.getElementById("animals").style.visibility = "hidden";
  }
  document.getElementById(name).style.visibility = "hidden";
  create_link();
}
//-----------------------------------------------------------------------------  
function showanimals()
{
  document.getElementById("vehicles").style.visibility = "hidden";
  document.getElementById("animals").style.visibility = "visible";  
}
//-----------------------------------------------------------------------------  
function showvehicles()
{
  document.getElementById("vehicles").style.visibility = "visible";
  document.getElementById("animals").style.visibility = "hidden";  
}
//-----------------------------------------------------------------------------  
