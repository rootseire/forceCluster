function check_visited_links(linkText){
    console.log(linkText);
    
var visited_links = JSON.parse(localStorage.getItem('visited_links')) || [];
var links = document.getElementsByTagName('a');
for (var i = 0; i < links.length; i++) {
    var that = links[i];
   
        var clicked_url = linkText;
        if (visited_links.indexOf(clicked_url)==-1) {
            visited_links.push(clicked_url);
            localStorage.setItem('visited_links', JSON.stringify(visited_links));
      
    }
    if (visited_links.indexOf(that.href)!== -1) { 
       console.log("yes");
        that.parentNode.className += ' visited';
       
    }
     if (visited_links.indexOf(linkText)!== -1) {
        //
    };
}

    
    
    
    console.log(localStorage);
   // console.log(sessionStorage);
}