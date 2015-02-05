self.port.on("show", function onShow(url) {
	reset();
	getSubmissions(url);
});

self.port.on("hide", function onHide() {
	$.each($("#links").children(), function(index, child) {
		child.remove();
	});
});

function reset(){
	$.each($("#data").children(), function(index, child) {
		child.remove();
	});
	$("img#loading").show(0);
}

function getSubmissions(url){
	console.log('Submissions for ' + url);
	var redditPosts = [];
	var now = new Date();
	var now_timestamp = now.getTime();// = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
	var redditUrl = 'http://www.reddit.com/api/info.json?url=' + encodeURIComponent(url);
	$.getJSON(redditUrl, function(jsonData) {
		$("img#loading").hide(0);
		var submissions = [];
		for(var i=0; entry = jsonData.data.children[i]; i++) {
			console.log(entry.data.score + " | " + entry.data.title)
			submission_timestamp = entry.data.created_utc*1000;
			submissions[i] = {
				link: "http://reddit.com" + entry.data.permalink,
				title: entry.data.title,
				score: entry.data.score+"",
				age: (now_timestamp - submission_timestamp) / (24 * 60 * 60 * 1000), // 24 * 60 * 60 * 1000 = milliseconds of 1 day
				comments: entry.data.num_comments+"",
				subreddit: entry.data.subreddit,
			};
		}
		putSubmissionsIntoUI(submissions);
	});
}

function putSubmissionsIntoUI(submissions){
	if(submissions.length === 0){
		$("#data").append("<span id='title'>"+"[title]"+"</span>&nbsp;&nbsp;&nbsp;");
		$("#data").append(
		"<span><a title='Post to reddit'"+
		" target='_blank' href='" + "[submit url]" +
		"'>Repost</a></span>");
	}
	else{
		$.each(submissions, function(index, submission) {
			var element = $(
				"<div> "+ 
					submission.score + " | " + submission.title + "</a>" + 
					"<br>"+
					"To /r/" + submission.subreddit + ", " + submission.age + " days ago - " + submission.comments + " comments" + 
				"</div>" + 
				"<br>"
				);
			element.click(function(){
				openLinkInNewTab(submission.link);
			});
			$("#links").append(element);
		});
	}
}

function openLinkInNewTab(url){
	self.port.emit("open-link", url);
}












