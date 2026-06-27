await fetch(
  "https://liverpooltoollibrary.myturn.com/library/orgInventory/report",
  {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0",
      Accept: "*/*",
      "Accept-Language": "en-GB,en;q=0.7,fr;q=0.3",
      "Content-type": "application/x-www-form-urlencoded",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      Priority: "u=0",
    },
    referrer: "https://liverpooltoollibrary.myturn.com/",
    body: "resolveValues=true&exportItemType=on&_exportItemType=true&exportDateCreated=on&_exportDateCreated=true&exportDateLastEdited=on&_exportDateLastEdited=true&exportDateLastUpdated=on&_exportDateLastUpdated=true&exportStatuses=on&_exportStatuses=true&selectedAttributes=1&_selectedAttributes=&selectedAttributes=15&_selectedAttributes=&selectedAttributes=68&_selectedAttributes=&selectedAttributes=67&_selectedAttributes=&selectedAttributes=11&_selectedAttributes=&selectedAttributes=40&_selectedAttributes=&selectedAttributes=8&_selectedAttributes=&selectedAttributes=69&_selectedAttributes=&selectedAttributes=14&_selectedAttributes=&selectedAttributes=58&_selectedAttributes=&selectedAttributes=13&_selectedAttributes=&selectedAttributes=31&_selectedAttributes=&selectedAttributes=4&_selectedAttributes=&selectedAttributes=71&_selectedAttributes=&selectedAttributes=65&_selectedAttributes=&selectedAttributes=12&_selectedAttributes=&selectedAttributes=29&_selectedAttributes=&selectedAttributes=28&_selectedAttributes=&selectedAttributes=2&_selectedAttributes=&selectedAttributes=38&_selectedAttributes=&selectedAttributes=52&_selectedAttributes=&selectedAttributes=53&_selectedAttributes=&selectedAttributes=54&_selectedAttributes=&selectedAttributes=64&_selectedAttributes=&selectedAttributes=47&_selectedAttributes=&selectedAttributes=46&_selectedAttributes=&selectedAttributes=25&_selectedAttributes=&selectedAttributes=70&_selectedAttributes=&selectedAttributes=6&_selectedAttributes=&selectedAttributes=7&_selectedAttributes=&selectedAttributes=16&_selectedAttributes=&selectedAttributes=60&_selectedAttributes=&selectedAttributes=21&_selectedAttributes=&selectedAttributes=35&_selectedAttributes=&selectedAttributes=36&_selectedAttributes=&selectedAttributes=37&_selectedAttributes=&selectedAttributes=30&_selectedAttributes=&selectedAttributes=33&_selectedAttributes=&selectedAttributes=34&_selectedAttributes=&selectedAttributes=22&_selectedAttributes=&selectedAttributes=23&_selectedAttributes=&selectedAttributes=59&_selectedAttributes=&selectedAttributes=10&_selectedAttributes=&selectedAttributes=26&_selectedAttributes=&selectedAttributes=24&_selectedAttributes=&selectedAttributes=32&_selectedAttributes=&selectedAttributes=3&_selectedAttributes=&selectedAttributes=27&_selectedAttributes=&selectedAttributes=39&itemType.id=&itemTypeName=&statusExclude=true&dateCreatedAfter_date=&dateCreatedAfter=struct&dateCreatedAfter_tz=Europe%2FLondon&dateCreatedAfter_time=00%3A00&dateCreatedBefore_date=&dateCreatedBefore=struct&dateCreatedBefore_tz=Europe%2FLondon&dateCreatedBefore_time=00%3A00&datePurchasedAfter_date=&datePurchasedAfter=struct&datePurchasedAfter_tz=Europe%2FLondon&datePurchasedAfter_time=00%3A00&datePurchasedBefore_date=&datePurchasedBefore=struct&datePurchasedBefore_tz=Europe%2FLondon&datePurchasedBefore_time=00%3A00&filterField=&filterOperator=contains&filterValue=&format=csv&extension=csv",
    method: "POST",
    mode: "cors",
  }
);

// get items (less detailed list)
await fetch("https://liverpooltoollibrary.myturn.com/library/orgInventory/exportItemList", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0",
        "Accept": "*/*",
        "Accept-Language": "en-GB,en;q=0.7,fr;q=0.3",
        "Content-type": "application/x-www-form-urlencoded",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Priority": "u=0"
    },
    "referrer": "https://liverpooltoollibrary.myturn.com/",
    "body": "restrictToType=&format=csv&extension=csv",
    "method": "POST",
    "mode": "cors"
});