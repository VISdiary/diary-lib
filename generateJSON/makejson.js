var Holidays = require("./data/holidays.json");
var Quotes = require("./data/quotes.json");
var YearSpecs = require("./data/yearSpecs.json");


function CalendarDates(params, holidays, quotes)
{
    this.begin = new Date(params.start)
    this.end = new Date(param.end)
    this.weeks = [];
    
    var schoolDay = this.begin;
    
    for ( ; +schoolDay !== +this.end; s.setDate(s.getDate()+1)  ) {
    
    }
}



function generateJSON( calendarSpecs)
{
    var weeks = [];
    for (var i = 0; i < calendarSpecs.weeks.length; i++) {
      weeks.push({
        type: calendarSpecs.weeks[i].type,
        quotes: [
          {
            "text": "---",
            "author": "_"
          },
          {
            "text": "---",
            "author": "_"
          }

        ],
        "days": [
          {
            "name": "Monday 25 August",
            "info": null
          },
          {
            "name": "Tuesday 26 August",
            "info": null
          },
          {
            "name": "Wednesday 27 August",
            "info": null
          },
          {
            "name": "Thursday 28 August",
            "info": null
          },
          {
            "name": "Friday 29 August",
            "info": null
          }
        ]
      });
    }

    console.log(JSON.stringify(weeks, null, 2))
}
