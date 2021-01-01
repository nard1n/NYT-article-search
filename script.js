// app pulls articles from NYT.com through an API


function buildQueryURL() {
    var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

    //building an object to contain the API calls' query params
    //API KEY
    var queryParams = { "api-key": "NwknZVvgRltbgbAApODnG6P5tnTDGMVT" };

    //get the text from search input and add to queryParams object
    queryParams.q = $(".search-term")
        .val()
        .trim();

    //if start year provided, include it in queryParams object
    var startYear = $(".start-year")
        .val()
        .trim();

    if (parseInt(startYear)) {
        queryParams.begin_date = startYear + "0101";
    }

    //if end year provided, include it in queryParams object
    var endYear = $(".end-year")
        .val()
        .trim();

    if (parseInt(endYear)) {
        queryParams.end_date = endYear + "0101";
    }

    // Logging the URL so we have access to it for troubleshooting
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
}

// take API data and turns it into elements on the page
function updatePage(NYTData) {
    var numArticles = $(".article-count").val();
    console.log(NYTData);
    console.log("-------------------");

    //for loop to build elements for defined number of articles
    for (var i = 0; i < numArticles; i++) {
        var article = NYTData.response.docs[i];
        var articleCount = i + 1;
        var $articleList = $("<ul>");
        $articleList.addClass("list-group");

        $(".article-section").append($articleList);

        // If the article has a headline, log and append to $articleList
        var headline = article.headline;
        var $articleListItem = $("<li class='list-group-item articleHeadline'>");

        if (headline && headline.main) {
            console.log(headline.main);
            $articleListItem.append(
                "<span class='label label-primary'>" +
                articleCount +
                "</span>" +
                "<strong>" +
                headline.main +
                "</strong>"
            );
        }
        // if the article has a byline, log and append to 
        var byline = article.byline;

        if (byline && byline.original) {
            console.log(byline.original);
            $articleListItem.append("<h5>" + byline.original + "</h5>");
        }

        // Log section, and append to document if exists
        var section = article.section_name;
        console.log(article.section_name);
        if (section) {
            $articleListItem.append("<h5>Section: " + section + "</h5>");
        }

        // Log published date, and append to document if exists
        var pubDate = article.pub_date;
        console.log(article.pub_date);
        if (pubDate) {
            $articleListItem.append("<h5>" + article.pub_date + "</h5>");
        }

        // Append and log url
        $articleListItem.append("<a href='" + article.web_url + "'>" + article.web_url + "</a>");
        console.log(article.web_url);

        // Append the article
        $articleList.append($articleListItem);

    }
}

function clear () {
    $(".article-section").empty();
}

/////// CLICK HANDLERS

// Search Button .on("click") functionality
$(".run-search").on("click", function(event) {
    event.preventDefault(); // prevents the page from reloading on form submit

    //Empty the region associated with the articles
    clear();

    // Build the query URL for the ajax request to the NYT API
    var queryURL = buildQueryURL();

    // AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(updatePage);
});    

//  .on("click") function associated with the clear button
$(".trash-icon").on("click", clear);
