// document onready function
$( () => {

  $(".submit_comment").on("click", (event) => {
    // console.log('moused over');
    let name = $('.name').text();
    let comment = $(event.currentTarget).parent().children().eq(4).val();
    // console.log(comment);
    let newListItem = $('<li>').text(name + ": " + comment);
    // console.log('newListItem=', newListItem);
    $(".list_of_comments").append(newListItem);
  })

}); // end of document onready
