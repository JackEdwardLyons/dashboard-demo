/* ----------------------------------------------------------------- *\
 * Vue JS
 * Lifecycle hooks: https://alligator.io/vuejs/component-lifecycle/
 * ----------------------------------------------------------------- */


/* Helper Function */
function extendObject ( array, prop ) {
    var result = $.map( array, function(el) {
        var o = $.extend({}, el);
        o[prop] = false;
        return o;
    });
    return result;
}
  

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
            bookingData: [],
            requestData: []
        }
    },
    methods: {
        collapseMenu (index, id) {
            return id ? '#collapse_' + index : 'collapse_' + index;
        },
        collapseIn (index) {
            return this.requestData[index].isOpen = true;
            //console.log(this.requestData[index]);
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

            self.bookingData = extendObject(self.bookingData[0], 'isOpen');
            self.requestData = extendObject(self.requestData[0], 'isOpen');
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