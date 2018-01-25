/* ----------------------------------------------------------------- *\
 * Vue JS
 * Lifecycle hooks: https://alligator.io/vuejs/component-lifecycle/
 * ----------------------------------------------------------------- */


 // Todo:
 // Potentially move data into a accordion-data-table component or 
 // webpack compiled .vue files
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
            $.get( "API/mock-booking-data.json"),
            $.get( "API/mock-request-data.json")
        ).then(function( booking, request ) {
            self.bookingData.push(booking[0].data);
            self.requestData.push(request[0].data);
        })
    },
    mounted: function () {
        this.loading = true;
        var self = this;
        setTimeout(function () {
            self.loading = false;
        }, 2000);
    }
})