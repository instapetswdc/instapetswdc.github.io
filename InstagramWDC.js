(function () {
    var myConnector = tableau.makeConnector();

    myConnector.getSchema = function (schemaCallback) {
        var cols = [{
            id: "post_id",
            alias: "post",
            dataType: tableau.dataTypeEnum.int
        },{
            id: "graphql__user__biography",
            alias: "biography",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "graphql__user__edge_followed_by__count",
            alias: "followers",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "graphql__user__full_name",
            alias: "full_name",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "graphql__user__is_business_account",
            alias: "is_business_account",
            dataType: tableau.dataTypeEnum.bool
        },{
            id: "graphql__user__is_verified",
            alias: "is_verified",
            dataType: tableau.dataTypeEnum.bool
        },{
            id: "graphql__user__username",
            alias: "username",
            dataType: tableau.dataTypeEnum.string
        },{
            id: "graphql__user__edge_owner_to_timeline_media__count",
            alias: "total_posts",
            dataType: tableau.dataTypeEnum.float
        },{
            id: "graphql_user_edge_owner_to_timeline_media_edges_node_edge_media_to_comment_count",
            alias: "comment_count",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "graphql_user_edge_owner_to_timeline_media_edges_node_edge_liked_by_count",
            alias: "liked_by_count",
            dataType: tableau.dataTypeEnum.float        
        }];
    
        var tableSchema = {
            id: "petdata",
            alias: "Pet Data",
            columns: cols
        };
    
        schemaCallback([tableSchema]);
    };

    myConnector.getData = function(table, doneCallback){
        var count = 0; 

        var profiles = ["bonebone29", "dorito.goldenboy", "hamlet_the_piggy", "iamlilbub", 
            "iggyjoey", "itsdougthepug", "jackthecockatiel", "jiffpom", "juniperfoxx", "lionelthehog",
            "loki", "maple.the.pup", "marniethedog", "marutaro", "mensweardog", "nala_cat", 
            "nevillejacobs", "omame_munchkin", "pumpkintheraccoon", "reagandoodle", "realdiddykong",
             "this_girl_is_a_squirrel", "tibbythecorgi", "toby_littledude", "tunameltsmyheart"];

        for (var i = 0; i < profiles.length; i++){
            getProfile(table, profiles[i]);
            count++;
            if (count == profiles.length){
                getProfile(table, profiles[i], doneCallback);

            }
        }
    }

    tableau.registerConnector(myConnector);

    $(document).ready(function () {
        $("#submitButton").click(function () {
            tableau.connectionName = "Instagram Post Feed";
            tableau.submit();
        });
    });

})();

function getProfile(table, profile, doneCallback){
    $.getJSON("https://www.instagram.com/" + profile + "/?__a=1", function(resp) {
        var tableData = [];
        var postNumber = 1; 
        // Iterate over the JSON object
        for (var j = 0, len = resp.graphql.user.edge_owner_to_timeline_media.edges.length; j < len; j++) {
            tableData.push({
                "post_id": postNumber++, 
                "graphql__user__biography": resp.graphql.user.biography,
                "graphql__user__edge_followed_by__count": resp.graphql.user.edge_followed_by.count,
                "graphql__user__full_name": resp.graphql.user.full_name,
                "graphql__user__is_business_account": resp.graphql.user.is_business_account,
                "graphql__user__is_verified": resp.graphql.user.is_verified,
                "graphql__user__username": resp.graphql.user.username,
                "graphql__user__edge_owner_to_timeline_media__count": resp.graphql.user.edge_owner_to_timeline_media.count,
                "graphql_user_edge_owner_to_timeline_media_edges_node_edge_media_to_comment_count": resp.graphql.user.edge_owner_to_timeline_media.edges[j].node.edge_media_to_comment.count,
                "graphql_user_edge_owner_to_timeline_media_edges_node_edge_liked_by_count": resp.graphql.user.edge_owner_to_timeline_media.edges[j].node.edge_liked_by.count
            });
        }    
        table.appendRows(tableData);
        if (doneCallback){
            doneCallback();
        }
    });
}