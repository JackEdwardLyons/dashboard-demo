/* ----------------------------------------------------------------- *\
 * Vue JS
 * Lifecycle hooks: https://alligator.io/vuejs/component-lifecycle/
 * ----------------------------------------------------------------- */


// Notes:
// Potentially move data into a accordion-data-table component or 
// webpack compiled .vue files
Vue.component('vue-accordion-component', {
    template: '#vue-accordion-component',
    data: function () {
        return {
            name: 'John',
            shipments: 4,
            loading: false,
            bookingData: [{
                isOpen: false
            }],
            requestData: [{
                isOpen: false
            }]
        }
    },
    methods: {
        collapseMenu (index, id) {
            return id ? '#collapse_' + index : 'collapse_' + index;
        },
        collapseIn (shipment) {
            shipment.isOpen = !shipment.isOpen;
        }
    },
    computed: {
        helloMsg () {
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
        });
    },
    mounted: function () {
        this.loading = true;
        var self = this;
        setTimeout(function () {
            self.loading = false;
        }, 2000);
    }
});

/* The Vue Instance */
new Vue({
    el: '#vue-app'
});