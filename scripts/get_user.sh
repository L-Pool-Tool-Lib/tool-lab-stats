#!/bin/bash

source .env.development

USER_ID=$1

curl --location "https://$API_URL/library/orgLoan/exportLoans" \
    --header "Host: $API_URL" \
    --header 'User-Agent: curl for ltl-usage-graph' \
    --header 'Accept: */*' \
    --header 'Accept-Language: en-GB,en;q=0.7,fr;q=0.3' \
    --header 'Accept-Encoding: gzip, deflate, br, zstd' \
    --header "Referer: https://$API_URL/" \
    --header 'Content-type: application/x-www-form-urlencoded' \
    --header "Origin: https://$API_URL" \
    --header 'DNT: 1' \
    --header 'Connection: keep-alive' \
    --header "Cookie: $COOKIE" \
    --header 'Sec-Fetch-Dest: empty' \
    --header 'Sec-Fetch-Mode: cors' \
    --header 'Sec-Fetch-Site: same-origin' \
    --header "host: $API_URL" \
    --data-urlencode "borrowedBy.id=$USER_ID" \
    --data-urlencode 'item.id=' \
    --data-urlencode 'checkedOutBefore=struct' \
    --data-urlencode 'checkedOutBefore_date=' \
    --data-urlencode 'checkedOutBefore_time=23:59' \
    --data-urlencode 'checkedOutBefore_tz=Europe/London' \
    --data-urlencode 'checkedOutAfter=struct' \
    --data-urlencode 'checkedOutAfter_date=' \
    --data-urlencode 'checkedOutAfter_time=00:00' \
    --data-urlencode 'checkedOutAfter_tz=Europe/London' \
    --data-urlencode 'checkedInBefore=struct' \
    --data-urlencode 'checkedInBefore_date=' \
    --data-urlencode 'checkedInBefore_time=23:59' \
    --data-urlencode 'checkedInBefore_tz=Europe/London' \
    --data-urlencode 'checkedInAfter=struct' \
    --data-urlencode 'checkedInAfter_date=' \
    --data-urlencode 'checkedInAfter_time=00:00' \
    --data-urlencode 'checkedInAfter_tz=Europe/London' \
    --data-urlencode 'dueBefore=struct' \
    --data-urlencode 'dueBefore_date=' \
    --data-urlencode 'dueBefore_time=23:59' \
    --data-urlencode 'dueBefore_tz=Europe/London' \
    --data-urlencode 'dueAfter=struct' \
    --data-urlencode 'dueAfter_date=' \
    --data-urlencode 'dueAfter_time=00:00' \
    --data-urlencode 'dueOutAfter_tz=Europe/London' \
    --data-urlencode 'location.id=' \
    --data-urlencode 'out=' \
    --data-urlencode 'project.id=' \
    --data-urlencode 'projectPhase.id=' \
    --data-urlencode 'includeProjectData=false' \
    --data-urlencode 'format=csv' \
    --data-urlencode 'extension=csv' \
    --output "data/users/$USER_ID.csv"

sleep 3
