#!/bin/bash

#   r.parsedate(value, dayfirst=False, yearfirst=False, errors=None)

#   Parse a date and convert it to ISO date format: yyyy-mm-dd

#   - dayfirst=True: treat xx as the day in xx/yy/zz
#   - yearfirst=True: treat xx as the year in xx/yy/zz
#   - errors=r.IGNORE to ignore values that cannot be parsed
#   - errors=r.SET_NULL to set values that cannot be parsed to null


#   sqlite-utils convert 

# In the case of dates such as 03/04/05 U.S. MM/DD/YY format is assumed - you can use dayfirst=True or yearfirst=True to change how these ambiguous dates are interpreted.

# Parse a date and convert it to ISO date format: yyyy-mm-dd
# In the case of dates such as 03/04/05 U.S. MM/DD/YY format is assumed - you can use dayfirst=True or yearfirst=True to change how these ambiguous dates are interpreted.

sqlite-utils insert ltl.db first data/first.csv --csv -d
sqlite-utils convert ltl.db first Start_Date \
  'r.parsedate(value, dayfirst=False, yearfirst=True, errors=None)'
sqlite-utils convert ltl.db first End_Date \
  'r.parsedate(value, dayfirst=False, yearfirst=True, errors=None)'
sqlite-utils insert ltl.db gender data/gender.csv --csv -d
sqlite-utils insert ltl.db map data/map.csv --csv -d
sqlite-utils insert ltl.db mapdistrict data/mapdistrict.csv --csv -d
sqlite-utils insert ltl.db mapsector data/mapsector.csv --csv -d
sqlite-utils insert ltl.db membership-any data/membership-any.csv --csv -d
sqlite-utils insert ltl.db membership-aspenYard data/membership-aspenYard.csv --csv -d
sqlite-utils insert ltl.db membership-concession data/membership-concession.csv --csv -d
sqlite-utils insert ltl.db membership-employee data/membership-employee.csv --csv -d
sqlite-utils insert ltl.db membership-payItForward data/membership-payItForward.csv --csv -d
sqlite-utils insert ltl.db membership-standard data/membership-standard.csv --csv -d
sqlite-utils insert ltl.db membership-volunteer data/membership-volunteer.csv --csv -d
sqlite-utils insert ltl.db postcode data/postcode.csv --csv -d
# extract partial postcodes (districts...), aggregates (gender),
# extract start/end week day/month/year into own columns