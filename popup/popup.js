console.log("test");
asset_upvote_grey = chrome.extension.getURL("assets/up_grey.png");
asset_upvote_orange = chrome.extension.getURL("assets/up_orange.png");
asset_downvote_grey = chrome.extension.getURL("assets/down_grey.png");
asset_downvote_blue = chrome.extension.getURL("assets/down_blue.png");

asset_arrow_right = chrome.extension.getURL("assets/arrow_right.png");
asset_arrow_down = chrome.extension.getURL("assets/arrow_down.png");
asset_arrow_up = chrome.extension.getURL("assets/arrow_up.png");

modhash = "";
submissions = [];
hideOpenOptions = false;







var currentTabPromise = new Promise(function (resolve, reject) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        if (tabs[0].url != "" || tabs[0].url != undefined) {
            resolve(tabs[0].url);
        } else {
            reject(tabs[0].url);
        }
    });
});

var modhashPromise = new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                if (json.hasOwnProperty("data")) {
                    resolve(json.data.modhash);
                } else {
                    reject("");
                }
            }
            else {
                reject("");
            }
        }
    };
    xhr.open("GET", "https://www.reddit.com/api/me.json", true);
    xhr.send();
});

var responses_expected = 0;
var response_counter = 0;
var total_submission_list = [];

function getAllSubmissions(url) {
    var reddit_urls = getAllURLVersions(url);
    responses_expected = reddit_urls.length;
    response_counter = 0;
    total_submission_list = [];
    for (var i = 0; reddit_url = reddit_urls[i]; i++) {
        getJSON(reddit_url, handleResponse);
    }
}

function handleResponse(jsonData) {
    var now = new Date();
    var now_timestamp = now.getTime(); // = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    var submissions = [];
    for (var i = 0; entry = jsonData.data.children[i]; i++) {
        submission_timestamp = entry.data.created_utc * 1000;
        submissions[i] = {
            fullname: entry.data.name,
            link: "http://reddit.com" + entry.data.permalink,
            title: entry.data.title,
            score: entry.data.score + "",
            age: (now_timestamp - submission_timestamp),
            comments: entry.data.num_comments + "",
            subreddit: entry.data.subreddit,
            likes: entry.data.likes,
            user: entry.data.author
        };
    }
    total_submission_list.push.apply(total_submission_list, submissions);

    response_counter++;
    if (response_counter === responses_expected) {
        total_submission_list = distinctSubmissions(total_submission_list);
        displaySubmissions(total_submission_list);
    }
}

function getJSON(path, success) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function distinctSubmissions(submission_list) {
    var u = {},
        a = [];
    for (var i = 0, l = submission_list.length; i < l; ++i) {
        if (u.hasOwnProperty(submission_list[i].fullname)) {
            continue;
        }
        a.push(submission_list[i]);
        u[submission_list[i].fullname] = 1;
    }
    return a;
}

function getAllURLVersions(url) {
    if (url.indexOf("about:reader?url=") === 0) {
        url = decodeURIComponent(url.substring("about:reader?url=".length));
    }
    var host = url.split("/")[2];
    var result = [];
    if ((host === 'youtube.com' || host === 'www.youtube.com') && url.split("/")[3].indexOf('watch?') === 0) {
        youtubeID = function () {
            var query = url.substring(url.indexOf('?') + 1);
            var parameters = query.split('&');
            for (var i = 0; i < parameters.length; i++) {
                var pair = parameters[i].split('=');
                if (pair[0] === 'v') {
                    return pair[1];
                }
            }
            return '';
        } ();

        // some youtube id's contain a dash at the start and reddit search interprets that as NOT
        // workaround is to search without the dash in the id
        if (youtubeID.indexOf('-') === 0) {
            youtubeID = youtubeID.substring(1);
        }

        result.push('http://api.reddit.com/search.json?q=' + encodeURIComponent('(url:' + youtubeID + ') (site:youtube.com OR site:youtu.be)'))
    } else {
        var without_http = "";
        if (url.slice(-1) === "/") {
            url = url.substring(0, url.length - 1);
        }
        result.push('http://www.reddit.com/api/info.json?url=' + encodeURIComponent(url));
        result.push('http://www.reddit.com/api/info.json?url=' + encodeURIComponent(url + "/"));
        if (url.indexOf('https') === 0) {
            without_http = url.substring(8);
            result.push('http://www.reddit.com/api/info.json?url=' + encodeURIComponent(without_http));
            result.push('http://www.reddit.com/api/info.json?url=' + encodeURIComponent(without_http + "/"));
        } else {
            if (url.indexOf('http') === 0) {
                without_http = url.substring(7);
                result.push('http://www.reddit.com/api/info.json?url=' + encodeURIComponent("https://" + without_http));
                result.push('http://www.reddit.com/api/info.json?url=' + encodeURIComponent("https://" + without_http + "/"));
            } else {
                without_http = url;
                result.push('http://www.reddit.com/api/info.json?url=' + encodeURIComponent("https://" + without_http));
                result.push('http://www.reddit.com/api/info.json?url=' + encodeURIComponent("https://" + without_http + "/"));
            }
        }
    }
    return result;
}

function displaySubmissions(submissions) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("footer").style.display = "block";
        if (submissions.length === 0) {
            var t_nonefound = document.createTextNode("It seems like this page hasn't been submitted to reddit, yet.");

            var e_nonefound = document.createElement("div");
            e_nonefound.setAttribute("align", "center");
            e_nonefound.setAttribute("style", "font-size: 95% !important");
            e_nonefound.appendChild(document.createElement("br"));
            e_nonefound.appendChild(t_nonefound);

            document.getElementById("links").appendChild(e_nonefound);
        } else {
            if (modhash === "") {
                document.getElementById("header").style.display = "block";
                document.getElementById("links").style.top = "27px";
            }
            for (var i = 0; submission = submissions[i]; i++) {

                var t_score = document.createTextNode(submission.score);
                var t_title = document.createTextNode(submission.title);
                var t_time = document.createTextNode(formatAge(submission.age));
                var t_user = document.createTextNode(submission.user);
                var t_subreddit = document.createTextNode("/r/" + submission.subreddit);
                var t_comments = document.createTextNode(submission.comments + " comments");

                var e_submission = document.createElement("div");
                e_submission.setAttribute("class", "submission");

                var e_submission_table = document.createElement("table");
                e_submission.appendChild(e_submission_table);
                var e_column_scorecontainer = document.createElement("td");
                e_submission_table.appendChild(e_column_scorecontainer);
                var e_column_rightpanel = document.createElement("td");
                e_submission_table.appendChild(e_column_rightpanel);

                var e_scorecontainer = document.createElement("div");
                e_scorecontainer.setAttribute("class", "scorecontainer");
                e_scorecontainer.setAttribute("align", "center");
                e_column_scorecontainer.appendChild(e_scorecontainer);

                var e_rightpanel = document.createElement("div");
                e_rightpanel.setAttribute("class", "rightpanel");
                e_submission_table.appendChild(e_rightpanel);

                var e_contentcontainer = document.createElement("div");
                e_contentcontainer.setAttribute("class", "contentcontainer");
                e_rightpanel.appendChild(e_contentcontainer);

                if (modhash !== "") {
                    var e_upvote = document.createElement("img");
                    e_upvote.setAttribute("class", "upvote");
                    e_upvote.setAttribute("src", asset_upvote_grey);
                    e_upvote.setAttribute("id", "upvote" + submission.fullname);
                    e_scorecontainer.appendChild(e_upvote);
                    if (submission.likes === true) {
                        e_upvote.setAttribute("src", asset_upvote_orange);
                    }
                }
                var e_score = document.createElement("div");
                e_score.setAttribute("class", "score");
                e_score.appendChild(t_score);
                e_scorecontainer.appendChild(e_score);

                if (modhash !== "") {
                    var e_downvote = document.createElement("img");
                    e_downvote.setAttribute("class", "downvote");
                    e_downvote.setAttribute("src", asset_downvote_grey);
                    e_downvote.setAttribute("id", "downvote" + submission.fullname);
                    e_scorecontainer.appendChild(e_downvote);
                    if (submission.likes === false) {
                        e_downvote.setAttribute("src", asset_downvote_blue);
                    }
                }
                if (!hideOpenOptions) {
                    var e_options = document.createElement("div");
                    e_options.setAttribute("class", "options");
                    e_contentcontainer.appendChild(e_options);

                    var e_currenttab_img = document.createElement("img");
                    e_currenttab_img.setAttribute("src", asset_arrow_down);

                    var e_currenttab = document.createElement("div");
                    e_currenttab.setAttribute("class", "currenttab");
                    e_currenttab.appendChild(e_currenttab_img);
                    e_options.appendChild(e_currenttab);

                    var e_foregroundtab_img = document.createElement("img");
                    e_foregroundtab_img.setAttribute("src", asset_arrow_right);

                    var e_foregroundtab = document.createElement("div");
                    e_foregroundtab.setAttribute("class", "foregroundtab");
                    e_foregroundtab.appendChild(e_foregroundtab_img);
                    e_options.appendChild(e_foregroundtab);

                    var e_backgroundtab_img = document.createElement("img");
                    e_backgroundtab_img.setAttribute("src", asset_arrow_up);

                    var e_backgroundtab = document.createElement("div");
                    e_backgroundtab.setAttribute("class", "backgroundtab");
                    e_backgroundtab.appendChild(e_backgroundtab_img);
                    e_options.appendChild(e_backgroundtab);
                }

                var e_title = document.createElement("div");
                e_title.setAttribute("class", "title");
                e_title.appendChild(t_title);
                e_contentcontainer.appendChild(e_title);

                var e_infobox = document.createElement("div");
                e_infobox.setAttribute("class", "infobox");
                e_contentcontainer.appendChild(e_infobox);

                var e_time = document.createElement("div");
                e_time.setAttribute("class", "time");
                e_time.appendChild(t_time);

                var e_user = document.createElement("div");
                e_user.setAttribute("class", "user");
                e_user.appendChild(t_user);

                var e_subreddit = document.createElement("div");
                e_subreddit.setAttribute("class", "subreddit");
                e_subreddit.appendChild(t_subreddit);

                var e_comments = document.createElement("div");
                e_comments.setAttribute("class", "comment");
                e_comments.appendChild(t_comments);



                e_infobox.appendChild(document.createTextNode(" submitted "));
                e_infobox.appendChild(e_time);
                e_infobox.appendChild(document.createTextNode(" by "));
                e_infobox.appendChild(e_user);
                e_infobox.appendChild(document.createTextNode(" to "));
                e_infobox.appendChild(e_subreddit);
                e_infobox.appendChild(e_comments);

                e_contentcontainer.onclick = function (submission_link) {
                    return function (event) {
                        openLink(submission_link, "default");
                    }
                } (submission.link);

                if (!hideOpenOptions) {
                    e_currenttab.onclick = function (submission_link) {
                        return function (event) {
                            openLink(submission_link, "currenttab");
                            event.stopPropagation();
                        }
                    } (submission.link);

                    e_foregroundtab.onclick = function (submission_link) {
                        return function (event) {
                            openLink(submission_link, "foregroundtab");
                            event.stopPropagation();
                        }
                    } (submission.link);

                    e_backgroundtab.onclick = function (submission_link) {
                        return function (event) {
                            openLink(submission_link, "backgroundtab");
                            event.stopPropagation();
                        }
                    } (submission.link);
                }

                document.getElementById("links").appendChild(e_submission);

                if (modhash !== "") {
                    e_upvote.onclick = function (submission_local, t_score) {
                        return function (event) {
                            if (submission_local.likes === true) {
                                castVote(submission_local.fullname, 0);
                                t_score.textContent = parseInt(t_score.textContent) - 1;
                                // -1
                                submission_local.likes = null;
                            } else {
                                castVote(submission_local.fullname, 1);
                                if (submission_local.likes === null) {
                                    t_score.textContent = parseInt(t_score.textContent) + 1;
                                    // +1
                                } else {
                                    t_score.textContent = parseInt(t_score.textContent) + 2;
                                    // + 2
                                }
                                submission_local.likes = true;
                            }
                            event.stopPropagation();
                        }
                    } (submission, t_score);

                    e_downvote.onclick = function (submission_local, t_score) {
                        return function (event) {
                            if (submission_local.likes === false) {
                                castVote(submission_local.fullname, 0);
                                t_score.textContent = parseInt(t_score.textContent) + 1;
                                // +1
                                submission_local.likes = null;
                            } else {
                                castVote(submission_local.fullname, -1);
                                if (submission_local.likes === null) {
                                    t_score.textContent = parseInt(t_score.textContent) - 1;
                                    // -1
                                } else {
                                    t_score.textContent = parseInt(t_score.textContent) - 2;
                                    // - 2
                                }
                                submission_local.likes = false;
                            }
                            event.stopPropagation();
                        }
                    } (submission, t_score);
                }
            }
        }

        document.getElementById("submitbutton").onclick = function () {
            openLink("http://www.reddit.com/submit?resubmit=true&url=" + encodeURIComponent(current_page), "foregroundtab");
        };
        document.getElementById("reportproblembutton").onclick = function () {
            var username = "ntv1000";
            var subject = "Bug report: submission not found";
            var message = "Page that was searched for: " + current_page + "\n\nMissing submission: [Insert a link to the submission you thing is missing here]\n\nAdditional info: [optional]";
            var template_url = "http://www.reddit.com/message/compose/?to=" + encodeURIComponent(username) + "&subject=" + encodeURIComponent(subject) + "&message=" + encodeURIComponent(message);
            openLink(template_url, "foregroundtab");
        };
}

function formatAge(age) {
    var result = "";
    var value = 0;
    var MINUTE = 60 * 1000;
    var HOUR = MINUTE * 60;
    var DAY = HOUR * 24;
    var WEEK = DAY * 7;
    var YEAR = WEEK * 52;
    var MONTH = YEAR / 12;
    if (age < MINUTE) {
        result = age + " second";
    } else if (age < HOUR) {
        value = Math.floor(age / MINUTE);
        result = value + " minute";
    } else if (age < DAY) {
        value = Math.floor(age / HOUR);
        result = value + " hour";
    } else if (age < WEEK) {
        value = Math.floor(age / DAY);
        result = value + " day";
    } else if (age < MONTH) {
        value = Math.floor(age / WEEK);
        result = value + " week";
    } else if (age < YEAR) {
        value = Math.floor(age / MONTH);
        result = value + " month";
    } else {
        value = Math.floor(age / YEAR);
        result = value + " year";
    }

    if (value !== 1) {
        result += "s";
    }
    result += " ago";
    return result;
}

function openLink(url, where) {
    self.port.emit("open-link", {
        url: url,
        where: where
    });
}

function castVote(fullname, direction) {
    var url = "http://www.reddit.com/api/vote?dir=" + direction + "&id=" + fullname;

    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", url, true);
    // xhr.setRequestHeader("X-Modhash", modhash);
    // xhr.send();
    self.port.emit("vote-submission", url);

    // update UI accordingly
    if (direction === 1) {
        document.getElementById("upvote" + fullname).setAttribute("src", asset_upvote_orange);
        document.getElementById("downvote" + fullname).setAttribute("src", asset_downvote_grey);
    } else if (direction === 0) {
        document.getElementById("upvote" + fullname).setAttribute("src", asset_upvote_grey);
        document.getElementById("downvote" + fullname).setAttribute("src", asset_downvote_grey);
    } else if (direction === -1) {
        document.getElementById("upvote" + fullname).setAttribute("src", asset_upvote_grey);
        document.getElementById("downvote" + fullname).setAttribute("src", asset_downvote_blue);
    }
}



Promise.all([currentTabPromise, modhashPromise]).then(function (values) {
        console.log("url: " + values[0]);
        modhash = values[1];
        console.log("modhash: " + values[1]);
        getAllSubmissions(values[0]);
    });