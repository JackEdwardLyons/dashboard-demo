new Vue({
    el: '#vue-app',
    data: function () {
        return {
            name: 'John',
            shipments: 4,
            loading: false,
            bookingData: [],
            requestData: []
        }
    },
    computed: {
        helloMsg() {
            return 'Hello, ' + this.name + '. You have ' + this.shipments + ' shipments.';
        }
    },
    created: function () {
        var self = this;
        $.when(
            $.get( "API/mock-booking-data.json", function (req) {
                self.bookingData.push(req.data);
            }),
            $.get( "API/mock-request-data.json", function (req) {
                self.requestData.push(req.data);
            })
        )
    },
    mounted: function () {
        this.loading = true;
        var self = this;
        setTimeout(function () {
            self.loading = false;
        }, 2000);
    }
})