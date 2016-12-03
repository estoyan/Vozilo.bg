/* globals $ document*/
'use strict';

$(document).ready(function() {
    $('#first-tab a').click(function(e) {
        e.preventDefault();
        $('.profile-tab').addClass('hidden');
        $('#prfile-info').removeClass('hidden');
    });

    $('#second-tab a').click(function(e) {
        e.preventDefault();
        $('.profile-tab').addClass('hidden');
        $('#user-cars').removeClass('hidden');
    });

    $('#third-tab a').click(function(e) {
        e.preventDefault();
        $('.profile-tab').addClass('hidden');
        $('#user-reviews').removeClass('hidden');
    });

    $('#add-comment').click(function() {
        $('#comments-modal').modal();
    });
});