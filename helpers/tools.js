/**
 * Created by imalonzo on 10/11/16.
 */



module.exports = {
    index: function (model) {
        model.find({}, function(err, data) {
            if (err) {
                return err;
            } else {
                console.log("EXPORT data animal: "  + data['animal']);
                console.log("EXPORT data: "  + data);
                return data;
            }
        });
    },

    bar: function () {
        // whatever
    }
};