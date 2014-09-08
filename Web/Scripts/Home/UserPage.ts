var UserPageSearchOptionBoxManager: SearchOrderOptionBox;

$(() =>
    {
    UserPageSearchOptionBoxManager = new SearchOrderOptionBox($(".search-menu"), "UserPage", "", false);
    UserPageSearchOptionBoxManager.initBoxSelected();
    }
);