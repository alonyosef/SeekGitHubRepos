﻿var app = angular.module('searchGitHubRepositoryApp', []);

app.controller('myCtrl', function ($scope, $http) {
    $scope.repositories = []; //currently showing repositories
    $scope.repositoriesCount = 0; //total repository count
    $scope.resultsPage = 1; // current search page result
    $scope.bookmarksIds = []; //ids for the current bookmarks

    //enable/disable search button according to existance of search text
    $scope.inputSearchDisabled = function () {
        return $scope.inputSearch == null || $scope.inputSearch.length == 0;
    }

    //gets repositories according to the search text
    $scope.getRepositories = function (newSearch) {               
        if (newSearch) {//if it's a new search reset all parameters
            if ($scope.inputSearch == null)
                return;
            $scope.searchResultsMessage = null;
            $scope.repositories = [];
            $scope.resultsPage = 1;
            $scope.searchText = $scope.inputSearch;
            showMoreResultsButton.style.display = 'none';
        } else 
            $scope.resultsPage++; //if it's not a new search advance 1 page forward               

        //turn on loader before http request
        setLoader(true);

        $http.get('https://api.github.com/search/repositories?q=' + $scope.searchText + '&page=' + $scope.resultsPage).then(function successCallback(res) {
            setLoader(false);
            $scope.repositoriesCount = res.data.total_count;
            if ($scope.repositoriesCount > 0) {                                
                $scope.repositories = $scope.repositories.concat(res.data.items); //add the result to the existing ones - if it's a new search the initial array is empty                             
                showMoreResultsButton.style.display = $scope.repositoriesCount - $scope.repositories.length == 0 ? 'none' : ''; //check if "show more results" button is needed
            }
            if (newSearch) 
                $scope.resetSearchMessage();
        }, function errorCallback(response) {
            if (newSearch)
                $scope.searchResultsMessage = null;
            $scope.repositoriesCount = 0;            
            setLoader(false);
        });            
    }

    //allow search to be conducted on enter press
    $scope.searchOnEnter = function ($event) {
        if ($event.keyCode == 13)
            $scope.getRepositories(true);
    }

    $scope.searchResultsMessage = null;

    var searchMatchedMessage = document.getElementById('searchMatchedMessage');

    //show search result message
    $scope.resetSearchMessage = function () {        
        $scope.searchResultsMessage = ($scope.repositoriesCount == 0 ? 'No' : $scope.repositoriesCount) + ' repositories match your search';
        searchMatchedMessage.style.color = $scope.repositoriesCount == 0 ? 'red' : 'green';
    }

    //send request to home controller the set a bookmark
    $scope.setBookmark = function ($index) {                             
        var item = gallery.children[$index];
        var bookmarkIcon = item.children[1];
        bookmarkIcon.src = bookmarkIcon.src.endsWith('empty_star.png') ? bookmarkIcon.src.replace('empty_star.png', 'full_star.png') : bookmarkIcon.src.replace('full_star.png', 'empty_star.png');
        
        $.ajax({
            type: "POST",
            url: "/Home/SetBookmark",
            data: JSON.stringify({ repository: JSON.stringify($scope.repositories[$index]) }),                
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('SetBookmark Error');
                console.log(jqXHR);
            },
            success: function (data) {
                console.log('SetBookmark Success');
                console.log(data);
            }
        });               
    }

    //gets bookmark ids
    $scope.getBookmarks = function (bookmarks) {        
        $scope.repositories = bookmarks;
        for (i = 0; i < bookmarks.length; i++) {
            $scope.bookmarksIds.push(bookmarks[i].id);
        }
    }
    
    //set bookmark ids
    $scope.setBookmarkIds = function (bookmarkIds) {
        $scope.bookmarksIds = bookmarkIds;        
    }

    //returns the appropriate bookmark button image url by id
    $scope.getStarUrl = function (id) {        
        var imageName = ($scope.bookmarksIds != null && $scope.bookmarksIds.includes(id) ? 'full_star' : 'empty_star') + '.png';        
        return window.location.origin + '/Content/pics/' + imageName;
    }

});

var gallery = document.getElementById('gallery');

var loader = document.getElementById('loader');

function setLoader(on) {
    loader.style.display = on ? '' : 'none';
}

var showMoreResultsButton = document.getElementById('showMoreResults');