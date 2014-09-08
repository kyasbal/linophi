 function inputValue2()
 {
     var add = location.href;
     var val = $('.search-menu').val();
     var searchedText = $("#searchedText").val();
     window.location.href = "Search?searchText="+searchedText+"&order="+val;
 }