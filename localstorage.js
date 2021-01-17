function handlers(){
    
    document.querySelectorAll('.gallery_link').forEach(item =>{
    item.addEventListener('click', event =>{
       // e.preventDefault(); 
    const $thisLink = e.currentTarget;
    const linkID = $thisLink.dataset.id;
        console.log($thisLink);
    let curStorage = localStorage.getItem("visitedItems");
  if (curStorage) {
      //ADD:
      //create an array from comma separated string 
      //(i.e. 'item1,item2,item3')
      curStorage = curStorage.split(",");
      console.log("curStorage is true");
  } else {
      //ADD:
      curStorage = []; //create new array
      console.log("curStorage is not true");
  }
  //ADD:
  if (!curStorage.includes(linkID)) { //if ID is not in storage...
      console.log("Id IS NOT IN STORAGE");
      curStorage.push(linkID); //add it...
      //then resubmit the local storage entry as a string...
      localStorage.setItem("visitedItems", curStorage.toString());
  }
        
        
        
     //see if the array contains each particular item's id...
  let existsInStorage = curSotrage.includes(galleryItem.id);
  //if it does, add the 'visited' class to the link...
  let $galleryLink = "<a class='gallery__link ${existsInStorage ? 'visited' : ''}'>...</a>"    
        
    })
})
               
    
    
}

           
                          




