var weeks = [];


for (var i = 0; i < 39; i++) {
  weeks.push({
    type: "A",
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
