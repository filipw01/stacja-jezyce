const response = await fetch("https://poznanprod-cms.robyg.pl/graphql", {
  "headers": {
    "content-type": "application/json",
  },
  "body": "{\"variables\":{},\"query\":\"{\\n  mieszkaniesConnectionRaw(where: {}) {\\n    groupBy {\\n      investment {\\n        key\\n        connection {\\n          values {\\n            name\\n            rooms\\n            price\\n            level\\n            measurement\\n            estate3D\\n            planLink\\n            graphLink\\n            slug\\n            building\\n            delivery\\n            type\\n            balcony\\n            terrace\\n            garden\\n            north\\n            east\\n            south\\n            west\\n            hasSeperateKitchen\\n            smartHouse\\n            hasGastronomy\\n            __typename\\n          }\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\"}",
  "method": "POST"
});
const data = await response.json();

console.log(data.data.mieszkaniesConnectionRaw.groupBy.investment[1].connection.values);

await Deno.writeTextFile(
  `./data/${(new Date()).toISOString().slice(0, 10)}.json`,
  JSON.stringify(data.data.mieszkaniesConnectionRaw.groupBy.investment[1].connection.values)
);

