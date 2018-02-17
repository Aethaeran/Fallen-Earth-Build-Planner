//-----------------------------------------------------------------------------  
// Math.round(x) = Nearest Number
// Math.floor(x) = Lower Integer
// Math.ceil(x) = Higher Integer
//-----------------------------------------------------------------------------  
function setStats()
{
  var level, max_bonus_ap;
  var min_attr, max_attr;

  ap_avail = 0;
  ap_spent = 0;
 
  // Level
  if (st_stats[LEVEL] < 1)          st_stats[0] = 1;
  if (st_stats[LEVEL] > MAX_LEVEL)  st_stats[LEVEL] = MAX_LEVEL;
  g0.setValue(st_stats[LEVEL], true);
  level = st_stats[LEVEL];
  max_bonus_ap = (level * 5) + 35;
  ap_avail += level * 30;
  base_ap_avail = ap_avail; 

  // Bonus AP
  if (st_stats[BONUSAP] < 0)              st_stats[BONUSAP] = 0;
  if (st_stats[BONUSAP] > max_bonus_ap)   st_stats[BONUSAP] = max_bonus_ap;
  g1.setAll(0, max_bonus_ap, st_stats[BONUSAP], true);
  ap_avail += parseInt(st_stats[BONUSAP], 10);

  // Attributes
  for (i = CHARI; i <= WILLP; i++)
  {
    min_attr = 10 + level;
    max_attr = 15 + Math.ceil(level * 1.5);
    if (st_stats[i] < min_attr)  st_stats[i] = min_attr;
    if (st_stats[i] > max_attr)  st_stats[i] = max_attr;

    window["g" + i].setAll(min_attr, max_attr, st_stats[i], true);
    ap_spent += (st_stats[i] - min_attr) * 5;
  } // for i

  // Skills
  for (i = 0; i < 14; i++)
  {
    check_attribute(skill_details[i][0], // Stat 1
                    skill_details[i][1] / 100, // %
                    skill_details[i][2], // Stat 2
                    skill_details[i][3] / 100, // %
                    AR_US + i);
  } // for i
   
  // Mutations
  for (i = 0; i < 11; i++)
  {
    check_attribute(mutation_details[i][0], // Stat 1
                    mutation_details[i][1] / 100, // %
                    mutation_details[i][2], // Stat 2
                    mutation_details[i][3] / 100, // %
                    ALPHA + i);
  } // for i
 
  saveStatsToCookie();
  create_link();
 
  showdescription(last_attribute_clicked);
  showdescription(last_skill_clicked);
  showdescription(last_mutation_clicked);
}
//-----------------------------------------------------------------------------
function check_attribute(s1, pc1, s2, pc2, num)
{
  var min_value = 1;
  // Changed formula to correct values : Confirmed by email from devs!
  var max_value = Math.round((st_stats[s1] * pc1) + (st_stats[s2] * pc2)) * 2;
  if (num == CRAFT) var max_value = Math.round(((st_stats[s1] * pc1) + (st_stats[s2] * pc2)) * 2);
  var cur_value = st_stats[num];
  
  if (cur_value < min_value)  cur_value = min_value;
  if (cur_value > max_value)  cur_value = max_value;
  if ((num == CRAFT) || (num == ALPHA))              
  { 
    cur_value = max_value; 
    max_craft = max_value; 
  }

  st_stats[num] = cur_value;
  window["g" + num].setAll(min_value, max_value, cur_value, true);
  
  if ((num != ALPHA) && (num != CRAFT)) // don't spend AP on alpha or crafting
  {
    ap_spent += parseInt((st_stats[num] - min_value), 10);
  }
}  
//-----------------------------------------------------------------------------
